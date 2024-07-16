import { createTRPCRouter, roleRestrictedProcedure } from "@/server/api/trpc";
import {
  reviewsInsertSchema,
  reviews,
} from "@/server/db/schema/tables/reviews";
import { z } from "zod";

export const reviewsRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(
      z.object({
        propertyId: z.number(),
        reviews: reviewsInsertSchema.omit({ propertyId: true }).array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(reviews)
        .values(
          input.reviews.map((review) => ({
            ...review,
            propertyId: input.propertyId,
          })),
        );
    }),
});
