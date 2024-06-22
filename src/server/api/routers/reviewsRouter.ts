import {
  createTRPCRouter,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { reviewsUpdateSchema, reviewsInsertSchema, reviews } from "@/server/db/schema/tables/reviews";

export const reviewsRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(reviewsInsertSchema)
    .mutation(async ({ ctx, input }) => {


      await ctx.db
        .insert(reviews)
        .values({
          ...input,
        })
    }),
});