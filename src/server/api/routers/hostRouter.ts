import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { hostProfiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function fetchIndividualHostInfo(userId: string) {
  return await db.query.hostProfiles.findFirst({
    columns: {
      userId: true,
      type: true,
      becameHostAt: true,
      profileUrl: true,
      stripeAccountId: true,
      chargesEnabled: true,
    },
    where: eq(hostProfiles.userId, userId),
  });
}

export const hostRouter = createTRPCRouter({
  getHostsInfo: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.hostProfiles.findMany({
      columns: {
        userId: true,
        type: true,
        becameHostAt: true,
        profileUrl: true,
      },
      with: {
        hostUser: {
          columns: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: (user, { desc }) => [desc(user.becameHostAt)],
      limit: 10,
    });

    // Flatten the hostUser
    return res.map((item) => ({
      ...item,
      name: item.hostUser.name,
      email: item.hostUser.email,
      phoneNumber: item.hostUser.phoneNumber,
    }));
  }),
  getUserHostInfo: protectedProcedure.query(async ({ ctx }) => {
    return fetchIndividualHostInfo(ctx.user.id);
  }),

  getStripeAccountId: protectedProcedure.query(async ({ ctx }) => {
    const stripeAccountIdNumber = await db.query.hostProfiles.findFirst({
      columns: { stripeAccountId: true },
      where: eq(hostProfiles.userId, ctx.user.id),
    });
    console.log(stripeAccountIdNumber);
    return stripeAccountIdNumber;
  }),
});
