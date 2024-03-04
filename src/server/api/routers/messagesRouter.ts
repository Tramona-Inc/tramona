import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { conversationParticipants, users } from "@/server/db/schema";
import { zodString } from "@/utils/zod-utils";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { conversations } from "./../../db/schema/tables/messages";
import { protectedProcedure } from "./../trpc";

const ADMIN_ID = env.TRAMONA_ADMIN_USER_ID;

export async function fetchUsersConversations(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {},
    with: {
      conversations: {
        columns: {},
        orderBy: (conversations, { desc }) => [
          desc(conversations.conversationId),
        ],
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
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      conversations: {
        with: {
          conversation: {
            with: {
              participants: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
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

  // Check if conversation contains two participants
  // and check if admin id is in there
  const isAdminInConversation = result?.conversations?.some(
    (conv) =>
      conv.conversation?.participants?.length === 2 &&
      conv.conversation.participants.some(
        (participant) => participant.user.id === ADMIN_ID,
      ),
  );

  return isAdminInConversation ?? false;
}

async function createConversationWithAdmin(userId: string) {
  // Generate conversation and get id
  const [createdConversation] = await db
    .insert(conversations)
    .values({})
    .returning({ id: conversations.id });

  const createdConversationId = createdConversation?.id;

  if (createdConversationId !== undefined) {
    // Insert participants for the user and admin
    const participantValues = [
      { conversationId: createdConversationId, userId: userId },
      { conversationId: createdConversationId, userId: ADMIN_ID },
    ];

    await db.insert(conversationParticipants).values(participantValues);
  }
}

async function addUserToConversation(userId: string, conversationId: number) {
  await db
    .insert(conversationParticipants)
    .values({ conversationId: conversationId, userId: userId });
}

export const messagesRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const result = await fetchUsersConversations(ctx.user.id);

    if (result) {
      return result.conversations.map(({ conversation }) => ({
        ...conversation,
        participants: conversation.participants
          .filter((p) => p.user.id !== ctx.user.id)
          .map((p) => p.user),
      }));
    }

    return [];
  }),

  checkAdminConversation: protectedProcedure.mutation(async ({ ctx }) => {
    const adminConvoExist = await fetchConversationWithAdmin(ctx.user.id);

    // Create conversation with admin if it doesn't exist
    if (!adminConvoExist) {
      void createConversationWithAdmin(ctx.user.id);
    }
  }),

  addUserToConversation: publicProcedure
    .input(
      z.object({
        userId: zodString(),
        conversationId: zodString(),
      }),
    )
    .mutation(async ({ input }) => {
      await addUserToConversation(input.userId, parseInt(input.conversationId));
    }),
});
