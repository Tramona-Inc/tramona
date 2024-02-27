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
import { getRequestStatus } from "@/utils/formatters";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const requestsRouter = createTRPCRouter({
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    const myRequests = await db.query.requests
      .findMany({
        where: eq(requests.userId, ctx.user.id),
        with: {
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
            columns: { email: true },
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
    }),

  // resolving a request with no offers = reject

  // requests are automatically resolved when they have offers but
  // this might change in the future (e.g. "here's an offer but more are on the way")

  // Only admins can reject requests for now

  // in the future, well need to validate that a host actually received the request,
  // or else a malicious host could reject any request

  resolve: roleRestrictedProcedure(["admin"])
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(requests)
        .set({ resolvedAt: new Date() })
        .where(eq(requests.id, input.id));
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
