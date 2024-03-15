import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  requestInsertSchema,
  requestSelectSchema,
  requests,
} from "@/server/db/schema";
import { sendSlackMessage } from "@/server/slack";
import { getRequestStatus } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendText } from "@/server/server-utils";

export const requestsRouter = createTRPCRouter({
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    const myRequests = await db.query.requests
      .findMany({
        where: eq(requests.userId, ctx.user.id),
        with: {
          madeByUser: {
            columns: { email: true, phoneNumber: true },
          },
          offers: {
            columns: {},
            with: {
              property: {
                columns: {},
                with: { host: { columns: { image: true } } },
              },
            },
          },
        },
      })
      .then((res) =>
        res
          .map((request) => {
            const hostImages = request.offers
              .map((offer) => offer.property.host?.image)
              .filter(Boolean);

            const numOffers = request.offers.length;

            const { offers: _, ...requestExceptOffers } = request;

            return { ...requestExceptOffers, hostImages, numOffers };
          })
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
              b.createdAt.getTime() - a.createdAt.getTime(),
          ),
      );

    const activeRequests = myRequests
      .filter((request) => request.resolvedAt === null)
      .map((request) => ({ ...request, resolvedAt: null })); // because ts is dumb

    const inactiveRequests = myRequests
      .filter((request) => request.resolvedAt !== null)
      .map((request) => ({
        ...request,
        resolvedAt: request.resolvedAt ?? new Date(),
      })); // because ts is dumb, new Date will never actually happen

    return {
      activeRequests,
      inactiveRequests,
    };
  }),

  getAll: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.requests
      .findMany({
        with: {
          madeByUser: {
            columns: { email: true, phoneNumber: true },
          },
          offers: { columns: { id: true } },
        },
      })
      // doing this until drizzle adds aggregations for
      // relational queries lol
      .then((res) =>
        res
          .map((req) => {
            const { offers, ...reqWithoutOffers } = req;
            return { ...reqWithoutOffers, numOffers: offers.length };
          })
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
              a.createdAt.getTime() - b.createdAt.getTime(),
          ),
      )
      .then((res) => ({
        incomingRequests: res.filter(
          (req) => getRequestStatus(req) === "pending",
        ),
        pastRequests: res.filter((req) => getRequestStatus(req) !== "pending"),
      }));
  }),

  // getAllIncoming: roleRestrictedProcedure(["host", "admin"]).query(
  //   async ({ ctx, input }) => {
  //     // get the requests close to this users properties
  //   },
  // ),

  create: protectedProcedure
    .input(requestInsertSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(requests).values({
        ...input,
        userId: ctx.user.id,
      });

      const name = ctx.user.name ?? ctx.user.email ?? "Someone";
      const pricePerNight =
        input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut);
      const fmtdPrice = formatCurrency(pricePerNight);
      const fmtdDateRange = formatDateRange(input.checkIn, input.checkOut);
      const fmtdNumGuests = plural(input.numGuests ?? 1, "guest");

      if (env.NODE_ENV === "production") {
        sendSlackMessage(
          `*${name} just made a request: ${input.location}*`,
          `requested ${fmtdPrice}/night · ${fmtdDateRange} · ${fmtdNumGuests}`,
          `<https://tramona.com/admin|Go to admin dashboard>`,
        );
      }
    }),

  // 10 requests limit
  createMultiple: protectedProcedure
    .input(requestInsertSchema.omit({ userId: true }).array())
    .mutation(async ({ ctx, input }) => {
      if (input.length > 10) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot create more than 10 requests at a time",
        });
      }

      await ctx.db.transaction((tx) =>
        Promise.allSettled(
          input.map((req) =>
            tx.insert(requests).values({
              ...req,
              userId: ctx.user.id,
            }),
          ),
        ),
      );

      const name = ctx.user.name ?? ctx.user.email ?? "Someone";

      if (env.NODE_ENV === "production") {
        sendSlackMessage(
          `*${name} just made ${input.length} requests*`,
          `<https://tramona.com/admin|Go to admin dashboard>`,
        );
      }
    }),

  // resolving a request with no offers = reject

  // requests are automatically resolved when they have offers but
  // this might change in the future (e.g. "here's an offer but more are on the way")

  // Only admins can reject requests for now

  // in the future, well need to validate that a host actually received the request,
  // or else a malicious host could reject any request
  updateConfirmation: protectedProcedure
    .input(z.object({ requestId: z.number(), phoneNumber: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(requests)
        .set({ confirmationSentAt: new Date() })
        .where(eq(requests.id, input.requestId));

      await sendText({
        to: input.phoneNumber,
        content:
          "You just submitted a request on Tramona! Reply 'YES' if you're serious about your travel plans and we can send the request to our network of hosts!",
      });
    }),

  resolve: roleRestrictedProcedure(["admin"])
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
        columns: {
          location: true,
          checkIn: true,
          checkOut: true,
        },
        with: {
          madeByUser: {
            columns: { phoneNumber: true },
          },
        },
      });

      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db
        .update(requests)
        .set({ resolvedAt: new Date() })
        .where(eq(requests.id, input.id));

      void sendText({
        to: request.madeByUser.phoneNumber!,
        content: `Your request to ${request.location} has been rejected, please submit another request with looser requirements.`,
      });
    }),

  delete: protectedProcedure
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
        columns: {
          userId: true,
        },
      });

      // Only users and admin can delete
      if (ctx.user.role === "admin" || request?.userId === ctx.user.id) {
        await ctx.db.delete(requests).where(eq(requests.id, input.id));
      } else {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),
});
