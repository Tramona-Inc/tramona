import { hostPropertyFormSchema } from "@/components/host/HostPropertyForm";
import { hostPropertyOnboardingSchema } from "@/components/host/onboarding/OnboardingFooter";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  propertyInsertSchema,
  propertySelectSchema,
  propertyUpdateSchema,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";
import { z } from "zod";
import { bookedDates, properties } from "./../../db/schema/tables/properties";

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
          otherAmenities: input.otherAmenities ?? [], // Ensure otherAmenities is an array
        })
        .returning({ id: properties.id })
        .then((res) => res[0]?.id);
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
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.properties.findMany();
  }),
  getAllByFilter: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.properties.findMany({
      limit: 100,
      offset: 0,
    });
  }),
  getAllInfiniteScroll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 11;
      const { cursor } = input;

      const data = await ctx.db.query.properties.findMany(
        withCursorPagination({
          limit: limit + 1,
          cursors: [[properties.name, "desc", cursor ? cursor : undefined]],
        }),
      );

      return {
        data,
        nextCursor: data.length
          ? data[data.length - 1]?.createdAt.toISOString()
          : null,
      };
    }),

  hostInsertProperty: roleRestrictedProcedure(["host"])
    .input(hostPropertyFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "host") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return await ctx.db.insert(properties).values({
        ...input,
        hostId: ctx.user.id,
        hostName: ctx.user.name,
        imageUrls: input.imageUrls.map((urlObject) => urlObject.value),
        numBathrooms: 0, //TODO add it into form
      });
    }),
  getHostProperties: roleRestrictedProcedure(["host"]).query(
    async ({ ctx }) => {
      if (ctx.user.role !== "host") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return ctx.db.query.properties.findMany({
        where: eq(properties.hostId, ctx.user.id),
      });
    },
  ),
  hostInsertOnboardingProperty: roleRestrictedProcedure(["host"])
    .input(hostPropertyOnboardingSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "host") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return await ctx.db.insert(properties).values({
        ...input,
        hostId: ctx.user.id,
        hostName: ctx.user.name,
        imageUrls: input.imageUrls,
      });
    }),
  getBlockedDates: protectedProcedure
    .input(z.object({ propertyId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.bookedDates.findMany({
        where: eq(bookedDates.propertyId, input.propertyId),
        columns: {
          date: true
        },
      });
    }),
});
