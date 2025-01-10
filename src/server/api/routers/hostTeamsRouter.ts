import {
  COHOST_ROLES,
  conversationParticipants,
  conversations,
  hostProfiles,
  hostTeamInvites,
  hostTeamMembers,
  hostTeams,
  messages,
  users,
} from "@/server/db/schema";
import { db } from "@/server/db";
import { getHostTeamOwnerId, sendEmail } from "@/server/server-utils";
import { TRPCError } from "@trpc/server";
import { add, subMinutes } from "date-fns";
import { and, eq, or, sql, desc } from "drizzle-orm";
import { z } from "zod";
import {
  coHostProcedure,
  createTRPCRouter,
  hostProcedure,
  protectedProcedure,
  roleRestrictedProcedure,
} from "../trpc";
import HostTeamInviteEmail from "packages/transactional/emails/HostTeamInviteEmail";

export async function handlePendingInviteMessages(email: string) {
  const pendingInvites = await db.query.hostTeamInvites.findMany({
    where: eq(hostTeamInvites.inviteeEmail, email),
    with: {
      hostTeam: {
        columns: { name: true },
        with: { owner: { columns: { id: true } } },
      },
    },
  });

  for (const invite of pendingInvites) {
    const conversationId = await createOrGetConversation(
      email,
      invite.hostTeam.owner.id,
    );
    if (conversationId) {
      await sendInviteMessage(
        conversationId,
        invite.hostTeam.name,
        false,
        invite.hostTeam.owner.id,
      );
    }
  }
}

async function createOrGetConversation(inviteeEmail: string, hostId: string) {
  const inviteeUser = await db.query.users.findFirst({
    where: eq(users.email, inviteeEmail),
    columns: { id: true },
  });

  if (inviteeUser) {
    const existingConversation = await db.query.conversations.findFirst({
      where: eq(
        conversations.id,
        db
          .select({ conversationId: conversationParticipants.conversationId })
          .from(conversationParticipants)
          .where(
            or(
              eq(conversationParticipants.userId, inviteeUser.id),
              eq(conversationParticipants.userId, hostId),
            ),
          )
          .groupBy(conversationParticipants.conversationId)
          .having(sql`count(*) = 2`)
          .limit(1),
      ),
      with: {
        participants: true,
      },
    });

    if (existingConversation) {
      return existingConversation.id;
    }

    const newConversation = await db
      .insert(conversations)
      .values({})
      .returning({ id: conversations.id });

    if (!newConversation[0]) {
      throw new Error("Failed to create new conversation");
    }

    await db.insert(conversationParticipants).values([
      { conversationId: newConversation[0].id, userId: inviteeUser.id },
      { conversationId: newConversation[0].id, userId: hostId },
    ]);

    return newConversation[0].id;
  }

  return null;
}

async function sendInviteMessage(
  conversationId: string | null,
  hostTeamName: string,
  isResend: boolean,
  hostId: string,
) {
  if (!conversationId) return;

  const messageContent = isResend
    ? `You have been re-invited to join ${hostTeamName}. Please check your email for the invitation link.`
    : `You have been invited to join ${hostTeamName}. Please check your email for the invitation link.`;

  await db.insert(messages).values({
    conversationId,
    message: messageContent,
    userId: hostId,
  });
}

async function sendAcceptMessage(
  conversationId: string | null,
  hostTeamName: string,
  userId: string,
) {
  if (!conversationId) return;

  const messageContent = `Invitation to join ${hostTeamName} accepted.`;

  await db.insert(messages).values({
    conversationId,
    message: messageContent,
    userId: userId,
  });
}

async function sendDeclineMessage(
  conversationId: string | null,
  hostTeamName: string,
  userId: string,
) {
  if (!conversationId) return;

  const messageContent = `Invitation to join ${hostTeamName} declined.`;

  await db.insert(messages).values({
    conversationId,
    message: messageContent,
    userId: userId,
  });
}

export const hostTeamsRouter = createTRPCRouter({
  inviteCoHost: hostProcedure
    .input(
      z.object({
        email: z.string(),
        role: z.enum(COHOST_ROLES),
        hostTeamId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const hostTeam = await ctx.db.query.hostTeams.findFirst({
        where: eq(hostTeams.id, input.hostTeamId),
        columns: { name: true },
        with: { owner: { columns: { id: true } } },
      });

      if (!hostTeam) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.user.id !== hostTeam.owner.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const existingInvite = await ctx.db.query.hostTeamInvites.findFirst({
        where: and(
          eq(hostTeamInvites.hostTeamId, input.hostTeamId),
          eq(hostTeamInvites.inviteeEmail, input.email),
        ),
        columns: { expiresAt: true },
      });

      if (existingInvite) {
        return { status: "already invited" } as const;
      }

      const invitee = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
        columns: { id: true, name: true, email: true },
      });

      if (invitee) {
        const userInTeam = await ctx.db.query.hostTeamMembers
          .findFirst({
            where: and(
              eq(hostTeamMembers.hostTeamId, input.hostTeamId),
              eq(hostTeamMembers.userId, invitee.id),
            ),
          })
          .then((res) => !!res);

        if (userInTeam) {
          return { status: "already in team" } as const;
        }
      }
      const now = new Date();

      const id = crypto.randomUUID();

      await ctx.db.insert(hostTeamInvites).values({
        id,
        expiresAt: add(new Date(), { hours: 24 }),
        hostTeamId: input.hostTeamId,
        inviteeEmail: input.email,
        lastSentAt: now,
      });

      // instead of making a new invite, just extend the expiration date of the existing one
      // .onConflictDoUpdate({
      //   target: [hostTeamInvites.hostTeamId, hostTeamInvites.inviteeEmail],
      //   set: {
      //     expiresAt: add(new Date(), { hours: 24 }),
      //   },
      // });

      const conversationId = await createOrGetConversation(
        input.email,
        ctx.user.id,
      );
      await sendInviteMessage(
        conversationId,
        hostTeam.name,
        false,
        ctx.user.id,
      );

      await sendEmail({
        to: input.email,
        subject: `You've been invited to ${hostTeam.name}'s host team on Tramona`,
        content: HostTeamInviteEmail({
          cohostInviteId: id,
          email: ctx.user.email,
          name: ctx.user.name,
        }),
      });

      return { status: "sent invite" } as const;
    }),

  resendInvite: protectedProcedure
    .input(z.object({ email: z.string(), hostTeamId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const hostTeam = await ctx.db.query.hostTeams.findFirst({
        where: eq(hostTeams.id, input.hostTeamId),
        columns: { name: true },
        with: { owner: { columns: { id: true } } },
      });

      if (!hostTeam) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.user.id !== hostTeam.owner.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const existingInvite = await ctx.db.query.hostTeamInvites.findFirst({
        where: and(
          eq(hostTeamInvites.hostTeamId, input.hostTeamId),
          eq(hostTeamInvites.inviteeEmail, input.email),
        ),
        columns: { expiresAt: true, lastSentAt: true, id: true },
      });

      if (!existingInvite) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found" });
      }

      const cooldownPeriod = subMinutes(new Date(), 2); // 2 min cooldown
      if (existingInvite.lastSentAt > cooldownPeriod) {
        return { status: "cooldown" } as const;
      }

      const now = new Date();

      await ctx.db
        .update(hostTeamInvites)
        .set({
          expiresAt: add(new Date(), { hours: 24 }),
          lastSentAt: now,
        })
        .where(
          and(
            eq(hostTeamInvites.hostTeamId, input.hostTeamId),
            eq(hostTeamInvites.inviteeEmail, input.email),
          ),
        );

      const conversationId = await createOrGetConversation(
        input.email,
        ctx.user.id,
      );
      await sendInviteMessage(conversationId, hostTeam.name, true, ctx.user.id);

      await sendEmail({
        to: input.email,
        subject: `Reminder: You've been invited to ${hostTeam.name}'s host team on Tramona`,
        content: HostTeamInviteEmail({
          cohostInviteId: existingInvite.id,
          email: ctx.user.email,
          name: ctx.user.name,
        }),
      });

      return { status: "invite resent" } as const;
    }),

  cancelInvite: protectedProcedure
    .input(z.object({ email: z.string(), hostTeamId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const hostTeam = await ctx.db.query.hostTeams.findFirst({
        where: eq(hostTeams.id, input.hostTeamId),
        columns: { name: true },
        with: { owner: { columns: { id: true } } },
      });

      if (!hostTeam) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.user.id !== hostTeam.owner.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const result = await ctx.db
        .delete(hostTeamInvites)
        .where(
          and(
            eq(hostTeamInvites.hostTeamId, input.hostTeamId),
            eq(hostTeamInvites.inviteeEmail, input.email),
          ),
        )
        .returning({ inviteeEmail: hostTeamInvites.inviteeEmail });

      if (result.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found" });
      }

      return { status: "invite canceled" } as const;
    }),

  leaveHostTeam: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: hostTeamId, ctx }) => {
      const hostTeam = await ctx.db.query.hostTeams.findFirst({
        where: eq(hostTeams.id, hostTeamId),
        columns: { ownerId: true },
        with: { members: true },
      });

      await ctx.db
        .delete(hostTeamMembers)
        .where(
          and(
            eq(hostTeamMembers.hostTeamId, hostTeamId),
            eq(hostTeamMembers.userId, ctx.user.id),
          ),
        );

      const userWasOwner = hostTeam?.ownerId === ctx.user.id;
      if (userWasOwner) {
        const randomMember = hostTeam.members.find(
          (member) => member.userId !== ctx.user.id,
        );
        if (randomMember) {
          await ctx.db
            .update(hostTeams)
            .set({ ownerId: randomMember.userId })
            .where(eq(hostTeams.id, hostTeamId));
        } else {
          // hostTeam must be empty, so delete it
          await ctx.db.delete(hostTeams).where(eq(hostTeams.id, hostTeamId));
        }
      }
    }),

  removeHostTeamMember: coHostProcedure(
    "remove_cohost",
    z.object({ memberId: z.string(), currentHostTeamId: z.number() }),
  ).mutation(async ({ input, ctx }) => {
    await ctx.db
      .delete(hostTeamMembers)
      .where(
        and(
          eq(hostTeamMembers.userId, input.memberId),
          eq(hostTeamMembers.hostTeamId, input.currentHostTeamId),
        ),
      );
  }),

  getHostTeamOwner: protectedProcedure
    .input(z.object({ hostTeamId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.hostTeams
        .findFirst({
          columns: {},
          with: {
            owner: {
              columns: {
                phoneNumber: true,
                isWhatsApp: true,
                stripeConnectId: true,
              },
            },
          },
          where: eq(hostTeams.id, input.hostTeamId),
        })
        .then((res) => res?.owner);
    }),

  getInitialHostTeamId: protectedProcedure.query(async ({ ctx }) => {
    console.log("ran");
    const initialHostTeamId = await db.query.hostTeamMembers
      .findMany({
        where: eq(hostTeamMembers.userId, ctx.user.id),
        orderBy: [desc(hostTeamMembers.addedAt)],
      })
      .then((res) => res[0]?.hostTeamId);

    return initialHostTeamId;
  }),

  getMyHostTeams: protectedProcedure.query(async ({ ctx }) => {
    const hostTeams = await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: {
          hostTeams: {
            with: {
              hostTeam: {
                with: {
                  members: {
                    with: {
                      user: {
                        columns: {
                          name: true,
                          email: true,
                          image: true,
                          id: true,
                        },
                      },
                    },
                  },
                  invites: true,
                },
              },
            },
          },
        },
      })
      .then(
        (res) =>
          res?.hostTeams.map((t) => ({
            ...t.hostTeam,
            curUserId: ctx.user.id,
          })) ?? [],
      );

    return hostTeams;
  }),

  createHostTeam: roleRestrictedProcedure(["host", "admin"])
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const hostTeamId = await ctx.db
        .insert(hostTeams)
        .values({ ownerId: ctx.user.id, name: input.name })
        .returning()
        .then((res) => res[0]!.id);

      await Promise.all([
        ctx.db
          .insert(hostTeamMembers)
          .values({ hostTeamId, userId: ctx.user.id }),
      ]);
    }),

  validateCohostInvite: protectedProcedure
    .input(z.object({ cohostInviteId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invite = await ctx.db.query.hostTeamInvites.findFirst({
        where: and(
          eq(hostTeamInvites.id, input.cohostInviteId),
          eq(hostTeamInvites.inviteeEmail, ctx.user.email),
        ),
        with: {
          hostTeam: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found or not intended for this user",
        });
      }

      if (invite.expiresAt < new Date()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invite has expired",
        });
      }

      const existingMember = await ctx.db.query.hostTeamMembers.findFirst({
        where: and(
          eq(hostTeamMembers.hostTeamId, invite.hostTeam.id),
          eq(hostTeamMembers.userId, ctx.user.id),
        ),
      });

      if (existingMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already a member of this host team",
        });
      }

      return {
        isValid: true,
        hostTeamId: invite.hostTeam.id,
        hostTeamName: invite.hostTeam.name,
      };
    }),

  joinHostTeam: protectedProcedure
    .input(z.object({ cohostInviteId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invite = await ctx.db.query.hostTeamInvites.findFirst({
        where: and(eq(hostTeamInvites.id, input.cohostInviteId)),
        with: {
          hostTeam: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              owner: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Invite not found with id ${input.cohostInviteId}`,
        });
      }

      if (invite.expiresAt < new Date()) {
        return { status: "expired" } as const;
      }

      if (invite.inviteeEmail !== ctx.user.email) {
        return {
          status: "wrong account",
          intendedEmail: invite.inviteeEmail,
        } as const;
      }

      const existingMember = await ctx.db.query.hostTeamMembers.findFirst({
        where: and(
          eq(hostTeamMembers.hostTeamId, invite.hostTeam.id),
          eq(hostTeamMembers.userId, ctx.user.id),
        ),
      });

      if (existingMember) {
        return { status: "already in team" } as const;
      }

      await ctx.db.insert(hostTeamMembers).values({
        hostTeamId: invite.hostTeam.id,
        userId: ctx.user.id,
      });

      // delete invite
      await ctx.db
        .delete(hostTeamInvites)
        .where(eq(hostTeamInvites.id, input.cohostInviteId));

      const conversationId = await createOrGetConversation(
        ctx.user.email,
        invite.hostTeam.owner.id,
      );

      await sendAcceptMessage(
        conversationId,
        invite.hostTeam.name,
        ctx.user.id,
      );

      return {
        status: "joined team",
        hostTeamId: invite.hostTeam.id,
        hostTeamName: invite.hostTeam.name,
      } as const;
    }),

  declineHostTeamInvite: protectedProcedure
    .input(z.object({ cohostInviteId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invite = await ctx.db.query.hostTeamInvites.findFirst({
        where: and(
          eq(hostTeamInvites.id, input.cohostInviteId),
          eq(hostTeamInvites.inviteeEmail, ctx.user.email),
        ),
        with: {
          hostTeam: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              owner: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found or not intended for this user",
        });
      }

      await ctx.db
        .delete(hostTeamInvites)
        .where(eq(hostTeamInvites.id, input.cohostInviteId));

      const conversationId = await createOrGetConversation(
        ctx.user.email,
        invite.hostTeam.owner.id,
      );
      await sendDeclineMessage(
        conversationId,
        invite.hostTeam.name,
        ctx.user.id,
      );

      return { status: "invite declined" } as const;
    }),

  updateCoHostRole: coHostProcedure(
    "update_cohost_role",
    z.object({
      userId: z.string(),
      role: z.enum(COHOST_ROLES),
      currentHostTeamId: z.number(),
    }),
  ).mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(hostTeamMembers)
      .set({ role: input.role })
      .where(
        and(
          eq(hostTeamMembers.hostTeamId, input.currentHostTeamId),
          eq(hostTeamMembers.userId, input.userId),
        ),
      );
  }),
});
