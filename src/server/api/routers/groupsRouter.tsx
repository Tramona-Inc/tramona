import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, eq } from "drizzle-orm";
import { groupInvites, groupMembers, groups, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { add } from "date-fns";
import { sendEmail } from "@/server/server-utils";

export const groupsRouter = createTRPCRouter({
  inviteUserByEmail: protectedProcedure
    .input(z.object({ email: z.string(), groupId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const groupOwnerId = await ctx.db.query.groups
        .findFirst({
          where: eq(groups.id, input.groupId),
          with: { members: { where: eq(groupMembers.isOwner, true) } },
        })
        .then((res) => res?.members[0]?.userId);

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
          content: (
            <>
              {ctx.user.name ?? ctx.user.email ?? "An anonymous user"} invited
              you to their request on Tramona! Sign up at
              https://tramona.com/auth/signup with this email to be added to the
              group.
            </>
          ),
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

  inviteUserById: protectedProcedure
    .input(z.object({ userId: z.string(), groupId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const groupOwnerId = await ctx.db.query.groups
        .findFirst({
          where: eq(groups.id, input.groupId),
          with: { members: { where: eq(groupMembers.isOwner, true) } },
        })
        .then((res) => res?.members[0]?.userId);

      if (ctx.user.id !== groupOwnerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db.insert(groupMembers).values(input);
    }),

  leaveGroup: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: groupId, ctx }) => {
      const members =
        (await ctx.db.query.groups
          .findFirst({
            where: eq(groups.id, groupId),
            with: { members: true },
          })
          .then((res) => res?.members)) ?? [];

      const userWasOwner =
        ctx.user.id === members.find((member) => member.isOwner)?.userId;

      await ctx.db
        .delete(groupMembers)
        .where(
          and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, ctx.user.id),
          ),
        );

      if (userWasOwner) {
        const randomMember = members.find((member) => !member.isOwner);
        if (randomMember) {
          await ctx.db
            .update(groupMembers)
            .set({ isOwner: true })
            .where(
              and(
                eq(groupMembers.groupId, groupId),
                eq(groupMembers.userId, randomMember?.userId),
              ),
            );
        }
      }
    }),

  removeGroupMember: protectedProcedure
    .input(z.object({ memberId: z.string(), groupId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const groupOwnerId = await ctx.db.query.groups
        .findFirst({
          where: eq(groups.id, input.groupId),
          with: { members: { where: eq(groupMembers.isOwner, true) } },
        })
        .then((res) => res?.members[0]?.userId);

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
    .mutation(async ({ input: groupId, ctx }) => {
      const members =
        (await ctx.db.query.groups
          .findFirst({
            where: eq(groups.id, groupId),
            with: { members: true },
          })
          .then((res) => res?.members)) ?? [];

      const groupOwner = members.find((member) => member.isOwner);

      if (groupOwner?.userId) {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, groupOwner?.userId),
          columns: { phoneNumber: true },
        })
        return user;
      }

    }),
});
