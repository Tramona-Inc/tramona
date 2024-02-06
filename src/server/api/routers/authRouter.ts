import { TRPCError } from "@trpc/server";
import * as bycrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "../trpc";
// import nodemailler from "nodemailer";
// import { render } from "@react-email/render";
import { CustomPgDrizzleAdapter } from "@/server/adapter";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, { message: "NameLengthError" }),
        // username: z.string().min(2, { message: "UsernameLengthError" }),
        email: z.string().email({ message: "EmailInvalidError" }),
        password: z.string(), // validated within the client
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // const userQueriedWUsername = await ctx.db.query.users.findFirst({
      //   where: eq(users.username, input.username),
      // });
      // if (userQueriedWUsername)
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "User with this username already exists",
      //   });
      const userQueriedWEmail = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (userQueriedWEmail)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exists",
        });
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
          })
          .returning()
          .then((res) => res[0] ?? null);

        if (user) {
          await CustomPgDrizzleAdapter(ctx.db).linkAccount?.({
            provider: "credentials",
            providerAccountId: user.id,
            userId: user.id,
            type: "email",
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
});
