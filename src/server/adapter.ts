import { and, eq } from "drizzle-orm";
import { AdapterAccount, AdapterUser, type Adapter } from "next-auth/adapters";
import { type PgDatabase } from "drizzle-orm/pg-core";
import {
  sessions,
  users,
  accounts,
  verificationTokens,
  referralCodes,
} from "./db/schema";
import { generateReferralCode, retry } from "@/utils/utils";
import { addUserToGroups } from "./server-utils";

export function CustomPgDrizzleAdapter(
  db: InstanceType<typeof PgDatabase>,
): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const userId = crypto.randomUUID();

      const newUser = await db.transaction(async (tx) => {
        const ret = await tx
          .insert(users)
          .values({ ...user, id: userId })
          .returning()
          .then((res) => res[0]!);

        await retry(
          // will throw on collisions since postgres primary keys have the unique constraint
          tx
            .insert(referralCodes)
            .values({ ownerId: userId, referralCode: generateReferralCode() })
            .returning(),
          3,
        );

        return ret;
      });

      await addUserToGroups({ email: user.email, id: userId });

      return newUser;
    },
    async getUser(userId) {
      return await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .then((res) => res[0] ?? null);
    },
    async getUserByEmail(email) {
      return await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then((res) => res[0] ?? null);
    },
    async createSession(session) {
      return await db
        .insert(sessions)
        .values(session)
        .returning()
        .then((res) => res[0]!);
    },
    async getSessionAndUser(sessionToken) {
      return await db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) => res[0] ?? null);
    },
    async updateUser(newUserData) {
      if (!newUserData.id) {
        throw new Error("No user id.");
      }

      return await db
        .update(users)
        .set(newUserData)
        .where(eq(users.id, newUserData.id))
        .returning()
        .then((res) => res[0]!);
    },
    async updateSession(newSessionData) {
      return await db
        .update(sessions)
        .set(newSessionData)
        .where(eq(sessions.sessionToken, newSessionData.sessionToken))
        .returning()
        .then((res) => res[0]);
    },
    async linkAccount(rawAccount: AdapterAccount) {
      const updatedAccount = await db
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .then((res) => res[0]!);

      // Drizzle will return `null` for fields that are not defined.
      // However, the return type is expecting `undefined`.
      return {
        ...updatedAccount,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined,
      };
    },
    async getUserByAccount(account) {
      const dbAccount =
        (await db
          .select()
          .from(accounts)
          .where(
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              eq(accounts.provider, account.provider),
            ),
          )
          .leftJoin(users, eq(accounts.userId, users.id))
          .then((res) => res[0])) ?? null;

      if (!dbAccount) {
        return null;
      }

      return dbAccount.user;
    },
    async deleteSession(sessionToken) {
      const session = await db
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .then((res) => res[0] ?? null);

      return session;
    },
    async createVerificationToken(token) {
      return await db
        .insert(verificationTokens)
        .values(token)
        .returning()
        .then((res) => res[0]);
    },
    async useVerificationToken(token) {
      try {
        return await db
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token),
            ),
          )
          .returning()
          .then((res) => res[0] ?? null);
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    async deleteUser(id) {
      await db
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .then((res) => res[0] ?? null);
    },
    async unlinkAccount(account: Pick<
      AdapterAccount,
      "provider" | "providerAccountId"
    >) {
      const deletedAccount = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          ),
        )
        .returning()
        .then((res) => res[0] ?? null);

      if (deletedAccount) {
        const { provider, type, providerAccountId, userId } = deletedAccount;
        return { provider, type, providerAccountId, userId };
      }

      return undefined;
    },
  };
}
