import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { BucketListDestinationSelectSchema, ProfileInfoSchema, bucketListDestinations, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";


export const profileRouter = createTRPCRouter({
  getProfileInfo: protectedProcedure
    .query(async ({ ctx }) => {
      const res = await ctx.db.query.users.findFirst({
        with: {
          bucketListDestinations: true
        }
      })

      return res ?? null
    }),

  updateProfileInfo: protectedProcedure
    .input(ProfileInfoSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input)

      const r = await ctx.db.query.users.findFirst({ where: eq(users.id, ctx.user.id) })
      console.log(r)

      const res = await ctx.db
        .update(users)
        .set({
          name: input.name,
          about: input.about,
          location: input.location,
          socials: [
            input.facebook_link ?? '',
            input.youtube_link ?? '', 
            input.instagram_link ?? '',
            input.twitter_link ?? ''
          ]
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      console.log(res)
    }),

  createDestination: protectedProcedure
    .input(z.object({
      destination: BucketListDestinationSelectSchema.omit({ id: true, userId: true })
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(bucketListDestinations)
        .values({ ...input.destination, userId: ctx.user.id })
    }),

  updateDestination: protectedProcedure
    .input(z.object({
      destination: BucketListDestinationSelectSchema.omit({ userId: true })
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(bucketListDestinations)
        .set(input.destination)
        .where(
          and(
            eq(bucketListDestinations.userId, ctx.user.id),
            eq(bucketListDestinations.id, input.destination.id)
          )
        );
    }),

  deleteDestination: protectedProcedure
    .input(z.object({
      destinationId: z.number().int()
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(bucketListDestinations)
        .where(
          and(
            eq(bucketListDestinations.userId, ctx.user.id),
            eq(bucketListDestinations.id, input.destinationId)
          )
        )
    }),
})
