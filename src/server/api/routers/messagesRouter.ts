import { env } from "@/env";
import {
  coHostProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  conversationParticipants,
  hostTeamMembers,
  users,
} from "@/server/db/schema";
import { zodString } from "@/utils/zod-utils";
import { and, eq, inArray, ne } from "drizzle-orm";
import { z } from "zod";
import { conversations, messages } from "./../../db/schema/tables/messages";
import { protectedProcedure } from "./../trpc";
import { sendSlackMessage } from "@/server/slack";
import { TRPCError } from "@trpc/server";

const isProduction = process.env.NODE_ENV === "production";
const ADMIN_HOST_TEAM_ID = env.ADMIN_TEAM_ID;
const baseUrl = isProduction
  ? "https://www.tramona.com"
  : "http://localhost:3000";

const ADMIN_ID = env.TRAMONA_ADMIN_USER_ID;
export async function fetchUsersConversations(
  userId: string,
  hostTeamId?: number | null,
) {
  // Fetch all conversations for the user
  const userConversations = await db.query.users.findFirst({
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
                      firstName: true,
                      lastName: true,
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

  // If a hostTeamId is provided, filter conversations based on the hostTeamId
  // if (hostTeamId && userConversations?.conversations) {
  //   userConversations.conversations = userConversations.conversations.filter((conversation) =>
  //     conversation.conversation.participants.some((participant) =>
  //       participant.hostTeamId === hostTeamId
  //     )
  //   );
  // } else if (userConversations?.conversations) {

  //   userConversations.conversations = userConversations.conversations.filter((conversation) =>
  //     conversation.conversation.participants.some((participant) =>
  //       participant.hostTeamId === null
  //     )
  //   );
  // }

  if (hostTeamId && userConversations?.conversations) {
    console.log("hostTeamId", hostTeamId);
    // Host side: Filter by hostTeamId and userId association
    userConversations.conversations = userConversations.conversations.filter(
      (conversation) =>
        conversation.conversation.participants.some(
          (participant) =>
            participant.userId === userId &&
            participant.hostTeamId === hostTeamId,
        ),
    );
  } else if (userConversations?.conversations) {
    console.log("no hostid");
    // Traveler side: Filter by userId association and null hostTeamId
    userConversations.conversations = userConversations.conversations.filter(
      (conversation) =>
        conversation.conversation.participants.some(
          (participant) =>
            participant.userId === userId && participant.hostTeamId === null,
        ),
    );
  }

  return userConversations;
}

export async function fetchConversationWithAdmin(userId: string) {
  console.log("calling fetch converasation with admin");
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
  const conversationWithAdmin = result?.conversations.find(
    (conv) =>
      conv.conversation.participants.length === 2 &&
      conv.conversation.participants.some(
        (participant) => participant.user.id === ADMIN_ID,
      ),
  );
  return conversationWithAdmin?.conversation.id ?? null;
}

export async function fetchConversationWithHostTeam({
  userId,
  hostTeamId,
  propertyId,
  requestId,
}: {
  userId: string;
  hostTeamId: number;
  propertyId?: number;
  requestId?: number;
}) {
  // Get the list of members in the host team
  const hostTeamMembersList = await db.query.hostTeamMembers.findMany({
    where: eq(hostTeamMembers.hostTeamId, hostTeamId),
    columns: { userId: true },
  });

  // Extract user IDs from the host team members
  const hostTeamMemberIds = hostTeamMembersList.map((member) => member.userId);

  if (hostTeamMemberIds.length === 0) {
    // If no members found, return null
    return null;
  }

  // Query the user's conversations
  const userConversations = await db.query.users.findFirst({
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
              property: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Check if there's a conversation that matches the host team's members
  const existingConversation = userConversations?.conversations.find((conv) => {
    const participantIds = conv.conversation.participants.map(
      (participant) => participant.userId,
    );

    // Sort and compare the participant IDs
    const participantsMatch =
      participantIds.length === hostTeamMemberIds.length + 1 &&
      [...participantIds].sort().join(",") ===
        [...hostTeamMemberIds, userId].sort().join(",");

    // Check if the propertyId matches (if provided)
    const propertyIdMatches =
      !propertyId || conv.conversation.property?.id === Number(propertyId);

    // Check if the requestId matches (if provided)
    const requestIdMatches =
      !requestId || conv.conversation.requestId === requestId;

    // Return true only if all criteria match
    return participantsMatch && propertyIdMatches && requestIdMatches;
  });

  console.log(
    existingConversation?.conversation.id,
    "existingConversation?.conversation.id",
  );
  return existingConversation?.conversation.id ?? null;
}

export async function fetchConversationWithOffer(
  userId: string,
  offerId: string,
) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      conversations: {
        with: {
          conversation: {
            columns: {
              offerId: true,
            },
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

  const offerExists = result?.conversations.find(
    (convo) => convo.conversation.offerId === offerId,
  );

  const conversationId = offerExists?.conversationId;

  return conversationId;
}

async function generateConversation({
  propertyId,
  conversationName,
  requestId,
}: {
  propertyId?: number;
  conversationName?: string;
  requestId?: number;
}) {
  return await db
    .insert(conversations)
    .values({
      name: conversationName ? conversationName : null,
      propertyId: propertyId ? Number(propertyId) : null,
      requestId: requestId ? Number(requestId) : null,
    })
    .returning({ id: conversations.id })
    .then((res) => res[0]!.id);
}

export async function createConversationWithAdmin(userId: string) {
  const conversationId = await generateConversation({});

  const hostTeamId = ADMIN_HOST_TEAM_ID;
  const teamMembers = await db.query.hostTeamMembers.findMany({
    where: eq(hostTeamMembers.hostTeamId, hostTeamId),
  });

  const promises = teamMembers.map(async (member) => {
    await db
      .insert(conversationParticipants)
      .values([{ conversationId, userId: member.userId }]);
  });

  await Promise.all(promises);

  await db
    .insert(conversationParticipants)
    .values([{ conversationId, userId: userId }]);

  return conversationId;
}

export async function createConversationWithHostForRequest(
  userId: string,
  hostTeamId: number,
  requestId: number,
) {
  console.log("creating new conversation", requestId);
  const conversationId = await generateConversation({ requestId });
  console.log(conversationId, "conversationId");
  const teamMembers = await db.query.hostTeamMembers.findMany({
    where: eq(hostTeamMembers.hostTeamId, hostTeamId),
  });

  const promises = teamMembers.map(async (member) => {
    await db
      .insert(conversationParticipants)
      .values([
        { conversationId, userId: member.userId, hostTeamId: hostTeamId },
      ]);
  });

  console.log(promises, "promises");

  await Promise.all(promises);

  console.log("after promises");

  await db
    .insert(conversationParticipants)
    .values([{ conversationId, userId: userId }]);

  console.log("after insert");

  return conversationId;
}

export async function createConversationWithHostOrAdminTeam(
  userId: string,
  hostTeamId: number,
  propertyId: number,
) {
  const conversationId = await generateConversation({ propertyId });

  const teamMembers = await db.query.hostTeamMembers.findMany({
    where: eq(hostTeamMembers.hostTeamId, hostTeamId),
  });

  const promises = teamMembers.map(async (member) => {
    await db
      .insert(conversationParticipants)
      .values([
        { conversationId, userId: member.userId, hostTeamId: hostTeamId },
      ]);
  });

  await Promise.all(promises);

  await db
    .insert(conversationParticipants)
    .values([{ conversationId, userId: userId }]);

  return conversationId;
}

// export async function createConversationWithOfferHelper(
//   userId: string,
//   propertyName: string,
//   offerId: string,
//   hostTeamId: number,
// ) {
//   const conversationId = await generateConversation(propertyName, offerId);

//   const teamMembers = await db.query.hostTeamMembers.findMany({
//     where: eq(hostTeamMembers.hostTeamId, hostTeamId),
//   });
//   const promises = teamMembers.map(async (member) => {
//     await db.insert(conversationParticipants).values([
//       { conversationId, userId: member.userId, hostTeamId: hostTeamId },
//     ]);
//   });
//   await Promise.all(promises);
//   await db.insert(conversationParticipants).values([
//     { conversationId, userId: userId },
//   ]);

//   return conversationId;
// }

async function addUserToConversation(userId: string, conversationId: string) {
  await db
    .insert(conversationParticipants)
    .values({ conversationId: conversationId, userId: userId });
}

// export async function addTwoUserToConversation(
//   user1Id: string,
//   user2Id: string,
// ) {
//   const conversationId = await generateConversation();

//   await db.insert(conversationParticipants).values([
//     { conversationId, userId: user1Id },
//     { conversationId, userId: user2Id },
//   ]);

//   return conversationId;
// }

async function verifyConversationExists(conversationId: string) {
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });
  return !!conversation;
}

export const messagesRouter = createTRPCRouter({
  getConversations: protectedProcedure
    .input(
      z.object({
        hostTeamId: z.number().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await fetchUsersConversations(
        ctx.user.id,
        input.hostTeamId,
      );

      if (result) {
        const orderedConversations = result.conversations.map(
          ({ conversation }) => ({
            ...conversation,
            participants: conversation.participants
              .filter((p) => p.user.id !== ctx.user.id)
              .map((p) => p.user)
              .filter(Boolean),
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

  createConversationWithAdmin: protectedProcedure.mutation(async ({ ctx }) => {
    const conversationId = await fetchConversationWithAdmin(ctx.user.id);

    // Create conversation with admin if it doesn't exist
    if (!conversationId) {
      return await createConversationWithAdmin(ctx.user.id);
    }

    return conversationId;
  }),

  createConversationHostWithUserForRequest: coHostProcedure(
    "communicate_with_guests",
    z.object({
      userId: zodString(),
      currentHostTeamId: z.number(),
      requestId: z.number(),
    }),
  ).mutation(async ({ input }) => {
    const conversationId = await fetchConversationWithHostTeam({
      userId: input.userId,
      hostTeamId: input.currentHostTeamId,
      requestId: input.requestId,
    });

    console.log(conversationId, "conversationId");

    console.log(input, "input");
    if (!conversationId) {
      console.log("creating new conversation");
      const newConversationId = await createConversationWithHostForRequest(
        input.userId,
        input.currentHostTeamId,
        input.requestId,
      );
      return { id: newConversationId };
    }

    return { id: conversationId };
  }),

  createConversationHostWithUser: coHostProcedure(
    "communicate_with_guests",
    z.object({
      userId: zodString(),
      currentHostTeamId: z.number(),
      propertyId: z.number(),
    }),
  ).mutation(async ({ input }) => {
    const conversationId = await fetchConversationWithHostTeam({
      userId: input.userId,
      hostTeamId: input.currentHostTeamId,
      propertyId: input.propertyId,
    });

    if (!conversationId) {
      const newConversationId = await createConversationWithHostOrAdminTeam(
        input.userId,
        input.currentHostTeamId,
        input.propertyId,
      );
      return { id: newConversationId };
    }

    return { id: conversationId };
  }),

  createConversationWithHostOrAdminTeam: protectedProcedure
    .input(
      z.object({
        hostId: zodString(),
        hostTeamId: z.number().optional(),
        propertyId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.hostTeamId) {
        input.hostTeamId = ADMIN_HOST_TEAM_ID;
      }
      const conversationId = await fetchConversationWithHostTeam({
        userId: ctx.user.id,
        hostTeamId: input.hostTeamId,
        propertyId: input.propertyId,
      });

      if (!conversationId) {
        return await createConversationWithHostOrAdminTeam(
          ctx.user.id,
          input.hostTeamId,
          input.propertyId,
        );
      }

      return conversationId;
    }),

  // for guest only
  createConversationWithAdminFromGuest: publicProcedure
    .input(
      z.object({
        sessionToken: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const tempUser = await db.query.users.findFirst({
        where: eq(users.sessionToken, input.sessionToken),
      });

      if (!tempUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guest Temporary User not found",
        });
      }

      let conversationId = null;
      conversationId = await fetchConversationWithAdmin(tempUser.id);
      // Create conversation with admin if it doesn't exist
      if (!conversationId) {
        conversationId = await createConversationWithAdmin(tempUser.id);
      }

      return { tempUserId: tempUser.id, conversationId: conversationId };
    }),

  addUserToConversation: publicProcedure
    .input(
      z.object({
        userId: zodString(),
        conversationId: zodString(),
      }),
    )
    .mutation(async ({ input }) => {
      await addUserToConversation(input.userId, input.conversationId);
    }),

  setMessageToRead: protectedProcedure
    .input(
      z.object({
        messageId: zodString(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: add error checking
      return await ctx.db
        .update(messages)
        .set({ read: true })
        .where(eq(messages.id, input.messageId));
    }),
  // addTwoUsersToConversation: protectedProcedure
  //   .input(
  //     z.object({
  //       user1Id: zodString(),
  //       user2Id: zodString(),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const conversationId = await addTwoUserToConversation(
  //       input.user1Id,
  //       input.user2Id,
  //     );
  //     return conversationId;
  //   }),

  getParticipantsPhoneNumbers: protectedProcedure
    .input(z.object({ conversationId: zodString() }))
    .query(async ({ ctx, input }) => {
      const participants = await db
        .select({
          id: users.id,
          phoneNumber: users.phoneNumber,
          lastTextAt: users.lastTextAt,
          isWhatsApp: users.isWhatsApp,
          isBurner: users.isBurner,
        })
        .from(conversationParticipants)
        .innerJoin(users, eq(conversationParticipants.userId, users.id))
        .where(
          and(
            eq(conversationParticipants.conversationId, input.conversationId),
            ne(conversationParticipants.userId, ctx.user.id),
          ),
        );
      return participants;
    }),

  getNumUnreadMessages: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: {
          conversations: {
            columns: {},
            with: {
              conversation: {
                columns: {},
                with: {
                  messages: {
                    columns: { id: true },
                    where: and(
                      eq(messages.read, false),
                      ne(messages.userId, ctx.user.id),
                    ),
                  },
                },
              },
            },
          },
        },
      })
      .then((res) => {
        if (!res) return 0; // No result found, so return 0 unread messages

        // Iterate over conversations and calculate sum of message lengths
        let totalLength = 0;
        res.conversations.forEach((conv) => {
          totalLength += conv.conversation.messages.length;
        });
        return totalLength;
      });
  }),
  setMessagesToRead: protectedProcedure
    .input(
      z.object({
        unreadMessageIds: z.string().array(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .update(messages)
        .set({ read: true })
        .where(inArray(messages.id, input.unreadMessageIds));
    }),
  sendAdminSlackMessage: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        conversationId: z.string(),
        senderId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      //find the receiver of the message
      const sender = await db.query.users.findFirst({
        where: eq(users.id, input.senderId),
      });
      const receiver = await db.query.conversationParticipants
        .findFirst({
          where: and(
            eq(conversationParticipants.conversationId, input.conversationId),
            ne(conversationParticipants.userId, input.senderId),
          ),
          with: {
            user: {
              columns: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        })
        .then((res) => res?.user);
      //check to see if the receipt is the admin
      if (receiver?.role !== "admin") return;
      //if admin then send slack from the to and from
      await sendSlackMessage({
        channel: "admin-messaging",
        isProductionOnly: true,
        text: [
          `*${sender?.email} sent a message to admin*`,
          `${input.message}`,
          `<${baseUrl}/messages/${input.conversationId}|Click here to respond>`,
        ].join("\n"),
      });
    }),

  sendChatboxSlackMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        conversationId: z.string(),
        senderId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      //find the receiver of the message
      const receiver = await db.query.conversationParticipants
        .findFirst({
          where: and(
            eq(conversationParticipants.conversationId, input.conversationId),
            ne(conversationParticipants.userId, input.senderId),
          ),
          with: {
            user: {
              columns: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        })
        .then((res) => res?.user);

      const sender = await db.query.users.findFirst({
        where: eq(users.id, input.senderId),
      });

      function getSenderName() {
        if (sender) {
          if (sender.firstName === null || sender.lastName === null) {
            return "logged out user";
          } else {
            return sender.firstName + " " + sender.lastName;
          }
        }
      }
      await sendSlackMessage({
        channel: "chatbox",
        isProductionOnly: false,
        text: [
          `*${receiver?.email} received a message from ${getSenderName()}*`,
          `${input.message}`,
          `<${baseUrl}/messages/${input.conversationId}|Click here to respond>`,
        ].join("\n"),
      });
    }),

  getConversationsWithAdmin: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        sessionToken: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let conversationId = null;
      let tempUser = null;
      if (
        ctx.session?.user.role === "admin" ||
        ctx.session?.user.role === "host"
      ) {
        return null;
      }
      if (!input.userId && input.sessionToken) {
        tempUser = await db.query.users.findFirst({
          where: eq(users.sessionToken, input.sessionToken),
        });
        if (tempUser) {
          conversationId = await fetchConversationWithAdmin(tempUser.id);
        } else {
          return null;
          // throw new TRPCError({
          //   code: "NOT_FOUND",
          //   message: "Guest Temporary User not found",
          // });
        }
      } else if (input.userId) {
        // if both userId and sessionToken are provided, userId will be used
        conversationId = await fetchConversationWithAdmin(input.userId);
      } else if (!input.userId && !input.sessionToken) {
        return null; // when the page renders for the first time, the tRPC call will hit here
      }

      if (!conversationId) {
        return null;
        // throw new TRPCError({
        //   code: "NOT_FOUND",
        //   message: "conversationId not found",
        // });
      }

      return { conversationId, tempUserId: tempUser?.id };
    }),

  createMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const exists = await verifyConversationExists(input.conversationId);
      if (!exists) {
        throw new Error("Conversation not found");
      }
      // proceed with message creation
    }),
});
