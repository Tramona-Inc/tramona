import { type GetServerSidePropsContext } from "next";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";

import { env } from "@/env";
import { db } from "@/server/db";
import { pgTable } from "drizzle-orm/pg-core";
import { type ALL_ROLES } from "./db/schema/tables/auth";
import { CustomPgDrizzleAdapter } from "./adapter";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: (typeof ALL_ROLES)[number];
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: (typeof ALL_ROLES)[number];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),
    // TODO: generate code when on new user is created (Maybe generate only when sharing the code)
    // async signIn({ user }) {
    //   const newReferralCode = generateReferralCode(); // Implement your logic to generate a new referral code

    //   if (user) {
    //     const result = await db.query.referralCodes.findMany({
    //       where: (referralCodes, { eq }) => eq(referralCodes.ownerId, user.id),
    //     });

    //     if (!result || result.length === 0) {
    //       // If result is null or empty, generate a new row
    //       await db.insert(referralCodes).values({
    //         referral_code: newReferralCode,
    //         ownerId: user.id,
    //       });
    //     }
    //   }

    //   return Promise.resolve(true);
    // },
  },
  // adapter: DrizzleAdapter(db, pgTable) as Adapter,
  adapter: CustomPgDrizzleAdapter(db) as Adapter, // New custom adapter
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    // -- You can use the credential with another service like etherum, oAuth, etc.
    EmailProvider({
      server: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/welcome",
    signOut: "/",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
