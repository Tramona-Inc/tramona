import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const messagesRouter = createTRPCRouter({
  getParticipants: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {},
      with: {
        conversations: {
          columns: {},
          with: {
            conversation: {
              with: {
                messages: { limit: 1 },
                participants: {
                  with: {
                    user: {
                      columns: { name: true, email: true, image: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return result.conversations.map(({ conversation }) => ({
      ...conversation,
      participants: conversation.participants.map((p) => p.user),
    }));
  }),
});
