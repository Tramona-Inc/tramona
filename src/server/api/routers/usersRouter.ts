import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        role: true,
        referralCodeUsed: true,
      },
    });

    return {
      role: res?.role ?? 'guest',
      referralCodeUsed: res?.referralCodeUsed ?? null,
    };
  }),
});
