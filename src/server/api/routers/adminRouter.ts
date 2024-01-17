import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createRequestInputSchema } from "../schema/admin.schema";
import { requests } from "@/server/db/schema/tables/requests";

export const adminRouter = createTRPCRouter({
  getRequests: protectedProcedure.query(async ({ ctx }) => {
    await ctx.db.query.requests.findMany({
      orderBy: (requests, { desc }) => [desc(requests.createdAt)],
    });
  }),

  createRequest: protectedProcedure
    .input(createRequestInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(requests).values({
        userId: ctx.user.id,
        maxPreferredPrice: input.max_preferred_price,
        location: input.location,
        checkIn: input.check_in,
        checkOut: input.check_out,
        numGuests: input.num_guests,
        propertyType: input.property_type,
        note: input.note,
        resolvedAt: null,
      });
    }),
});
