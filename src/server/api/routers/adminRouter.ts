import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getRequests: protectedProcedure.query(async ({ ctx }) => {
    await ctx.db.query.requests.findMany({
      orderBy: (requests, { desc }) => [desc(requests.createdAt)],
    });
  }),
});
