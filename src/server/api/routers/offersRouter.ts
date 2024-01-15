import { createTRPCRouter, roleRestrictedProcedure } from "@/server/api/trpc";
import { offers } from "@/server/db/schema";
import { formatArrayToString } from "@/utils/utils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const offersRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(createInsertSchema(offers))
    .mutation(async ({ ctx, input }) => {
      // request cant be inactive
      const requestPromise = ctx.db.query.requests.findFirst({
        where: eq(offers.requestId, input.requestId),
      });

      const propertyPromise = ctx.db.query.properties.findFirst({
        where: eq(offers.propertyId, input.propertyId),
      });

      const [request, property] = await Promise.all([
        requestPromise,
        propertyPromise,
      ]);

      if (!request?.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That request isn't active anymore",
        });
      }

      // host must own property (or its an admin)
      if (ctx.user.role === "host" && property?.hostId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // the property must fulfill the request
      const notEnoughSpace =
        property?.maxNumGuests != null &&
        request.numGuests > property.maxNumGuests;

      const tooFewBeds =
        request.minNumBeds != null &&
        property?.numBeds != null &&
        request.minNumBeds < property.numBeds;

      const tooFewBedrooms =
        request.minNumBedrooms != null &&
        property?.numBedrooms != null &&
        request.minNumBedrooms < property.numBedrooms;

      const wrongPropertyType =
        request.propertyType != null &&
        property?.propertyType != null &&
        request.propertyType !== property.propertyType;

      if (notEnoughSpace || tooFewBeds || tooFewBedrooms || wrongPropertyType) {
        const messagesMap = [
          ["doesn't accomodate enough guests", notEnoughSpace],
          ["doesn't have enough beds", tooFewBeds],
          ["doesn't have enough bedrooms", tooFewBedrooms],
          ["is the wrong type", wrongPropertyType],
        ] as const;

        const errorMessage = formatArrayToString(
          messagesMap.filter((x) => x[1]).map((x) => x[0]),
        );

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That property doesn't meet the requirements of the request",
          cause: `It ${errorMessage}`,
        });
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
