import {
  createTRPCRouter,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  properties,
  propertyInsertSchema,
  propertySelectSchema,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const propertiesRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(propertyInsertSchema.omit({ hostId: true }))
    .mutation(async ({ ctx, input }) => {
      switch (ctx.user.role) {
        case "host":
          return await ctx.db
            .insert(properties)
            .values({
              ...input,
              hostId: ctx.user.id,
            })
            .returning({ id: properties.id })
            .then((res) => res[0]?.id);
        case "admin":
          if (!input.hostName) {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }

          return await ctx.db
            .insert(properties)
            .values({
              ...input,
              hostId: null, // unnecessary, just for clarity
            })
            .returning({ id: properties.id })
            .then((res) => res[0]?.id);
      }
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
});
