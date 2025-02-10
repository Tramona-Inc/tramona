import {
  createTRPCRouter,
  hostProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  ALL_PROPERTY_TYPES,
  bookedDates,
  hostProfiles,
  properties,
  propertyInsertSchema,
  users,
} from "@/server/db/schema";
import { and, eq, isNull } from "drizzle-orm";

import { env } from "@/env";
import { db } from "@/server/db";
import { zodString } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import axios from "axios";
import {
  addHostProfile,
  createHostReferral,
  createInitialHostTeam,
  createLatLngGISPoint,
} from "@/server/server-utils";
import { getAddress } from "@/server/google-maps";

export const hostsRouter = createTRPCRouter({
  getMyHostProfile: protectedProcedure.query(async ({ ctx }) => {
    return (
      (await ctx.db.query.hostProfiles.findFirst({
        where: eq(hostProfiles.userId, ctx.user.id),
      })) ?? null
    );
  }),

  createUrlToBeHost: protectedProcedure
    .input(
      z.object({
        conversationId: zodString(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin") {
        const payload = {
          email: ctx.user.email,
          id: ctx.user.id,
        };

        // Create token
        const token = jwt.sign(payload, env.NEXTAUTH_SECRET, {
          expiresIn: "24h",
        });

        const url = `${env.NEXTAUTH_URL}/auth/signup/host?token=${token}&conversationId=${input.conversationId}`;

        return url;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Must be admin to create URL",
        });
      }
    }),

  upsertHostProfile: protectedProcedure
    .input(
      z
        .object({
          hostawayAccountId: z.string().optional(),
          hostawayBearerToken: z.string().optional(),
          hostawayApiKey: z.string().optional(),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input = {} }) => {
      const existingHostProfile = await ctx.db.query.hostProfiles.findFirst({
        where: eq(hostProfiles.userId, ctx.user.id),
      });

      if (existingHostProfile) return;

      const teamId = await createInitialHostTeam(ctx.user);

      await addHostProfile({
        userId: ctx.user.id,
        hostawayApiKey: input.hostawayApiKey,
        hostawayAccountId: input.hostawayAccountId,
        hostawayBearerToken: input.hostawayBearerToken,
      });

      const curUser = await db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });
      //referrals for host
      console.log(
        "calleing referral function here is the referral code used",
        curUser,
      );
      if (curUser) {
        //creates the discount but doesnt validate or resolve it
        await createHostReferral({
          userId: curUser.id,
          referralCodeUsed: curUser.referralCodeUsed,
        });
      }

      interface PropertyType {
        id: number;
        name: string;
      }

      interface HostawayPropertyTypesResponse {
        status: string;
        result: PropertyType[];
      }

      interface ListingAmenity {
        id: number;
        amenityId: number;
        amenityName: string;
      }

      interface Listing {
        id: number;
        propertyTypeId: number;
        name: string;
        // externalListingName: string;
        // internalListingName: string;
        description: string;
        thumbnailUrl: string | null;
        // houseRules: string | null;
        // keyPickup: string | null;
        // specialInstruction: string | null;
        // doorSecurityCode: string | null;
        country: string;
        countryCode: string;
        state: string;
        city: string | null;
        street: string;
        address: string;
        publicAddress: string;
        zipcode: string;
        price: number;
        starRating: number | null;
        // weeklyDiscount: number | null;
        // monthlyDiscount: number | null;
        // propertyRentTax: number;
        // guestPerPersonPerNightTax: number;
        // guestStayTax: number;
        // guestNightlyTax: number;
        // refundableDamageDeposit: number;
        // isDepositStayCollected: number;
        personCapacity: number;
        // maxChildrenAllowed: number | null;
        // maxInfantsAllowed: number | null;
        // maxPetsAllowed: number | null;
        lat: number;
        lng: number;
        checkInTimeStart: number;
        checkInTimeEnd: number | null;
        checkOutTime: number;
        cancellationPolicy: string;
        squareMeters: number | null;
        roomType: "entire_home" | "private_room" | "shared_room";
        bathroomType: string;
        bedroomsNumber: number;
        bedsNumber: number;
        bathroomsNumber: number;
        minNights: number;
        maxNights: number;
        guestsIncluded: number;
        cleaningFee: number;
        checkinFee: number;
        // priceForExtraPerson: number;
        // instantBookable: number;
        // instantBookableLeadTime: number | null;
        // airbnbBookingLeadTime: number | null;
        // airbnbBookingLeadTimeAllowRequestToBook: number | null;
        // airbnbName: string | null;
        // airbnbSummary: string | null;
        // airbnbSpace: string | null;
        // airbnbAccess: string | null;
        // airbnbInteraction: string | null;
        // airbnbNeighborhoodOverview: string | null;
        // airbnbTransit: string | null;
        // airbnbNotes: string | null;
        // airbnbExportStatus: string | null;
        // vrboExportStatus: string | null;
        // marriotExportStatus: string | null;
        // bookingcomExportStatus: string | null;
        // expediaExportStatus: string | null;
        // googleExportStatus: string | null;
        // allowSameDayBooking: number;
        // sameDayBookingLeadTime: number;
        contactName: string | null;
        // contactSurName: string | null;
        // contactPhone1: string | null;
        // contactPhone2: string | null;
        // contactLanguage: string | null;
        // contactEmail: string | null;
        // contactAddress: string | null;
        // language: string | null;
        // currencyCode: string;
        // timeZoneName: string;
        // wifiUsername: string | null;
        // wifiPassword: string | null;
        // cleannessStatus: string | null;
        // cleaningInstruction: string | null;
        // cleannessStatusUpdatedOn: string | null;
        // homeawayPropertyName: string;
        // homeawayPropertyHeadline: string | null;
        // homeawayPropertyDescription: string;
        // bookingcomPropertyName: string;
        // bookingcomPropertyRoomName: string;
        // bookingcomPropertyDescription: string;
        // invoicingContactName: string | null;
        // invoicingContactSurName: string | null;
        // invoicingContactPhone1: string | null;
        // invoicingContactPhone2: string | null;
        // invoicingContactLanguage: string | null;
        // invoicingContactEmail: string | null;
        // invoicingContactAddress: string | null;
        // invoicingContactCity: string | null;
        // invoicingContactZipcode: string | null;
        // invoicingContactCountry: string | null;
        // attachment: string | null;
        listingAmenities: ListingAmenity[];
        // listingBedTypes: any[];
        listingImages: string[];
        // listingTags: any[];
        // listingUnits: any[];
        // propertyLicenseNumber: string | null;
        // propertyLicenseType: string | null;
        // propertyLicenseIssueDate: string | null;
        // propertyLicenseExpirationDate: string | null;
        // customFieldValues: any[];
        // applyPropertyRentTaxToFees: string | null;
        // bookingEngineLeadTime: string | null;
        cancellationPolicyId: string | null;
        // vrboCancellationPolicyId: string | null;
        // marriottCancellationPolicyId: string | null;
        // bookingCancellationPolicyId: string | null;
        // listingFeeSetting: any[];
        // isRentalAgreementActive: string | null;
        averageNightlyPrice: string | null;
        // bookingcomPropertyRegisteredInVcs: string | null;
        // bookingcomPropertyHasVat: string | null;
        // bookingcomPropertyDeclaresRevenue: string | null;
        airbnbCancellationPolicyId: string | null;
        airbnbListingUrl: string | null;
        vrboListingUrl: string | null;
        // googleVrListingUrl: string | null;
        averageReviewRating: number;
        partnersListingMarkup: number;
        airbnbOfficialListingMarkup: number;
        // bookingEngineMarkup: number;
        // homeawayApiMarkup: number;
        // marriottListingMarkup: number;
        // latestActivityOn: string;
        // bookingEngineUrls: string[];
        // marriottListingName: string | null;
        // airbnbPetFeeAmount: string | null;
        // insertedOn: string;
        // listingSettings: any;
      }

      interface ListingsResponse {
        status: string;
        result: Listing[];
        count: number;
        limit: number;
        offset: number | null;
      }

      interface CalendarEntry {
        id: number;
        date: string;
        isAvailable: number;
        isProcessed: number;
        status: string;
        price: number;
        minimumStay: number;
        maximumStay: number;
        closedOnArrival: string | null;
        closedOnDeparture: string | null;
        note: string | null;
        countAvailableUnits: number;
        availableUnitsToSell: number;
        countPendingUnits: number;
        countBlockingReservations: string | null;
        countBlockedUnits: number;
        countReservedUnits: string | null;
        desiredUnitsToSell: string | null;
        // reservations: any[];
      }

      interface CalendarResponse {
        status: string;
        result: CalendarEntry[];
      }

      if (input.hostawayBearerToken) {
        const roomTypeMapping = {
          entire_home: "Entire place",
          private_room: "Private room",
          shared_room: "Shared room",
        } as const;

        const convertToTimeString = (time: number) => {
          let hours, minutes;

          if (time < 100) {
            // If the time is less than 100, treat it as hours only
            hours = time;
            minutes = 0;
          } else {
            // Otherwise, treat it as HHMM
            hours = Math.floor(time / 100);
            minutes = time % 100;
          }

          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
        };

        const propertyTypes = await axios
          .get<HostawayPropertyTypesResponse>(
            `https://api.hostaway.com/v1/propertyTypes`,
            {
              headers: {
                Authorization: `Bearer ${input.hostawayBearerToken}`,
              },
            },
          )
          .then((res) => res.data.result);

        // Create a map of propertyType ids to names
        const propertyTypeMap = propertyTypes.reduce<Record<number, string>>(
          (acc, type) => {
            acc[type.id] = type.name;
            return acc;
          },
          {},
        );

        const hostawayProperties = await axios
          .get<ListingsResponse>(`https://api.hostaway.com/v1/listings`, {
            headers: {
              Authorization: `Bearer ${input.hostawayBearerToken}`,
            },
          })
          .then((res) => res.data);

        const listings = hostawayProperties.result;

        try {
          const propertyObjects = await Promise.all(
            listings.map(async (property) => {
              // Get location information
              const addressComponents = await getAddress({
                lat: property.lat,
                lng: property.lng,
              });

              // Construct property object
              return {
                hostId: ctx.user.id,
                propertyType: z
                  .enum(ALL_PROPERTY_TYPES)
                  .catch("Other")
                  .parse(propertyTypeMap[property.propertyTypeId]),
                roomType: roomTypeMapping[property.roomType],
                maxNumGuests: property.personCapacity,
                numBeds: property.bedsNumber,
                numBedrooms: property.bedroomsNumber,
                numBathrooms: property.bathroomsNumber,
                latLngPoint: createLatLngGISPoint({
                  lat: property.lat,
                  lng: property.lng,
                }),
                city: addressComponents.city,
                county: addressComponents.county,
                stateName: addressComponents.stateName,
                stateCode: addressComponents.stateCode,
                countryISO: addressComponents.countryISO,
                country: addressComponents.country,
                hostName: property.contactName,
                originalListingId: property.id.toString(),
                checkInTime: convertToTimeString(property.checkInTimeStart),
                checkOutTime: convertToTimeString(property.checkOutTime),
                name: property.name,
                about: property.description,
                originalListingPlatform: "Hostaway" as const,
                address: property.address,
                avgRating: property.starRating ?? 0,
                hostTeamId: teamId,
                imageUrls: property.listingImages,
                amenities: property.listingAmenities.map(
                  (amenity) => amenity.amenityName,
                ),
                cancellationPolicy:
                  propertyInsertSchema.shape.cancellationPolicy
                    .catch(null)
                    .parse(property.cancellationPolicy),
              };
            }),
          );

          // Now pass the resolved array of objects to the .values() method
          const insertedProperties = await ctx.db
            .insert(properties)
            .values(propertyObjects)
            .returning({
              id: properties.id,
              listingId: properties.originalListingId,
            });

          const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

          for (const property of insertedProperties) {
            const calendarResponse: CalendarResponse = await axios
              .get<CalendarResponse>(
                `https://api.hostaway.com/v1/listings/${property.listingId}/calendar`,
                {
                  headers: {
                    Authorization: `Bearer ${input.hostawayBearerToken}`,
                  },
                },
              )
              .then((res) => res.data);

            const nonAvailableDates = calendarResponse.result.filter(
              (entry) => entry.status !== "available" && entry.date >= today!,
            );

            await ctx.db.insert(bookedDates).values(
              nonAvailableDates.map((dateEntry) => ({
                propertyId: property.id,
                date: new Date(dateEntry.date),
              })),
            );
          }
        } catch (err) {
          console.log(err);
        }
      }
    }),

  getHostInfo: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.hostProfiles.findMany({
      columns: {
        userId: true,
        becameHostAt: true,
      },
      with: {
        hostUser: {
          columns: { name: true, email: true, phoneNumber: true },
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

  getAllOverviewNotifications: hostProcedure
    .input(z.object({ currentHostTeamId: z.number() }))
    .query(async ({ input }) => {
      //we need to retrieve all of the propeties, and check to see if there is any properties that dont have thier calender synced
      console.log("loading");
      const unSyncedProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.hostTeamId, input.currentHostTeamId),
          isNull(properties.iCalLink),
        ),
        columns: {
          id: true,
          iCalLink: true,
          name: true,
        },
      });
      console.log(unSyncedProperties);
      return unSyncedProperties;
    }),


  // edit this for admin/feed 
  getAllHosts: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.hostProfiles.findMany({
      columns: {
        userId: true,
        becameHostAt: true,
      },
      with: {
        hostUser: {
          columns: { name: true, email: true, phoneNumber: true, },
        },
      },
      orderBy: (user, { desc }) => [desc(user.becameHostAt)],
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
