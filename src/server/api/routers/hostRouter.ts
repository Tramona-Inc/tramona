import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const hostRouter = createTRPCRouter({
  getHostInfo: protectedProcedure.query(async ({ ctx }) => {
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
});
