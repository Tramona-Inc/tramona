import { HostTeamInviteEmail } from "@/components/email-templates/HostTeamInviteEmail";
import {
  hostProfiles,
  hostTeamInvites,
  hostTeamMembers,
  hostTeams,
  users,
} from "@/server/db/schema";
import { getHostTeamOwnerId, sendEmail } from "@/server/server-utils";
import { TRPCError } from "@trpc/server";
import { add } from "date-fns";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "../trpc";

export const hostTeamsRouter = createTRPCRouter({
  inviteUserByEmail: protectedProcedure
    .input(z.object({ email: z.string(), hostTeamId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const hostTeamOwnerId = await getHostTeamOwnerId(input.hostTeamId);

      if (ctx.user.id !== hostTeamOwnerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const invitee = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
        columns: { id: true, name: true },
      });

      if (!invitee) {
        await ctx.db
          .insert(hostTeamInvites)
          .values({
            expiresAt: add(new Date(), { hours: 24 }),
            hostTeamId: input.hostTeamId,
            inviteeEmail: input.email,
          })

          // instead of making a new invite, just extend the expiration date of the existing one
          .onConflictDoUpdate({
            target: [hostTeamInvites.hostTeamId, hostTeamInvites.inviteeEmail],
            set: {
              expiresAt: add(new Date(), { hours: 24 }),
            },
          });

        await sendEmail({
          to: input.email,
          subject: "You've been invited to a request on Tramona",
          content: HostTeamInviteEmail({
            email: ctx.user.email,
            name: ctx.user.name,
          }),
        });

        return { status: "sent invite" as const };
      }

      await ctx.db
        .insert(hostTeamMembers)
        .values({
          hostTeamId: input.hostTeamId,
          userId: invitee.id,
        })
        .catch((err) => {
          const parsedErr = z.object({ code: z.string() }).safeParse(err);
          if (!parsedErr.success) return;
          if (parsedErr.data.code === "23505") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User is already in the hostTeam",
            });
          }
        });

      return { status: "added user" as const, inviteeName: invitee.name };
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
    .input(z.number())
    .mutation(async ({ input: hostTeamId, ctx }) => {
      return await ctx.db.query.hostTeams
        .findFirst({
          columns: {},
          with: { owner: { columns: { phoneNumber: true, isWhatsApp: true } } },
          where: eq(hostTeams.id, hostTeamId),
        })
        .then((res) => res?.owner);
    }),

  getHostTeamsDropdown: protectedProcedure.query(async ({ ctx }) => {
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
      await ctx.db
        .update(hostProfiles)
        .set({ curTeamId: input.hostTeamId })
        .where(eq(hostProfiles.userId, ctx.user.id));
    }),

  createHostTeam: roleRestrictedProcedure(["host"])
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
});
