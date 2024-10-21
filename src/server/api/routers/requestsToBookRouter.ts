import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { requestsToBook, requestsToBookInsertSchema } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const requestsToBookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      requestsToBookInsertSchema.omit({
        id: true,
        createdAt: true,
        userId: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newRequest = await db.insert(requestsToBook).values({
        ...input,
        userId: ctx.user.id,
      }).returning();

      if (!newRequest[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create request to book",
        });
      }

      return newRequest[0];
    }),
});