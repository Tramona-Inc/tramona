import {
  createTRPCRouter,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  fillerRequestInsertSchema,
  fillerRequests,
  fillerOfferInsertSchema,
  fillerOffers,
  fillerBookingInsertSchema,
  fillerBookings,
  fillerRequestUpdateSchema,
  fillerOfferUpdateSchema,
  fillerBookingUpdateSchema,
} from "@/server/db/schema";

import { getNumNights } from "@/utils/utils";
import { zodNumber } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createCreationTime,
  createRandomDate,
  createUserNameAndPic,
  randomizeLocationAndPrice,
} from "@/components/activity-feed/admin/generationHelper";
import { sample } from "lodash";

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

      // 4. get filler data
      const fillerRequests = await ctx.db.query.fillerRequests.findMany({
        columns: {
          id: true,
          maxTotalPrice: true,
          location: true,
          checkIn: true,
          checkOut: true,
          userName: true,
          userProfilePicUrl: true,
          entryCreationTime: true,
        },
        limit: input.atLeastNumOfEntries ?? 30,
        orderBy: (fillerRequests, { desc }) => [
          desc(fillerRequests.entryCreationTime),
        ],
      });
      const fillerOffers = await ctx.db.query.fillerOffers.findMany({
        with: {
          property: {
            columns: {
              imageUrls: true,
              originalNightlyPrice: true,
            },
          },
        },
        limit: input.atLeastNumOfEntries ?? 30,
        orderBy: (fillerOffers, { desc }) => [
          desc(fillerOffers.entryCreationTime),
        ],
      });
      const fillerBookings = await ctx.db.query.fillerBookings.findMany({
        with: {
          property: {
            columns: {
              imageUrls: true,
              originalNightlyPrice: true,
              city: true,
            },
          },
        },
        limit: input.atLeastNumOfEntries ?? 30,
        orderBy: (fillerBookings, { desc }) => [
          desc(fillerBookings.entryCreationTime),
        ],
      });

      // Merge and sort the data
      const mergedData = [
        ...groupedRequests.map((item) => ({
          ...item,
          uniqueId: `req-${item.id}`,
          type: "request" as const,
          isFiller: false,
        })),
        ...matches.map((item) => ({
          ...item,
          uniqueId: `off-${item.id}`,
          type: "offer" as const,
          isFiller: false,
        })),
        ...bookings.map((item) => ({
          ...item,
          uniqueId: `boo-${item.id}`,
          type: "booking" as const,
          isFiller: false,
        })),
        ...fillerRequests.map((item) => ({
          id: item.id,
          location: item.location,
          maxTotalPrice: item.maxTotalPrice,
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          createdAt: item.entryCreationTime,
          madeByGroup: {
            owner: {
              id: "",
              name: item.userName,
              image: item.userProfilePicUrl,
            },
          },
          uniqueId: `fr-${item.id}`,
          type: "request" as const,
          isFiller: true,
        })),
        ...fillerOffers.map((item) => ({
          id: item.id,
          createdAt: item.entryCreationTime,
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          totalPrice: item.maxTotalPrice,
          requestId: null,
          propertyId: item.propertyId,
          property: {
            id: item.propertyId,
            imageUrls: item.property.imageUrls,
            originalNightlyPrice:
              item.originalNightlyPrice || item.property.originalNightlyPrice, // if admin didn't specify, use the property's nightly price
          },
          request: {
            madeByGroup: {
              owner: {
                id: "",
                name: item.userName,
                image: item.userProfilePicUrl,
              },
            },
          },
          uniqueId: `fo-${item.id}`,
          type: "offer" as const,
          isFiller: true,
        })),
        ...fillerBookings.map((item) => ({
          id: item.id,
          createdAt: item.entryCreationTime,
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          group: {
            owner: {
              id: "",
              name: item.userName,
              image: item.userProfilePicUrl,
            },
          },
          offer: { totalPrice: item.maxTotalPrice },
          property: {
            id: item.propertyId,
            imageUrls: item.property.imageUrls,
            originalNightlyPrice:
              item.originalNightlyPrice || item.property.originalNightlyPrice,
            city: item.property.city,
          },
          uniqueId: `fb-${item.id}`,
          type: "booking" as const,
          isFiller: true,
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return mergedData;
    }),

  // filler data operations
  createFillerRequest: roleRestrictedProcedure(["admin"])
    .input(fillerRequestInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const id = await ctx.db.insert(fillerRequests).values(input);
      return id;
    }),

  createFillerOffer: roleRestrictedProcedure(["admin"])
    .input(fillerOfferInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const id = await ctx.db.insert(fillerOffers).values(input);
      return id;
    }),

  createFillerBooking: roleRestrictedProcedure(["admin"])
    .input(fillerBookingInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const id = await ctx.db.insert(fillerBookings).values(input);
      return id;
    }),

  updateFillerRequest: roleRestrictedProcedure(["admin"])
    .input(fillerRequestUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const fillerRequest = await ctx.db.query.fillerRequests.findFirst({
        where: eq(fillerRequests.id, input.id),
        columns: { id: true },
      });

      if (!fillerRequest) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.db
        .update(fillerRequests)
        .set(input)
        .where(eq(fillerRequests.id, input.id));
    }),

  updateFillerOffer: roleRestrictedProcedure(["admin"])
    .input(fillerOfferUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const fillerOffer = await ctx.db.query.fillerOffers.findFirst({
        where: eq(fillerOffers.id, input.id),
        columns: { id: true },
      });

      if (!fillerOffer) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.db
        .update(fillerOffers)
        .set(input)
        .where(eq(fillerOffers.id, input.id));
    }),

  updateFillerBooking: roleRestrictedProcedure(["admin"])
    .input(fillerBookingUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const fillerBooking = await ctx.db.query.fillerBookings.findFirst({
        where: eq(fillerBookings.id, input.id),
        columns: { id: true },
      });

      if (!fillerBooking) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.db
        .update(fillerBookings)
        .set(input)
        .where(eq(fillerBookings.id, input.id));
    }),

  deleteFillerRequest: roleRestrictedProcedure(["admin"])
    .input(fillerRequestUpdateSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(fillerRequests)
        .where(eq(fillerRequests.id, input.id));
    }),

  deleteFillerOffer: roleRestrictedProcedure(["admin"])
    .input(fillerOfferUpdateSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(fillerOffers).where(eq(fillerOffers.id, input.id));
    }),

  deleteFillerBooking: roleRestrictedProcedure(["admin"])
    .input(fillerBookingUpdateSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(fillerBookings)
        .where(eq(fillerBookings.id, input.id));
    }),

  // Helper function for filler data generation
  getLocationAndPrice: roleRestrictedProcedure(["admin"])
    .input(
      z.object({
        atLeastNumOfEntries: zodNumber().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const pairs = await ctx.db.query.requests.findMany({
        columns: {
          location: true,
          maxTotalPrice: true,
          checkIn: true,
          checkOut: true,
        },
        limit: input.atLeastNumOfEntries ?? 30,
        orderBy: (requests, { desc }) => [desc(requests.createdAt)],
      });
      return pairs;
    }),

  // automatically generate filler data by one click
  generateFillerData: roleRestrictedProcedure(["admin"]).mutation(
    async ({ ctx }) => {
      const NUM_OF_REQUESTS = 10; //10
      const NUM_OF_OFFERS = 25; //25
      const NUM_OF_BOOKINGS = 5; //5
      let counter = 0;
      // generate filler requests
      const locationAndPricePromise = await ctx.db.query.requests.findMany({
        columns: {
          location: true,
          maxTotalPrice: true,
          checkIn: true,
          checkOut: true,
        },
        limit: 100,
        orderBy: (requests, { desc }) => [desc(requests.createdAt)],
      });
      const userDataPromise = createUserNameAndPic(100);
      const [userData, locationAndPrices] = await Promise.all([
        userDataPromise,
        locationAndPricePromise,
      ]);
      for (let i = 0; i < NUM_OF_REQUESTS; i++) {
        counter++;
        let username = "";
        let picture = "";
        if (userData[i] && i < userData.length) {
          username = userData[i]?.name ?? "";
          picture = userData[i]?.picture ?? "";
        }
        const randomDate = createRandomDate();
        const creationTime = createCreationTime();
        const random = randomizeLocationAndPrice(locationAndPrices);
        let numNights = 0;
        if (randomDate.checkIn && randomDate.checkOut) {
          numNights = getNumNights(randomDate.checkIn, randomDate.checkOut);
        }
        if (random?.location && randomDate.checkIn && randomDate.checkOut) {
          const fillerRequest = {
            userName: username,
            userProfilePicUrl: picture,
            maxTotalPrice: random.nightlyPrice * numNights,
            location: random.location,
            checkIn: new Date(randomDate.checkIn),
            checkOut: new Date(randomDate.checkOut),
            entryCreationTime: new Date(creationTime),
          };
          await ctx.db.insert(fillerRequests).values(fillerRequest);
        }
      }

      // generate filler offers
      const realOffers = await ctx.db.query.offers.findMany({
        columns: {
          totalPrice: true,
          checkIn: true,
          checkOut: true,
        },
        with: {
          property: {
            columns: {
              id: true,
              originalNightlyPrice: true,
            },
          },
        },
        limit: 100,
        orderBy: (properties, { desc }) => [desc(properties.createdAt)],
        // need to set up limits once we have more properties
      });
      const generatedOffers = realOffers
        .filter((offer) => offer.property.originalNightlyPrice !== null)
        .map((offer) => {
          const { totalPrice, checkIn, checkOut, property } = offer;
          const { originalNightlyPrice } = property;
          const nights = getNumNights(checkIn, checkOut);
          if (!originalNightlyPrice)
            throw new Error("originalNightlyPrice is undefined");

          const actualNightlyPrice = totalPrice / nights;
          let generatedNightlyPrice: number;

          if (
            actualNightlyPrice < 0.3 * originalNightlyPrice ||
            actualNightlyPrice >= originalNightlyPrice
          ) {
            const minPrice = 0.5 * originalNightlyPrice;
            const maxPrice = 0.9 * originalNightlyPrice;
            generatedNightlyPrice =
              minPrice + Math.random() * (maxPrice - minPrice);
          } else {
            const minPrice = 0.8 * actualNightlyPrice;
            const maxPrice = Math.min(
              1.2 * actualNightlyPrice,
              originalNightlyPrice,
            );
            generatedNightlyPrice =
              minPrice + Math.random() * (maxPrice - minPrice);
          }

          generatedNightlyPrice = Math.round(generatedNightlyPrice / 100) * 100;
          return {
            ...offer,
            generatedNightlyPrice,
          };
        });

      for (let i = 0; i < NUM_OF_OFFERS; i++) {
        counter++;
        let username = "";
        let picture = "";
        if (userData[counter] && counter < userData.length) {
          username = userData[counter]?.name ?? "";
          picture = userData[counter]?.picture ?? "";
        }
        const randomDate = createRandomDate();
        const creationTime = createCreationTime();
        const offer = sample(generatedOffers);
        let numNights = 0;
        if (randomDate.checkIn && randomDate.checkOut) {
          numNights = getNumNights(randomDate.checkIn, randomDate.checkOut);
        }
        if (randomDate.checkIn && randomDate.checkOut && offer) {
          // @ts-expect-error TODO !!!
          await ctx.db.insert(fillerOffers).values({
            userName: username,
            userProfilePicUrl: picture,
            propertyId: offer.property.id,
            originalNightlyPrice: offer.property.originalNightlyPrice,
            maxTotalPrice: offer.generatedNightlyPrice * numNights,
            checkIn: new Date(randomDate.checkIn),
            checkOut: new Date(randomDate.checkOut),
            entryCreationTime: new Date(creationTime),
          });
        }
      }

      // generate filler bookings
      for (let i = 0; i < NUM_OF_BOOKINGS; i++) {
        counter++;
        let username = "";
        let picture = "";
        if (userData[counter] && counter < userData.length) {
          username = userData[counter]?.name ?? "";
          picture = userData[counter]?.picture ?? "";
        }
        const randomDate = createRandomDate();
        const creationTime = createCreationTime();
        const booking = sample(generatedOffers);
        let numNights = 0;
        if (randomDate.checkIn && randomDate.checkOut) {
          numNights = getNumNights(randomDate.checkIn, randomDate.checkOut);
        }
        if (booking && randomDate.checkIn && randomDate.checkOut) {
          // @ts-expect-error TODO !!!
          await ctx.db.insert(fillerBookings).values({
            userName: username,
            userProfilePicUrl: picture,
            propertyId: booking.property.id,
            originalNightlyPrice: booking.property.originalNightlyPrice,
            maxTotalPrice: booking.generatedNightlyPrice * numNights,
            checkIn: new Date(randomDate.checkIn),
            checkOut: new Date(randomDate.checkOut),
            entryCreationTime: new Date(creationTime),
          });
        }
      }
    },
  ),
});
