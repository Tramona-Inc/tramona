import { TRPCError } from "@trpc/server";
import * as bycrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "../trpc";
// import { render } from "@react-email/render";
import { env } from "@/env";
import { CustomPgDrizzleAdapter } from "@/server/adapter";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import nodemailler, { type TransportOptions } from "nodemailer";
import { z } from "zod";

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

      // TODO: if user doesn't ever verify/ sign up again but check if the email is not verified
      // ! if it exist update instead of insert
      if (userQueriedWEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exists",
        });
      }

      try {
        const hashedPassword: string = await bycrypt.hash(input.password, 10);
        const user = await ctx.db
          .insert(users)
          .values({
            name: input.name,
            email: input.email,
            // username: input.username,
            password: hashedPassword,
            role: "guest",
            id: crypto.randomUUID(),
            referralCodeUsed: input.referralCode,
          })
          .returning()
          .then((res) => res[0] ?? null);

        if (user) {
          // Link user account
          await CustomPgDrizzleAdapter(ctx.db).linkAccount?.({
            provider: "credentials",
            providerAccountId: user.id,
            userId: user.id,
            type: "email",
          });

          // Create transporter
          const transporter = nodemailler.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            // debug: true,
            auth: {
              user: env.SMTP_USER,
              pass: env.SMTP_PASSWORD,
            },
          } as TransportOptions);

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
});
