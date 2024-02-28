import { env } from "@/env";
import { createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/server/db";
import { conversationParticipants, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "./../trpc";

async function fetchUsersConversations(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
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
}

async function fetchConversationWithAdmin(userId: string) {
  const adminId = env.TRAMONA_ADMIN_USER_ID;

  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
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
                where: eq(conversationParticipants.userId, adminId),
              },
            },
          },
        },
      },
    },
  });

  if (
    result?.conversations &&
    result.conversations.some(
      (conv) => conv.conversation?.participants?.length === 1,
    )
  ) {
    return result;
  } else {
    return null;
  }
}

export const messagesRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const result = await fetchUsersConversations(ctx.user.id);

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

  checkAdminConversation: protectedProcedure.query(async ({ ctx }) => {
    return await fetchConversationWithAdmin(ctx.user.id);
  }),
});
