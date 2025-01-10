/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { hostProfiles, hostTeamMembers, type User, users } from "../db/schema";
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { z, ZodError } from "zod";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { s3 } from "../s3";
import { CoHostRole, checkPermission, Permission } from "@/utils/co-host-rbac";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface CreateContextOptions {
  session: Session | null;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
    s3,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { user, ...session } = ctx.session;

  return next({
    ctx: {
      // infers the `session` as non-nullable
      user,
      session,
      db,
    },
  });
});

export const hostProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { user, ...session } = ctx.session;

  const hostProfile = await ctx.db.query.hostProfiles.findFirst({
    where: eq(hostProfiles.userId, user.id),
  });

  if (!hostProfile) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `Host profile not found for user id ${user.id}`,
    });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      user,
      hostProfile,
      session,
      db,
    },
  });
});

export const optionallyAuthedProcedure = t.procedure.use(({ ctx, next }) => {
  return next({
    ctx: {
      // infers `session` as nullable
      user: ctx.session?.user,
      session: ctx.session,
      db,
    },
  });
});

export const roleRestrictedProcedure = <
  //primarly used with Admin accounts
  TAllowedRoles extends readonly User["role"][],
>(
  allowedRoles: TAllowedRoles,
) =>
  t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const { user, ...session } = ctx.session;

    const data = await ctx.db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { role: true },
    });

    const role = data?.role ?? "guest";

    if (
      allowedRoles.length === 1 &&
      allowedRoles[0] === "admin" &&
      role !== "admin"
    ) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        // infers `session` as non-nullable and `role` as one of the allowed ones
        user: { ...user, role: role as TAllowedRoles[number] },
        session,
        db,
      },
    });
  });

//Co-host Procedure

export const coHostProcedure = <T extends z.AnyZodObject>(
  permission: Permission, //refer to file co-host-rbac.ts
  inputSchema: T,
) =>
  t.procedure
    .input(z.object({ currentHostTeamId: z.number() }).merge(inputSchema))
    .use(async ({ ctx, input, next }) => {
      // Validate session
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const { user, ...session } = ctx.session;

      // Fetch the host profile
      const hostProfile = await ctx.db.query.hostProfiles.findFirst({
        where: eq(hostProfiles.userId, user.id),
      });

      if (!hostProfile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Host profile not found for user id ${user.id}`,
        });
      }

      //check for hostIdInput

      // Use the provided currentHostTeamId to find the team member role
      const hostTeamMember = await ctx.db.query.hostTeamMembers.findFirst({
        where: and(
          eq(hostTeamMembers.hostTeamId, input.currentHostTeamId as number),
          eq(hostTeamMembers.userId, user.id),
        ),
      });

      if (!hostTeamMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Host team member not found for team id ${input.currentHostTeamId}`,
        });
      }

      //Check Permission
      const hasPermission = checkPermission({
        role: hostTeamMember.role,
        permission: permission,
      });
      console.log(hasPermission);
      if (!hasPermission) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User does not have permission",
        });
      }
      // Proceed to the next handler with the updated context
      return next({
        ctx: {
          user,
          hostProfile,
          session,
          db: ctx.db,
          hostTeamMember, // Include the team member in the context for downstream use
        },
      });
    });
