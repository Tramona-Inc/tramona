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
import { and, eq, inArray } from "drizzle-orm";
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

  getAllPropertiesWithDetails: protectedProcedure.query(async ({ ctx }) => {
    const myProperties = await ctx.db
      .select()
      .from(bucketListProperties)
      .where(eq(bucketListProperties.userId, ctx.user.id));
    const myPropertyIds = myProperties.map((p) => p.propertyId);

    if (myPropertyIds.length > 0) {
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
    } else {
      return [];
    }
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

  getAllPropertiesInBucketList: optionallyAuthedProcedure.query(
    async ({ ctx }) => {
      if (!ctx.user) return [];

      const result = await ctx.db.query.bucketListProperties.findMany({
        where: eq(bucketListProperties.userId, ctx.user.id),
        columns: {
          propertyId: true,
        },
      });

      return result.map((res) => res.propertyId);
    },
  ),

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
