import { TRPCError } from "@trpc/server";
import * as bycrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "../trpc";
// import { render } from "@react-email/render";
import { PasswordResetEmail } from "@/components/email-templates/PasswordResetEmail";
import { env } from "@/env";
import { CustomPgDrizzleAdapter } from "@/server/adapter";
import { users, type User } from "@/server/db/schema";
import { render } from "@react-email/render";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import nodemailler, { type TransportOptions } from "nodemailer";
import { z } from "zod";

// Init transproter for nodemailer
const transporter = nodemailler.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  // debug: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
} as TransportOptions);

export const authRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, { message: "NameLengthError" }),
        // username: z.string().min(2, { message: "UsernameLengthError" }),
        email: z.string().email({ message: "EmailInvalidError" }),
        password: z.string(), // validated within the client
        referralCode: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userQueriedWEmail = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

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
          user = await ctx.db
            .update(users)
            .set({
              name: input.name,
              email: input.email,
              // username: input.username,
              password: hashedPassword,
            })
            .where(eq(users.id, userQueriedWEmail.id))
            .returning()
            .then((res) => res[0] ?? null);
        } else {
          // Initial sign up insert the user info
          user = await ctx.db
            .insert(users)
            .values({
              id: crypto.randomUUID(),
              name: input.name,
              email: input.email,
              // username: input.username,
              password: hashedPassword,
              role: "guest",
            })
            .returning()
            .then((res) => res[0] ?? null);

          // Link user account
          if (user) {
            await CustomPgDrizzleAdapter(ctx.db).linkAccount?.({
              provider: "credentials",
              providerAccountId: user.id,
              userId: user.id,
              type: "email",
            });
          }
        }

        // Send email verification token
        if (user) {
          const payload = {
            email: user.email,
            id: user.id,
          };

          // Create token
          const token = jwt.sign(payload, env.NEXTAUTH_SECRET!, {
            expiresIn: "30m",
          });

          const url = `${env.NEXTAUTH_URL}/auth/verify-email?id=${user.id}&token=${token}`;

          await new Promise((resolve, reject) => {
            transporter.sendMail(
              {
                from: env.EMAIL_FROM,
                to: input.email,
                subject: "Verify email | Tramona",
                html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
              },
              (err, info) => {
                if (err) {
                  // console.error(err);
                  reject(err);
                } else {
                  // console.log(info);
                  resolve(info);
                }
              },
            );
          });
        }

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
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
          const payload = jwt.verify(input.token, env.NEXTAUTH_SECRET!);

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
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log(input.email);

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email does not exist",
        });

      if (user && !user.password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User created with an auth provider (password less)",
        });

      const payload = {
        email: user.email,
        id: user.id,
      };

      // Create token
      const token = jwt.sign(payload, env.NEXTAUTH_SECRET!, {
        expiresIn: "30m",
      });

      const url = `${env.NEXTAUTH_URL}/auth/reset-password?id=${user.id}&token=${token}`;

      const emailHtml = render(
        PasswordResetEmail({ url: url, name: user.name ?? user.email }),
      );

      await new Promise((resolve, reject) => {
        transporter.sendMail(
          {
            from: env.EMAIL_FROM,
            to: input.email,
            subject: "Reset Password | Tramona",
            html: emailHtml,
          },
          (err, info) => {
            if (err) {
              // console.error(err);
              reject(err);
            } else {
              // console.log(info);
              resolve(info);
            }
          },
        );
      });

      return null;
    }),
});
