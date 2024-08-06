import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ProfileInfoSchema, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const profileRouter = createTRPCRouter({
  getProfileInfo: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });

    if (!res) throw new TRPCError({ code: "NOT_FOUND" });

    return res;
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
});
