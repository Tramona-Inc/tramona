import GroupInviteEmail from "packages/transactional/emails/GroupInviteEmail";
import {
  groupInvites,
  groupMembers,
  groups,
  users,
  groupInvitesLink,
} from "@/server/db/schema";
import { getGroupOwnerId, sendEmail } from "@/server/server-utils";
import { TRPCError } from "@trpc/server";
import { add } from "date-fns";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const groupsRouter = createTRPCRouter({
  generateInviteLink: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ input, ctx }) => {
      const groupOwnerId = await getGroupOwnerId(input.groupId);
      if (ctx.user.id !== groupOwnerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      await ctx.db.insert(groupInvitesLink).values({
        expiresAt: add(new Date(), { hours: 24 }),
        groupId: input.groupId,
      });

      const inviteLinkId = await ctx.db.query.groupInvitesLink.findFirst({
        where: eq(groupInvitesLink.groupId, input.groupId),
        columns: { id: true },
      });

      if (!inviteLinkId) {
        throw new Error("Invite link not found");
      }

      return { link: `https://tramona.com/invite/${inviteLinkId.id}` };
    }),

  inviteUserByEmail: protectedProcedure
    .input(z.object({ email: z.string(), groupId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const groupOwnerId = await getGroupOwnerId(input.groupId);

      if (ctx.user.id !== groupOwnerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const invitee = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
        columns: { id: true, name: true },
      });

      if (!invitee) {
        await ctx.db
          .insert(groupInvites)
          .values({
            expiresAt: add(new Date(), { hours: 24 }),
            groupId: input.groupId,
            inviteeEmail: input.email,
          })

          // instead of making a new invite, just extend the expiration date of the existing one
          .onConflictDoUpdate({
            target: [groupInvites.groupId, groupInvites.inviteeEmail],
            set: {
              expiresAt: add(new Date(), { hours: 24 }),
            },
          });

        await sendEmail({
          to: input.email,
          subject: "You've been invited to a request on Tramona",
          content: GroupInviteEmail({
            email: ctx.user.email,
            name: ctx.user.name,
          }),
        });

        return { status: "sent invite" as const };
      }

      await ctx.db
        .insert(groupMembers)
        .values({
          groupId: input.groupId,
          userId: invitee.id,
        })
        .catch((err) => {
          const parsedErr = z.object({ code: z.string() }).safeParse(err);
          if (!parsedErr.success) return;
          if (parsedErr.data.code === "23505") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User is already in the group",
            });
          }
        });

      return { status: "added user" as const, inviteeName: invitee.name };
    }),

  inviteCurUserToGroup: protectedProcedure
    .input(z.object({ inviteLinkId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const groupId = await ctx.db.query.groupInvitesLink
        .findFirst({
          where: eq(groupInvitesLink.id, input.inviteLinkId),
          columns: { groupId: true },
        })
        .then((res) => res?.groupId);

      if (groupId !== undefined) {
        await ctx.db
          .insert(groupMembers)
          .values({ groupId: groupId, userId: ctx.user.id })
          .onConflictDoNothing();
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  leaveGroup: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: groupId, ctx }) => {
      const group = await ctx.db.query.groups.findFirst({
        where: eq(groups.id, groupId),
        columns: { ownerId: true },
        with: { members: true },
      });

      await ctx.db
        .delete(groupMembers)
        .where(
          and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, ctx.user.id),
          ),
        );

      const userWasOwner = group?.ownerId === ctx.user.id;
      if (userWasOwner) {
        const randomMember = group.members.find(
          (member) => member.userId !== ctx.user.id,
        );
        if (randomMember) {
          await ctx.db
            .update(groups)
            .set({ ownerId: randomMember.userId })
            .where(eq(groups.id, groupId));
        } else {
          // group must be empty, so delete it
          await ctx.db.delete(groups).where(eq(groups.id, groupId));
        }
      }
    }),

  removeGroupMember: protectedProcedure
    .input(z.object({ memberId: z.string(), groupId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const groupOwnerId = await getGroupOwnerId(input.groupId);

      if (ctx.user.id !== groupOwnerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db
        .delete(groupMembers)
        .where(
          and(
            eq(groupMembers.userId, input.memberId),
            eq(groupMembers.groupId, input.groupId),
          ),
        );
    }),

  getMyFriends: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.groupMembers
      .findMany({
        where: eq(groupMembers.userId, ctx.user.id),
        with: {
          group: {
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
          .map((member) => member.group.members)
          .flat(1)
          .map((member) => member.user),
      );
  }),

  getGroupOwner: protectedProcedure
    .input(z.number())
    .query(async ({ input: groupId, ctx }) => {
      return await ctx.db.query.groups
        .findFirst({
          columns: {},
          with: {
            owner: {
              columns: { id: true, phoneNumber: true, isWhatsApp: true },
            },
          },
          where: eq(groups.id, groupId),
        })
        .then((res) => res?.owner);
    }),

  getGroupMembers: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: groupId, ctx }) => {
      return await ctx.db.query.groupMembers
        .findMany({
          columns: {},
          with: { user: { columns: { phoneNumber: true, isWhatsApp: true, isBurner: true } } },
          where: eq(groupMembers.groupId, groupId),
        })
        .then((res) => res.map((member) => member.user));
    }),
});
