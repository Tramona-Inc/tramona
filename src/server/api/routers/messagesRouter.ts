import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const messagesRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {},
      with: {
        conversations: {
          columns: {},
          with: {
            conversation: {
              with: {
                messages: {
                  orderBy: (messages, { desc }) => [desc(messages.createdAt)],
                  limit: 1,
                },
                participants: {
                  with: {
                    user: {
                      columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                      },
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
      participants: conversation.participants
        .filter((p) => p.user.id !== ctx.user.id)
        .map((p) => p.user),
    }));
  }),
});
