import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { requests, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const requestsRouter = createTRPCRouter({
  getAllOutgoing: protectedProcedure.query(async ({ ctx }) => {
    const requestsMade = await ctx.db.query.requests
      .findMany({
        where: eq(requests.userId, ctx.user.id),
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
      })
      .then((res) =>
        res.map((request) => {
          const hostImages = request.offers
            .map((offer) => offer.property.host?.image)
            .filter(Boolean);

          const numOffers = request.offers.length;

          const { offers: _, ...requestExceptOffers } = request;

          return { ...requestExceptOffers, hostImages, numOffers };
        }),
      );

    return {
      requestsMade,
    };
  }),

  // getAllIncoming: roleRestrictedProcedure(["host", "admin"]).query(
  //   async ({ ctx, input }) => {
  //     // get the requests close to this users properties
  //   },
  // ),

  create: protectedProcedure
    .input(
      createInsertSchema(requests).omit({
        userId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(requests).values({
        ...input,
        userId: ctx.user.id,
      });
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

      if (request?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db.delete(requests).where(eq(requests.id, input.id));
    }),
});
