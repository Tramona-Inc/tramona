import * as bcrypt from "bcrypt";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { groupMembers, requests, offers } from "@/server/db/schema";

import { env } from "@/env";
import { db } from "@/server/db";
import { generateReferralCode } from "@/utils/utils";
import { zodNumber, zodString } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { and, count, eq, exists, inArray } from "drizzle-orm";
import { groupBy } from "lodash";

export const feedRouter = createTRPCRouter({
  getFeed: publicProcedure
    .input(
      z.object({
        atLeastNumOfEntries: zodNumber().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // 1. get the requests
      const groupedRequests = await ctx.db.query.requests.findMany({
        columns: {
          madeByGroupId: true,
          id: true,
          location: true,
          checkIn: true,
          checkOut: true,
          maxTotalPrice: true,
          createdAt: true,
        },
        with: {
          madeByGroup: {
            columns: {},
            with: {
              owner: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        limit: input.atLeastNumOfEntries ?? 30,
        orderBy: (requests, { desc }) => [desc(requests.createdAt)],
      });

      // 2. get the matches(offers)
      const matches = await ctx.db.query.offers.findMany({
        columns: {
          id: true,
          propertyId: true,
          requestId: true,
          totalPrice: true,
          createdAt: true,
          checkIn: true,
          checkOut: true,
        },
        with: {
          property: {
            columns: { id: true, imageUrls: true, originalNightlyPrice: true },
          },
          request: {
            columns: {},
            with: {
              madeByGroup: {
                columns: {},
                with: {
                  owner: {
                    columns: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        limit: input.atLeastNumOfEntries ?? 30,
        orderBy: (offers, { desc }) => [desc(offers.createdAt)],
      });

      // 3. get bookings
      const bookings = await ctx.db.query.trips.findMany({
        columns: {
          id: true,
          createdAt: true,
          checkIn: true,
          checkOut: true,
        },
        with: {
          group: {
            columns: {},
            with: {
              owner: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          offer: {
            columns: {
              totalPrice: true,
            },
          },
          property: {
            columns: {
              id: true,
              originalNightlyPrice: true,
              city: true,
              imageUrls: true,
            },
          },
        },
        limit: input.atLeastNumOfEntries ?? 30,
        orderBy: (trips, { desc }) => [desc(trips.createdAt)],
      });

      // Merge and sort the data
      const mergedData = [
        ...groupedRequests.map((item) => ({
          ...item,
          uniqueId: `req-${item.id}`,
          type: "request" as const,
        })),
        ...matches.map((item) => ({
          ...item,
          uniqueId: `off-${item.id}`,
          type: "offer" as const,
        })),
        ...bookings.map((item) => ({
          ...item,
          uniqueId: `boo-${item.id}`,
          type: "booking" as const,
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return { mergedData };
    }),
});
