import {
  createTRPCRouter,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  properties,
  propertyInsertSchema,
  propertySelectSchema,
  propertyUpdateSchema,
  users,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const propertiesRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(propertyInsertSchema.omit({ hostId: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin" && !input.hostName) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return await ctx.db
        .insert(properties)
        .values({
          ...input,
          hostId: ctx.user.role === "admin" ? null : ctx.user.id,
        })
        .returning({ id: properties.id })
        .then((res) => res[0]!.id);
    }),

  // uses the hostId passed in the input instead of the admin's user id
  createForHost: roleRestrictedProcedure(["admin"])
    .input(propertyInsertSchema.extend({ hostId: z.string() })) // make hostid required
    .mutation(async ({ ctx, input }) => {
      const host = await ctx.db.query.users.findFirst({
        columns: { name: true, role: true },
        where: eq(users.id, input.hostId),
      });

      if (!host) {
        return { status: "host not found" } as const;
      }
      if (host.role !== "host" && host.role !== "admin") {
        return { status: "user not a host" } as const;
      }

      await ctx.db.insert(properties).values(input);

      return {
        status: "success",
        hostName: host.name,
      } as const;
    }),

  update: roleRestrictedProcedure(["admin", "host"])
    .input(propertyUpdateSchema.omit({ hostId: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin" && !input.hostName) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await ctx.db
        .update(properties)
        .set({
          ...input,
          hostId: ctx.user.role === "admin" ? null : ctx.user.id,
        })
        .where(eq(properties.id, input.id));
    }),

  delete: roleRestrictedProcedure(["admin", "host"])
    .input(propertySelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "host") {
        const request = await ctx.db.query.properties.findFirst({
          where: eq(properties.id, input.id),
          columns: {
            hostId: true,
          },
        });

        if (request?.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(properties).where(eq(properties.id, input.id));
    }),

  getById: publicProcedure
    .input(propertySelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.properties.findFirst({
        where: eq(properties.id, input.id),
      });
    }),

  getHostProperties: roleRestrictedProcedure(["host"]).query(
    async ({ ctx }) => {
      return await ctx.db.query.properties.findMany({
        where: eq(properties.hostId, ctx.user.id),
      });
    },
  ),
});
