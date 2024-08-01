import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { conversationParticipants, users } from "@/server/db/schema";
import { zodString } from "@/utils/zod-utils";
import { and, eq, inArray, ne } from "drizzle-orm";
import { input, z } from "zod";
import { conversationGuests, conversations, guestMessages, messages } from "./../../db/schema/tables/messages";
import { protectedProcedure } from "./../trpc";
import { columns } from "@/components/admin/view-recent-host/table/columns";
import { getAdminId } from "@/server/server-utils";


const ADMIN_ID = await getAdminId()


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

export async function fetchGuestConversation(conversationId: string) {
  return await db.query.conversationGuests.findFirst({
    where: eq(conversations.id, conversationId),
    columns:{},
    with:{
        conversations:{
          with:{
            guest_messages:{
              orderBy: (guest_messages, {desc}) => [desc(guest_messages.createdAt)],
              limit: 1,
            },
            guest_participants:{
              columns: {
                conversationId: true,
                userToken: true,
                adminId: true,
              }
            }
          }
        }
      }
    })
  }

export async function fetchAdminConversations() {
  const result = await db.query.conversationGuests.findMany({
    where: eq(conversationGuests.adminId, ADMIN_ID ?? ""),
    columns: {},
    with: {
      conversations:{
        with:{
          guest_messages:{
            orderBy: (guest_messages, {desc}) => [desc(guest_messages.createdAt)],
            limit: 1,
          },
          guest_participants: {
            columns: {
              conversationId: true,
              userToken: true,
              adminId: true,
            }
          }
        }
      }
    }
  })
  return result;
}


export async function fetchConversationWithAdmin(userId: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with:{
      conversations:{
        with:{
          conversation:{
            with:{
              participants:{
                with:{
                  user:{
                    columns: {
                      id:true,
                      name: true,
                      email: true,
                      image:true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  // Check if conversation contains two participants
  // and check if admin id is in there
  console.log(result)
  const conversationWithAdmin = result?.conversations.find(
    (conv) =>
      conv.conversation.participants.length === 2 &&
      conv.conversation.participants.some(
        (participant) => participant.user?.id === ADMIN_ID,
      ),
  );
  console.log("conversation Id", conversationWithAdmin?.conversation.id)
  return conversationWithAdmin?.conversation.id ?? null;
}

//fetchconversation, if user is not logged in, with tempToken
export async function fetchConversationWithAdminWithoutUser(userToken: string){
  const result = await db.query.conversationGuests.findFirst({
    where: eq(conversationGuests.userToken, userToken),
})
return result?.conversationId;
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

  const offerExists = result?.conversations.some(
    (convo) => convo.conversation.offerId === offerId,
  );

  return offerExists;
}

async function generateConversation(
  conversationName?: string,
  offerId?: string,
) {
  const [createdConversation] = await db
    .insert(conversations)
    .values({ name: conversationName ? conversationName : null, offerId })
    .returning({ id: conversations.id });

  return createdConversation?.id;
}

export async function createConversationWithAdmin(userId: string, userToken: string) {
  // Generate conversation and get id
  const createdConversationId = await generateConversation();
  if(!userId && createdConversationId !== undefined){
    const participantValues = { 
      conversationId: createdConversationId,
      userToken: userToken, 
      adminId: ADMIN_ID 
    };
    // const participantValues = [
    //   { conversationId: createdConversationId, userToken: userToken },
    //   { conversationId: createdConversationId, ad: ADMIN_ID },
    // ]
    await db.insert(conversationGuests).values(participantValues);
    // console.log("insert into cp");
    return createdConversationId;
  }

  if (createdConversationId !== undefined) {
    // Insert participants for the user and admin
    const participantValues = [
      { conversationId: createdConversationId, userId: userId },
      { conversationId: createdConversationId, userId: ADMIN_ID },
    ];

    await db.insert(conversationParticipants).values(participantValues);
    // console.log("insert into cp");
    return createdConversationId;
  }
}

export async function createConversationWithOffer(
  userId: string,
  offerUserId: string,
  propertyName: string,
  offerId: string,
) {
  // Generate conversation and get id
  const createdConversationId = await generateConversation(
    propertyName,
    offerId,
  );

  if (createdConversationId !== undefined) {
    // Insert participants for the user and admin
    const participantValues = [
      { conversationId: createdConversationId, userId: userId },
      { conversationId: createdConversationId, userId: offerUserId },
    ];

    await db.insert(conversationParticipants).values(participantValues);

    return createdConversationId;
  }
}

async function addUserToConversation(userId: string, conversationId: string) {
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

  fetchAdminId:protectedProcedure
  .query(async ({ctx}) => {
    if(ctx.user.id === process.env.TRAMONA_USER_ADMIN_ID){
      const adminId = process.env.TRAMONA_USER_ADMIN_ID
      return adminId
    } else if(ctx.user.role === "admin") {
      const adminId = ctx.user.id
      return adminId
    } else {
      const adminId = await getAdminId();
      return adminId
    }
  }),

  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const result = await fetchUsersConversations(ctx.user.id);

    if (result) {
      const orderedConversations = result.conversations.map(
        ({ conversation }) => ({
          ...conversation,
          participants: conversation.participants
            .filter((p) => p.user?.id !== ctx.user.id)
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

  

  fetchAdminDetails: publicProcedure
  .input(z.object(
    {adminId: z.string(),}
  ))
  .query(async ({input}) => {
    const result = await db.query.users.findFirst(
      {
        where: eq(users.id, input.adminId),
        columns: {
          name: true,
          image: true,
        }
      }
    )
    return result;
  }),

  getConversationWithGuest: publicProcedure
  .input(z.object({
    conversationId: z.string(),
  }))
  .query(async ({input}) => {
    const result = await fetchGuestConversation(input.conversationId);
    return result;
  }),

  getConversationForAdmin: publicProcedure
  .query(async () => {
    // const adminId = messagesRouter.fetchAdminId({ctx})
    const result = await fetchAdminConversations();
    if(result){
      const adminConversation = result.map((conversation) => ({
        ...conversation.conversations,
      }))
      return adminConversation
    }
    return [];
  }),

  // getAdminConversations: protectedProcedure
  // .query( async ({ ctx }) => {
    
  //   return result;
  // }),

  getConversationsWithAdmin: publicProcedure
  .input(z.object({
    uniqueId: z.string(),
    session: z.boolean(),
  }))
  .query(async ({ input }) => {
    if(!input.session){
      const result = await fetchConversationWithAdminWithoutUser(input.uniqueId);
      return result
    }
    else{
      const result = await fetchConversationWithAdmin(input.uniqueId);
      console.log("reaching here")
      return result;
    }
  }),


   createConversationWithAdmin: publicProcedure
  .input(z.object({
    uniqueId: z.string(),
    session: z.boolean(),
  }))
  .mutation(async ({ input }) => {
    console.log(input.session)
    // user has not signed in
    if(!input.session){
      const conversationId = await fetchConversationWithAdminWithoutUser(input.uniqueId);
      if(!conversationId){ 
        console.log("reaching to 'createConversationWithAdmin'")
        return await createConversationWithAdmin("", input.uniqueId);
      }
      console.log(conversationId)
      return conversationId;
    }
    else{
      // user has signed in
      const conversationId = await fetchConversationWithAdmin(input.uniqueId);
  
      // Create conversation with admin if it doesn't exist
      if (!conversationId) {
        console.log("reaching to 'createConversationWithAdmin'")
        return await createConversationWithAdmin(input.uniqueId, "");
      }
      console.log(conversationId)
      return conversationId;
    }
  }),

  // createConversationWithAdminWithoutUser: publicProcedure
  // .mutation( async () => {
    
  // } )


  createConversationWithOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.string(),
        offerUserId: z.string(),
        offerPropertyName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const conversationExist = await fetchConversationWithOffer(
        ctx.user.id,
        input.offerId,
      );

      // Create conversation with host if it doesn't exist
      if (!conversationExist) {
        return await createConversationWithOffer(
          ctx.user.id,
          input.offerUserId === ""
            ? env.TRAMONA_ADMIN_USER_ID
            : input.offerUserId,
          input.offerPropertyName,
          input.offerId,
        );
      }
    }),

  checkConversationWithAdmin: protectedProcedure
  .input(
    z.object({
      conversationId: zodString(),
    })
  )
  .query(async ({input}) => {
    const result = db.query.guestMessages.findFirst({
      where: eq(guestMessages.conversationId, input.conversationId),
      columns: {conversationId: true}
    })
    return result
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

  getParticipantsPhoneNumbers: protectedProcedure
    .input(z.object({ conversationId: zodString() }))
    .query(async ({ ctx, input }) => {
      const participants = await db
        .select({
          id: users.id,
          phoneNumber: users.phoneNumber,
          lastTextAt: users.lastTextAt,
          isWhatsApp: users.isWhatsApp,
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

  setGuestMessagesToRead:
  protectedProcedure
    .input(
      z.object({
        unreadMessageIds: z.string().array(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .update(guestMessages)
        .set({ read: true })
        .where(inArray(guestMessages.id, input.unreadMessageIds));
    }),
});
