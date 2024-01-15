import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { requests, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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

  create: protectedProcedure
    .input(
      createInsertSchema(requests).omit({
        userId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newRequest = {
        ...input,
        userId: ctx.session.user.id,
      };
      await ctx.db.insert(requests).values(newRequest);
    }),

  delete: protectedProcedure
    .input(
      createSelectSchema(requests).pick({
        id: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
        columns: {
          userId: true,
        },
      });

      if (request?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db.delete(requests).where(eq(requests.id, input.id));
    }),
});
