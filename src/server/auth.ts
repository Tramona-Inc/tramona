import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { env } from "@/env";
import { db } from "@/server/db";
import { CustomPgDrizzleAdapter } from "./adapter";
import { type User as TramonaUser } from "./db/schema";

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
    session: ({ session, user }) => {
      return { ...session, user };
    },
  },
  adapter: CustomPgDrizzleAdapter(db), // custom adapter
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
export async function getServerAuthSession(
  ctx: Pick<GetServerSidePropsContext, "req" | "res">,
) {
  return await getServerSession(ctx.req, ctx.res, authOptions);
}

async function sendToSignIn(ctx: GetServerSidePropsContext) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const callbackUrl = `${baseUrl}${ctx.resolvedUrl}`;
  const urlSearchParams = new URLSearchParams({ callbackUrl });
  return {
    redirect: {
      destination: `/auth/signin?${urlSearchParams.toString()}`,
    },
  };
}

/**
 * Do `export const getServerSideProps = requireAuth;` at the bottom of
 * any page to make it require authentication.
 */
export async function requireAuth(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return sendToSignIn(ctx);
  }
  return { props: {} };
}

/**
 * Do `export const getServerSideProps = requireRole(["admin", "host"]);` to require
 * the user to be signed in as either a admin or host for example
 */
export const requireRole = (allowedRoles: TramonaUser["role"][]) =>
  async function (ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);
    if (!session) {
      return sendToSignIn(ctx);
    }

    if (!allowedRoles.includes(session.user.role)) {
      return {
        notFound: true,
      };
    }

    return { props: {} };
  };
