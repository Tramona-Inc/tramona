import { createTRPCRouter } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { TramonaDatabase } from '@/types';
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "./../trpc";

async function fetchUsersConversations(userId: string, db: TramonaDatabase) {
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


export const messagesRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const result = await fetchUsersConversations(ctx.user.id, ctx.db);

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

  createConversation: protectedProcedure.mutation(async ({ ctx }) => {
    const adminId = process.env.TRAMONA_ADMIN_USER_ID;

    const result = await fetchUsersConversations(ctx.user.id, ctx.db);

    return null;
  }),
});
