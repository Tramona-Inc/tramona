import PasswordResetEmailLink from "packages/transactional/emails/PasswordResetEmailLink";
import VerifyEmailLink from "packages/transactional/emails/VerifyEmail";
import { env } from "@/env";
import { CustomPgDrizzleAdapter } from "@/server/adapter";
import { db } from "@/server/db";
import { referralCodes, users, type User } from "@/server/db/schema";
import { addUserToGroups, sendEmail } from "@/server/server-utils";
import { generateReferralCode } from "@/utils/utils";
import { zodEmail, zodPassword } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import * as bycrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

async function fetchEmailVerified(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

async function updateExistingUserAuth(
  // name: string,
  email: string,
  hashedPassword: string,
  userQueriedId: string,
) {
  return await db
    .update(users)
    .set({
      // name: name,
      email: email,
      password: hashedPassword,
    })
    .where(eq(users.id, userQueriedId))
    .returning()
    .then((res) => res[0] ?? null);
}

async function insertUserAuth(
  // name: string,
  email: string,
  hashedPassword: string,
  makeHost = false,
) {
  return await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      // name: name,
      email: email,
      password: hashedPassword,
      role: makeHost ? "host" : "guest",
    })
    .returning()
    .then((res) => res[0] ?? null);
}

async function sendVerificationEmail(user: User) {
  const payload = {
    email: user.email,
    id: user.id,
  };

  // Create token
  const token = jwt.sign(payload, env.NEXTAUTH_SECRET, {
    expiresIn: "30m",
  });

  const url = `${env.NEXTAUTH_URL}/auth/verifying-email?id=${user.id}&token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Email | Tramona",
    content: VerifyEmailLink({ url, name: user.name ?? user.email }),
  });
}

async function sendVerificationEmailWithConversation(
  user: User,
  conversationId: string,
) {
  const payload = {
    email: user.email,
    id: user.id,
  };

  // Create token
  const token = jwt.sign(payload, env.NEXTAUTH_SECRET, {
    expiresIn: "30m",
  });

  const url = `${env.NEXTAUTH_URL}/auth/verifying-email?id=${user.id}&token=${token}&conversationId=${conversationId}&userId=${user.id}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Email | Tramona",
    content: VerifyEmailLink({ url, name: user.name ?? user.email }),
  });
}

export const authRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        // name: zodString({ minLen: 2 }),
        email: zodEmail(),
        password: zodPassword(),
        referralCode: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userQueriedWEmail = await fetchEmailVerified(input.email);

      if (userQueriedWEmail?.emailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exists",
        });
      }

      const hashedPassword: string = await bycrypt.hash(input.password, 10);

      try {
        let user: User | null;

        // Users signed up but didn't verify email
        if (userQueriedWEmail?.emailVerified === null) {
          user = await updateExistingUserAuth(
            // input.name,
            input.email,
            hashedPassword,
            userQueriedWEmail.id,
          );
        } else {
          // Initial sign up insert the user info
          user = await insertUserAuth(input.email, hashedPassword);

          if (user) {
            await Promise.all([
              // Create referral code
              ctx.db.insert(referralCodes).values({
                ownerId: user.id,
                referralCode: generateReferralCode(),
              }),

              // Link user account
              CustomPgDrizzleAdapter(ctx.db).linkAccount?.({
                provider: "credentials",
                providerAccountId: user.id,
                userId: user.id,
                type: "email",
              }),

              // add user to groups they were invited to
              addUserToGroups(user),
            ]);
          }
        }

        if (user) {
          await sendVerificationEmail(user);
        }

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  createUserHost: publicProcedure
    .input(
      z.object({
        name: zodString({ minLen: 2 }),
        email: zodEmail(),
        password: zodPassword(),
        referralCode: z.string().optional(),
        conversationId: z.string(),
        hostType: z.enum(ALL_HOST_TYPES),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userQueriedWEmail = await fetchEmailVerified(input.email);

      if (userQueriedWEmail?.emailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exists",
        });
      }

      const hashedPassword: string = await bycrypt.hash(input.password, 10);

      try {
        let user: User | null;

        // Users signed up but didn't verify email
        if (userQueriedWEmail?.emailVerified === null) {
          user = await updateExistingUserAuth(
            // input.name,
            input.email,
            hashedPassword,
            userQueriedWEmail.id,
          );
        } else {
          // Initial sign up insert the user info
          user = await insertUserAuth(
            // input.name,
            input.email,
            hashedPassword,
            true,
          );

          if (user) {
            // Create referral code
            await ctx.db.insert(referralCodes).values({
              ownerId: user.id,
              referralCode: generateReferralCode(),
            });

            // Link user account
            await CustomPgDrizzleAdapter(ctx.db).linkAccount?.({
              provider: "credentials",
              providerAccountId: user.id,
              userId: user.id,
              type: "email",
            });
          }
        }

        if (user) {
          // create new team for just the host
          const teamId = await ctx.db
            .insert(hostTeams)
            .values({
              ownerId: user.id,
              name: `${user.name ?? user.username ?? user.email}`,
            })
            .returning()
            .then((res) => res[0]!.id);

          // Insert Host info
          await ctx.db.insert(hostProfiles).values({
            userId: user.id,
            curTeamId: teamId,
          });

          // Send email verification token
          await sendVerificationEmailWithConversation(
            user,
            input.conversationId,
          );
        }

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  createTempUserForGuest: publicProcedure
    .input(
      z.object({
        email: zodEmail(),
        isGuest: z.boolean(),
        sessionToken: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // check if user already exists
      const existedGuestTempUser = await ctx.db.query.users.findFirst({
        where: eq(users.sessionToken, input.sessionToken),
      });
      if (existedGuestTempUser) {
        return
      }
      // insert user to db
      const user = await ctx.db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          email: input.email,
          isGuest: input.isGuest,
          sessionToken: input.sessionToken,
        })
        .returning()
        .then((res) => res[0] ?? null);
    }),

  verifyEmailToken: publicProcedure
    .input(
      z.object({
        id: z.string(),
        token: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });

      // Check if user exist
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User doesn't exist",
        });
      } else {
        // Verify the token
        try {
          const payload = jwt.verify(input.token, env.NEXTAUTH_SECRET);

          await ctx.db
            .update(users)
            .set({ emailVerified: input.date })
            .where(eq(users.id, input.id));

          return payload;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid token or user does not exist",
          });
        }
      }
    }),
  createUniqueForgotPasswordLink: publicProcedure
    .input(
      z.object({
        email: zodEmail(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email does not exist",
        });

      if (!user.password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User created with an auth provider (passwordless)",
        });

      const payload = {
        email: user.email,
        id: user.id,
      };

      // Create token
      const token = jwt.sign(payload, env.NEXTAUTH_SECRET, {
        expiresIn: "30m",
      });

      const url = `${env.NEXTAUTH_URL}/auth/reset-password?id=${user.id}&token=${token}`;

      await sendEmail({
        to: input.email,
        subject: "Reset Password | Tramona",
        content: PasswordResetEmailLink({ url, name: user.name ?? user.email }),
      });

      return null;
    }),
  verifyResetPasswordToken: publicProcedure
    .input(
      z.object({
        id: z.string(),
        token: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let user;
      try {
        user = await ctx.db.query.users.findFirst({
          where: eq(users.id, input.id),
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token or user does not exist",
        });
      }

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token or user does not exist",
        });
      }

      if (!user.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User created with an auth provider (passwordless)",
        });
      }

      try {
        const payload = jwt.verify(input.token, env.NEXTAUTH_SECRET);
        return payload;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token or user does not exist",
        });
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        id: z.string(),
        token: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token or user does not exist",
        });
      }

      if (!user.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User created with Google auth",
        });
      }

      try {
        jwt.verify(input.token, env.NEXTAUTH_SECRET);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token or user does not exist",
        });
      }

      const isPasswordSame = await bycrypt.compare(
        input.newPassword,
        user.password,
      );

      if (isPasswordSame) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "New password cannot be the same as the old password",
        });
      }

      const newHashedPassword = await bycrypt.hash(input.newPassword, 10);

      await ctx.db
        .update(users)
        .set({ password: newHashedPassword })
        .where(eq(users.id, input.id));

      return {
        message: "Password changed successfully",
      };
    }),
});
