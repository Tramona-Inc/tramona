import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { llamaClient } from "@/server/llama";
import { flaggedMessages } from "@/server/db/schema/tables/messages";
import { TRPCError } from "@trpc/server";

export const llamaRouter = createTRPCRouter({
    checkMessage: protectedProcedure
        .input(
            z.object({
                message: z.string(),
                conversationId: z.string(),
                messageId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                // debugging purposes
                console.log("Calling moderateContent, llamaRouter.ts");

                const result = await llamaClient.moderateContent(input.message);

                // debugging purposes
                console.log("llamaRouter.ts: Moderation result: ", result);

                return {
                    success: true,
                    result,
                };
            } catch (error) {
                console.error("Moderation error:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to moderate message",
                });
            }
        }),
});