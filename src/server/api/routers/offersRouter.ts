import { createTRPCRouter, roleRestrictedProcedure } from "@/server/api/trpc";
import { offers } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const offersRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(createInsertSchema(offers))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(offers.requestId, input.requestId),
        columns: {
          isActive: true,
        },
      });

      // request cant be inactive
      if (!request?.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That request isn't active anymore",
        });
      }

      if (ctx.user.role === "host") {
        const property = await ctx.db.query.properties.findFirst({
          where: eq(offers.propertyId, input.propertyId),
          columns: {
            hostId: true,
          },
        });

        // host must own property (or its an admin)
        if (property?.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.insert(offers).values(input);
    }),

  delete: roleRestrictedProcedure(["admin", "host"])
    .input(
      createSelectSchema(offers).pick({
        id: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "host") {
        const request = await ctx.db.query.offers.findFirst({
          where: eq(offers.id, input.id),
          columns: {},
          with: {
            property: {
              columns: {
                hostId: true,
              },
            },
          },
        });

        if (request?.property?.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(offers).where(eq(offers.id, input.id));
    }),
});
