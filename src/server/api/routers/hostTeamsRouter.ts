import {
  hostProfiles,
  hostTeamInvites,
  hostTeamMembers,
  hostTeams,
  users,
} from "@/server/db/schema";
import { getHostTeamOwnerId, sendEmail } from "@/server/server-utils";
import { TRPCError } from "@trpc/server";
import { add, subMinutes } from "date-fns";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "../trpc";
import HostTeamInviteEmail from "packages/transactional/emails/HostTeamInviteEmail";

export const hostTeamsRouter = createTRPCRouter({
  inviteUserByEmail: protectedProcedure
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

      await ctx.db
        .insert(hostTeamInvites)
        .values({
          id,
          expiresAt: add(new Date(), { hours: 24 }),
          hostTeamId: input.hostTeamId,
          inviteeEmail: input.email,
          lastSentAt: now,
        })

        // instead of making a new invite, just extend the expiration date of the existing one
        // .onConflictDoUpdate({
        //   target: [hostTeamInvites.hostTeamId, hostTeamInvites.inviteeEmail],
        //   set: {
        //     expiresAt: add(new Date(), { hours: 24 }),
        //   },
        // });

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
      // }Wha

      // await ctx.db.insert(hostTeamMembers).values({
      //   hostTeamId: input.hostTeamId,
      //   userId: invitee.id,
      // });

      // return { status: "added user", inviteeName: invitee.name } as const;
    }),

  addUserToHostTeam: protectedProcedure
    .input(z.object({ userId: z.string(), hostTeamId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const hostTeam = await ctx.db.query.hostTeams.findFirst({
        where: eq(hostTeams.id, input.hostTeamId),
        columns: { name: true },
        with: { owner: { columns: { id: true } } },
      });

      if (!hostTeam) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Host team not found",
        });
      }

      if (ctx.user.id !== hostTeam.owner.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the host team owner can add members",
        });
      }

      const userToAdd = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.userId),
        columns: { id: true },
      });

      if (!userToAdd) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const existingMember = await ctx.db.query.hostTeamMembers.findFirst({
        where: and(
          eq(hostTeamMembers.hostTeamId, input.hostTeamId),
          eq(hostTeamMembers.userId, input.userId),
        ),
      });

      if (existingMember) {
        return { status: "already in team" } as const;
      }

      await ctx.db.insert(hostTeamMembers).values({
        hostTeamId: input.hostTeamId,
        userId: input.userId,
      });

      return { status: "added to team" } as const;
    }),

  inviteUserById: protectedProcedure
    .input(z.object({ userId: z.string(), hostTeamId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const hostTeamOwnerId = await getHostTeamOwnerId(input.hostTeamId);

      if (ctx.user.id !== hostTeamOwnerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db.insert(hostTeamMembers).values(input);
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

  removeHostTeamMember: protectedProcedure
    .input(z.object({ memberId: z.string(), hostTeamId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const hostTeamOwnerId = await getHostTeamOwnerId(input.hostTeamId);

      if (ctx.user.id !== hostTeamOwnerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db
        .delete(hostTeamMembers)
        .where(
          and(
            eq(hostTeamMembers.userId, input.memberId),
            eq(hostTeamMembers.hostTeamId, input.hostTeamId),
          ),
        );
    }),

  getMyFriends: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.hostTeamMembers
      .findMany({
        where: eq(hostTeamMembers.userId, ctx.user.id),
        with: {
          hostTeam: {
            with: {
              members: {
                with: {
                  user: { columns: { name: true, email: true, image: true } },
                },
              },
            },
          },
        },
      })
      .then((res) =>
        res
          .map((member) => member.hostTeam.members)
          .flat(1)
          .map((member) => member.user),
      );
  }),

  getHostTeamOwner: protectedProcedure
    .input(z.object({ hostTeamId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.hostTeams
        .findFirst({
          columns: {},
          with: { owner: { columns: { phoneNumber: true, isWhatsApp: true } } },
          where: eq(hostTeams.id, input.hostTeamId),
        })
        .then((res) => res?.owner);
    }),

  getMyHostTeams: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: { hostTeams: { with: { hostTeam: true } } },
      })
      .then((res) => res?.hostTeams.map((t) => t.hostTeam) ?? []);
  }),

  setCurHostTeam: protectedProcedure
    .input(z.object({ hostTeamId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const hostTeamNamePromise = ctx.db.query.hostTeams
        .findFirst({
          where: eq(hostTeams.id, input.hostTeamId),
          columns: { name: true },
        })
        .then((res) => res?.name);

      const mutation = ctx.db
        .update(hostProfiles)
        .set({ curTeamId: input.hostTeamId })
        .where(eq(hostProfiles.userId, ctx.user.id));

      const [hostTeamName] = await Promise.all([hostTeamNamePromise, mutation]);

      return { hostTeamName };
    }),

  createHostTeam: roleRestrictedProcedure(["host", "admin"])
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const hostTeamId = await ctx.db
        .insert(hostTeams)
        .values({ ownerId: ctx.user.id, name: input.name })
        .returning()
        .then((res) => res[0]?.id);

      if (!hostTeamId) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      await ctx.db
        .insert(hostTeamMembers)
        .values({ hostTeamId, userId: ctx.user.id });

      await ctx.db
        .update(hostProfiles)
        .set({ curTeamId: hostTeamId })
        .where(eq(hostProfiles.userId, ctx.user.id));
    }),

  getHostTeamDetails: protectedProcedure
    .input(z.object({ hostTeamId: z.number() }))
    .query(async ({ ctx, input }) => {
      const hostTeam = await ctx.db.query.hostTeams.findFirst({
        where: eq(hostTeams.id, input.hostTeamId),
        with: {
          invites: true,
          members: {
            with: { user: { columns: { name: true, email: true, id: true } } },
          },
          owner: { columns: { name: true, email: true, id: true } },
        },
      });

      if (!hostTeam) {
        return new TRPCError({ code: "NOT_FOUND" });
      }

      if (!hostTeam.members.find((m) => m.userId === ctx.user.id)) {
        return new TRPCError({ code: "UNAUTHORIZED" });
      }

      return hostTeam;
    }),

  getCurTeamOwnerId: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: {
          hostProfile: {
            columns: {},
            with: { curTeam: { columns: { id: true } } },
          },
        },
      })
      .then((res) => res?.hostProfile?.curTeam.id);
  }),

  getCurTeamMembers: protectedProcedure.query(async ({ ctx }) => {
    const members = await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: {
          hostProfile: {
            columns: {},
            with: {
              curTeam: {
                columns: {},
                with: {
                  members: {
                    columns: {},
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
                },
              },
            },
          },
        },
      })
      .then((res) => res?.hostProfile?.curTeam.members.map((m) => m.user));

    if (!members) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return members;
  }),

  getCurTeamPendingInvites: protectedProcedure.query(async ({ ctx }) => {
    const curTeamId = await ctx.db.query.hostProfiles
      .findFirst({
        where: eq(hostProfiles.userId, ctx.user.id),
        columns: { curTeamId: true },
      })
      .then((res) => res?.curTeamId);

    if (!curTeamId) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const pendingInvites = await ctx.db.query.hostTeamInvites.findMany({
      where: and(
        eq(hostTeamInvites.hostTeamId, curTeamId),
        gt(hostTeamInvites.expiresAt, new Date()),
      ),
      columns: {
        inviteeEmail: true,
        expiresAt: true,
      },
    });

    return pendingInvites;
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
});
