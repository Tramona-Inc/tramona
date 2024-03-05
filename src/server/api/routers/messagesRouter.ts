import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { conversationParticipants, users } from "@/server/db/schema";
import { zodNumber, zodString } from "@/utils/zod-utils";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { conversations, messages } from "./../../db/schema/tables/messages";
import { protectedProcedure } from "./../trpc";

const ADMIN_ID = env.TRAMONA_ADMIN_USER_ID;

export async function fetchUsersConversations(userId: string) {
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

async function generateConversation() {
  const [createdConversation] = await db
    .insert(conversations)
    .values({})
    .returning({ id: conversations.id });

  return createdConversation?.id;
}

export async function createConversationWithAdmin(userId: string) {
  // Generate conversation and get id
  const createdConversationId = await generateConversation();

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

export async function addTwoUserToConversation(
  user1Id: string,
  user2Id: string,
) {
  // Generate conversation and get id
  const createdConversationId = await generateConversation();

  if (createdConversationId !== undefined) {
    // Insert participants for the user and admin
    const participantValues = [
      { conversationId: createdConversationId, userId: user1Id },
      { conversationId: createdConversationId, userId: user2Id },
    ];

    await db.insert(conversationParticipants).values(participantValues);
  }
}

export const messagesRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const result = await fetchUsersConversations(ctx.user.id);

    if (result) {
      const orderedConversations = result.conversations.map(
        ({ conversation }) => ({
          ...conversation,
          participants: conversation.participants
            .filter((p) => p.user.id !== ctx.user.id)
            .map((p) => p.user),
        }),
      );

      // Order conversations by the most recent activity (conversation or message creation)
      orderedConversations.sort((a, b) => {
        // Get the conversation's createdAt date
        const aConversationDate = new Date(a.createdAt);
        const bConversationDate = new Date(b.createdAt);

        // Get the latest message's createdAt date, or use the conversation's createdAt date if no messages
        const aLatestMessageDate = a.messages[0]
          ? new Date(a.messages[0].createdAt)
          : aConversationDate;
        const bLatestMessageDate = b.messages[0]
          ? new Date(b.messages[0].createdAt)
          : bConversationDate;

        // Use the most recent of the two dates for comparison
        const aMostRecentDate =
          aLatestMessageDate > aConversationDate
            ? aLatestMessageDate
            : aConversationDate;
        const bMostRecentDate =
          bLatestMessageDate > bConversationDate
            ? bLatestMessageDate
            : bConversationDate;

        // Sort in descending order of the most recent activity
        return bMostRecentDate.getTime() - aMostRecentDate.getTime();
      });

      return orderedConversations;
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

  setMessageToRead: protectedProcedure
    .input(
      z.object({
        messageId: zodNumber(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: add error checking
      return await ctx.db
        .update(messages)
        .set({ read: true })
        .where(eq(messages.id, input.messageId));
    }),
  addTwoUsersToConversation: protectedProcedure
    .input(
      z.object({
        user1Id: zodString(),
        user2Id: zodString(),
      }),
    )
    .mutation(async ({ input }) => {
      await addTwoUserToConversation(input.user1Id, input.user2Id);
    }),
});
