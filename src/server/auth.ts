import { env } from "@/env";
import { db } from "@/server/db";
import * as bycrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { CustomPgDrizzleAdapter } from "./adapter";
import { users, type User as TramonaUser } from "./db/schema";

const THIRTY_DAYS = 30 * 24 * 60 * 60;
const THIRTY_MINUTES = 30 * 60;

const adapter = CustomPgDrizzleAdapter(db); // custom adapter

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends TramonaUser {}

  interface Session extends DefaultSession {
    user: TramonaUser;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      // return {...session, user}}
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          username: token.username,
          referralCodeUsed: token.referralCodeUsed,
          referralTier: token.referralTier,
          phoneNumber: token.phoneNumber,
        },
      };
    },
    async jwt({ token, user, trigger }) {
      const newToken = token;

      if (trigger === "update" && token.sub) {
        if (adapter) {
          // Add null check for adapter
          const latestUser = await adapter.getUser(token.sub);

          if (latestUser) {
            user = latestUser;
          }
        }
      }

      if (user) {
        newToken.id = user.id;
        newToken.role = user.role;
        newToken.username = user.username;
        newToken.referralCodeUsed = user.referralCodeUsed;
        newToken.referralTier = user.referralTier;
        newToken.phoneNumber = user.phoneNumber;
      }

      return newToken;
    },
  },
  adapter,
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "name@domain.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (
          credentials?.email === undefined || // no email or username
          credentials?.password === undefined // no password
        )
          return Promise.resolve(null);

        let user = null;

        if (credentials?.email !== undefined) {
          user = await db.query.users.findFirst({
            where: eq(users.email, credentials?.email),
          });
        }

        if (user === undefined || user === null) {
          return Promise.resolve(null); // user not found
        } else if (user.password === undefined || user.password === null) {
          return Promise.resolve(null); // users created with google auth
        }

        const isPasswordValid = await bycrypt.compare(
          credentials?.password,
          user.password,
        );

        if (!isPasswordValid) return Promise.resolve(null);

        // Check if email is verified
        if (user.emailVerified === null) {
          return Promise.resolve(null);
        }

        return Promise.resolve(user as User);
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: env.SMTP_HOST,
    //     port: env.SMTP_PORT,
    //     auth: {
    //       user: env.SMTP_USER,
    //       pass: env.SMTP_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    // GithubProvider({
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_CLIENT_SECRET,
    // }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: THIRTY_DAYS,
    updateAge: THIRTY_MINUTES,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/onboarding",
    signOut: "/",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export async function getServerAuthSession(
  ctx: Pick<GetServerSidePropsContext, "req" | "res">,
) {
  return await getServerSession(ctx.req, ctx.res, authOptions);
}
