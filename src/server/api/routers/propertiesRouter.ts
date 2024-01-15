import { createTRPCRouter, roleRestrictedProcedure } from "@/server/api/trpc";
import { properties } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const propertiesRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(
      createInsertSchema(properties, {
        imageUrls: z.string().url().array(),
        airbnbUrl: z.string().url(),
        originalPrice: z.number().int().min(1),
        numBedrooms: z.number().int().min(1),
        numBeds: z.number().int().min(1),
        numRatings: z.number().int().min(0),
        maxNumGuests: z.number().int().min(1),
        avgRating: z.number().min(0).max(5),
      }).omit({
        hostId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      switch (ctx.user.role) {
        case "host":
          await ctx.db.insert(properties).values({
            ...input,
            hostId: ctx.user.id,
          });
          return;
        case "admin":
          if (!input.hostName) {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }

          await ctx.db.insert(properties).values({
            ...input,
            hostId: null, // unnecessary, just for clarity
          });
          return;
      }
    }),

  delete: roleRestrictedProcedure(["admin", "host"])
    .input(
      createSelectSchema(properties).pick({
        id: true,
      }),
    )
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
});
