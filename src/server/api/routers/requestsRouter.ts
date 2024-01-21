import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  requestInsertSchema,
  requestSelectSchema,
  requests,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const requestsRouter = createTRPCRouter({
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    const myRequests = await ctx.db.query.requests
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
        res.map((request) => {
          const hostImages = request.offers
            .map((offer) => offer.property.host?.image)
            .filter(Boolean);

          const numOffers = request.offers.length;

          const { offers: _, ...requestExceptOffers } = request;

          return { ...requestExceptOffers, hostImages, numOffers };
        }),
      );

    const activeRequests = myRequests
      .filter((request) => request.resolvedAt === null)
      .map((request) => ({ ...request, resolvedAt: null })) // because ts is dumb
      .sort(
        (a, b) =>
          b.numOffers - a.numOffers ||
          b.createdAt.getTime() - a.createdAt.getTime(),
      );

    const inactiveRequests = myRequests
      .filter((request) => request.resolvedAt !== null)
      .map((request) => ({
        ...request,
        resolvedAt: request.resolvedAt ?? new Date(),
      })) // because ts is dumb, new Date will never actually happen
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      activeRequests,
      inactiveRequests,
    };
  }),

  // getAllIncoming: roleRestrictedProcedure(["host", "admin"]).query(
  //   async ({ ctx, input }) => {
  //     // get the requests close to this users properties
  //   },
  // ),

  getAll: roleRestrictedProcedure(["admin"]).query(async ({ ctx }) => {
    return await ctx.db.query.requests.findMany(
      { orderBy: (requests, { desc }) => [desc(requests.createdAt)] }, // filter from most recent
    );
  }),

  create: protectedProcedure
    .input(requestInsertSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(requests).values({
        ...input,
        userId: ctx.user.id,
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
