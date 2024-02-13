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

          // Create token
          const token = jwt.sign({ email: input.email }, env.NEXTAUTH_SECRET!, {
            expiresIn: "30m",
          });

          const url = `${env.NEXTAUTH_URL}/confirmation/${token}`;

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
        token: z.string(),
        email: z.string().email({ message: "EmailInvalidError" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return null;
    }),
});
