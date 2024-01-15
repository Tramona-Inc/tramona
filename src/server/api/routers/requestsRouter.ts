import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const requestsRouter = createTRPCRouter({
  getAllOutgoing: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {},
      with: {
        requestsMade: {
          columns: {
            userId: false,
          },
          with: {
            offers: {
              columns: {},
              with: {
                property: {
                  columns: {},
                  with: {
                    host: {
                      columns: {
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const requestsMade = (res?.requestsMade ?? []).map((request) => {
      const hostImages = request.offers
        .map((offer) => offer.property.host?.image)
        .filter(Boolean);

      const numOffers = request.offers.length;

      const { offers: _, ...requestExceptOffers } = request;

      return { ...requestExceptOffers, hostImages, numOffers };
    });

    return {
      requestsMade,
    };
  }),
});
