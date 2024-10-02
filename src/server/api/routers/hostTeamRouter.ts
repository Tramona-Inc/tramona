import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// CO-HOST ROLES: strict, medium, loose

export const hostTeamRouter = createTRPCRouter({
  updateCohostRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        coHostRole: z.enum(["strict", "medium", "loose"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ coHostRole: input.coHostRole })
        .where(eq(users.id, input.userId));
    }),
});
