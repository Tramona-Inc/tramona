import {
  createTRPCRouter,
  optionallyAuthedProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  BucketListDestinationSelectSchema,
  BucketListPropertySchema,
  ProfileInfoSchema,
  bucketListDestinations,
  bucketListProperties,
  properties,
  users,
} from "@/server/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  getProfileInfo: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      with: {
        bucketListDestinations: true,
        bucketListProperties: true,
      },
    });

    return res ?? null;
  }),

  updateProfileInfo: protectedProcedure
    .input(ProfileInfoSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          name: input.name,
          about: input.about,
          location: input.location,
          socials: [
            input.facebook_link ?? "",
            input.youtube_link ?? "",
            input.instagram_link ?? "",
            input.twitter_link ?? "",
          ],
        })
        .where(eq(users.id, ctx.user.id));
    }),

  getAllPropertiesWithDetails: protectedProcedure
    .input(
      z.object({
        lat: z.number().optional(),
        long: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const lat = input.lat ?? 0;
      const long = input.long ?? 0;

      const myProperties = await ctx.db
        .select()
        .from(bucketListProperties)
        .where(eq(bucketListProperties.userId, ctx.user.id));
      const myPropertyIds = myProperties.map((p) => p.propertyId);

      const data = await ctx.db
        .select({
          id: properties.id,
          imageUrls: properties.imageUrls,
          name: properties.name,
          maxNumGuests: properties.maxNumGuests,
          numBedrooms: properties.numBedrooms,
          numBathrooms: properties.numBathrooms,
          numBeds: properties.numBeds,
          originalNightlyPrice: properties.originalNightlyPrice,
          distance: sql`
            6371 * ACOS(
              SIN(${(lat * Math.PI) / 180}) * SIN(radians(latitude)) + COS(${(lat * Math.PI) / 180}) * COS(radians(latitude)) * COS(radians(longitude) - ${(long * Math.PI) / 180})
            ) AS distance`,
        })
        .from(properties)
        .where(inArray(properties.id, myPropertyIds));

      const fullBucketListProperties = data
        .map((property) => {
          const bucketListProperty = myProperties.find(
            (p) => p.propertyId === property.id,
          );
          if (bucketListProperty) {
            return {
              ...property,
              bucketListId: bucketListProperty.id,
            };
          }
        })
        .filter((p) => !!p);

      return fullBucketListProperties;
    }),

  addProperty: protectedProcedure
    .input(BucketListPropertySchema.omit({ id: true, userId: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(bucketListProperties).values({
        ...input,
        userId: ctx.user.id,
      });
    }),

  // update property timeline
  updateProperty: protectedProcedure
    .input(BucketListPropertySchema.omit({ userId: true, propertyId: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(bucketListProperties)
        .set(input)
        .where(
          and(
            eq(bucketListProperties.userId, ctx.user.id),
            eq(bucketListProperties.id, input.id),
          ),
        );
    }),

  removeProperty: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input: propertyId }) => {
      await ctx.db
        .delete(bucketListProperties)
        .where(
          and(
            eq(bucketListProperties.userId, ctx.user.id),
            eq(bucketListProperties.id, propertyId),
          ),
        );
    }),

  isBucketListProperty: optionallyAuthedProcedure
    .input(z.object({ blPropertyId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return false;
      const properties = await ctx.db
        .select()
        .from(bucketListProperties)
        .where(eq(bucketListProperties.userId, ctx.user.id));

      const propertyIds = properties.map((p) => p.propertyId);

      return propertyIds.includes(input.blPropertyId);
    }),

  createDestination: protectedProcedure
    .input(
      z.object({
        destination: BucketListDestinationSelectSchema.omit({
          id: true,
          userId: true,
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(bucketListDestinations)
        .values({ ...input.destination, userId: ctx.user.id });
    }),

  updateDestination: protectedProcedure
    .input(
      z.object({
        destination: BucketListDestinationSelectSchema.omit({ userId: true }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(bucketListDestinations)
        .set(input.destination)
        .where(
          and(
            eq(bucketListDestinations.userId, ctx.user.id),
            eq(bucketListDestinations.id, input.destination.id),
          ),
        );
    }),

  deleteDestination: protectedProcedure
    .input(
      z.object({
        destinationId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(bucketListDestinations)
        .where(
          and(
            eq(bucketListDestinations.userId, ctx.user.id),
            eq(bucketListDestinations.id, input.destinationId),
          ),
        );
    }),
});
