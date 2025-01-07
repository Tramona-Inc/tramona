import {
  createTRPCRouter,
  hostProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  propertyMessages,
  propertyConversations,
  properties,
} from "@/server/db/schema";
import { zodString } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import { eq, desc, inArray, and, isNull, ne, lt } from "drizzle-orm";
import { sortBy } from "lodash";
import { z } from "zod";

export const propertyMessagesRouter = createTRPCRouter({
  getTravelerConversations: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.propertyConversations
      .findMany({
        where: eq(propertyConversations.travelerId, ctx.user.id),
        with: {
          property: {
            columns: { id: true, name: true, imageUrls: true },
            with: { hostTeam: true },
          },
          messages: {
            limit: 1,
            orderBy: desc(propertyMessages.createdAt),
            with: {
              author: { columns: { id: true, name: true } },
            },
          },
        },
      })
      .then((convos) =>
        convos.map(({ messages, ...convo }) => ({
          ...convo,
          latestMessage: messages[0]!,
        })),
      )
      .then((convos) => sortBy(convos, (c) => -c.latestMessage.createdAt));
  }),

  getHostTeamConversations: hostProcedure
    .input(z.object({ currentHostTeamId: z.number() }))
    .query(async ({ input }) => {
      // all conversations whose property belongs to the host team
      return await db.query.propertyConversations.findMany({
        where: inArray(
          propertyConversations.propertyId,
          db
            .select()
            .from(properties)
            .where(eq(properties.hostTeamId, input.currentHostTeamId)),
        ),
        with: {
          traveler: {
            columns: { id: true, name: true, email: true, image: true },
          },
          messages: {
            limit: 1,
            orderBy: desc(propertyMessages.createdAt),
          },
        },
      });
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        beforeMessageId: z.string().optional(),
      }),
    )
    .query(async ({ input: { conversationId, beforeMessageId } }) => {
      const before = beforeMessageId
        ? await db
            .select()
            .from(propertyMessages)
            .where(eq(propertyMessages.id, beforeMessageId))
            .then((res) => res[0]!.createdAt)
        : undefined;

      return await db.query.propertyMessages.findMany({
        where: and(
          eq(propertyMessages.conversationId, conversationId),
          before ? lt(propertyMessages.createdAt, before) : undefined,
        ),
        with: {
          author: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
        orderBy: desc(propertyMessages.createdAt),
        limit: 30,
      });
    }),

  getConversationDetails: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      const conversation = await db.query.propertyConversations.findFirst({
        where: eq(propertyConversations.id, input.conversationId),
        with: {
          offer: true,
          requestToBook: true,
          trip: true,
          property: {
            columns: {
              id: true,
              imageUrls: true,
              name: true,
              city: true,
              stateCode: true,
              country: true,
              countryISO: true,
            },
            with: {
              hostTeam: {
                with: {
                  members: {
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

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Conversation not found with id ${input.conversationId}`,
        });
      }

      return conversation;
    }),

  getTravelerNumUnreadMessages: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.propertyMessages
      .findMany({
        where: and(
          isNull(propertyMessages.readAt),
          ne(propertyMessages.authorId, ctx.user.id),
        ),
      })
      .then((res) => res.length);
  }),

  readConversationAsTraveler: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(propertyMessages)
        .set({ readAt: new Date() })
        .where(
          and(
            isNull(propertyMessages.readAt),
            ne(propertyMessages.authorId, ctx.user.id),
            eq(propertyMessages.conversationId, input.conversationId),
          ),
        );
    }),

  /**
   * this and `readConversationAsHost` are different because when 1 member of the
   * host team reads a message, it reads it on behalf of all the other members
   */
  getHostNumUnreadMessages: hostProcedure.query(async ({ ctx }) => {
    return await db.query.propertyMessages
      .findMany({
        where: and(
          isNull(propertyMessages.readAt),
          eq(propertyMessages.authorId, ctx.user.id),
        ),
      })
      .then((res) => res.length);
  }),

  readConversationAsHost: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(propertyMessages)
        .set({ readAt: new Date() })
        .where(
          and(
            isNull(propertyMessages.readAt),
            eq(propertyMessages.authorId, ctx.user.id),
            eq(propertyMessages.conversationId, input.conversationId),
          ),
        );
    }),

  createConversationAsTraveler: protectedProcedure
    .input(z.object({ propertyId: z.number(), firstMessage: zodString() }))
    .mutation(async ({ input, ctx }) => {
      const conversationId = await db
        .insert(propertyConversations)
        .values({
          travelerId: ctx.user.id,
          propertyId: input.propertyId,
        })
        .returning()
        .then((res) => res[0]!.id);

      await db.insert(propertyMessages).values({
        conversationId,
        message: input.firstMessage,
        authorId: ctx.user.id,
      });

      return { conversationId };
    }),

  createConversationAsHost: hostProcedure
    .input(
      z.object({
        travelerId: z.string(),
        propertyId: z.number(),
        firstMessage: zodString(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const conversationId = await db
        .insert(propertyConversations)
        .values({
          travelerId: input.travelerId,
          propertyId: input.propertyId,
        })
        .returning()
        .then((r) => r[0]!.id);

      await db.insert(propertyMessages).values({
        conversationId,
        message: input.firstMessage,
        authorId: ctx.user.id,
      });

      return { conversationId };
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        message: zodString(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await db.insert(propertyMessages).values({
        conversationId: input.conversationId,
        message: input.message,
        authorId: ctx.user.id,
      });
    }),

  editMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
        message: zodString(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .update(propertyMessages)
        .set({ message: input.message, editedAt: new Date() })
        .where(eq(propertyMessages.id, input.messageId));
    }),
});
