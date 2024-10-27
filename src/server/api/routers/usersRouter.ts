import * as bcrypt from "bcrypt";
import {
  createTRPCRouter,
  optionallyAuthedProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  ALL_PROPERTY_TYPES,
  bookedDates,
  emergencyContacts,
  groups,
  hostProfiles,
  properties,
  propertyInsertSchema,
  referralCodes,
  userUpdateSchema,
  users,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { db } from "@/server/db";
import {
  censorEmail,
  censorPhoneNumber,
  generateReferralCode,
} from "@/utils/utils";
import { zodString } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import axios from "axios";
import { getCity } from "@/server/google-maps";
import { sendSlackMessage } from "@/server/slack";
import {
  createHostReferral,
  createInitialHostTeam,
  createLatLngGISPoint,
} from "@/server/server-utils";

export const usersRouter = createTRPCRouter({
  getUser: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    return await db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });
  }),

  getOnboardingStep: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        onboardingStep: true,
      },
    });
    if (!res) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    return res.onboardingStep;
  }),

  myVerificationStatus: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        isIdentityVerified: true,
      },
    });
    return {
      isIdentityVerified: res?.isIdentityVerified,
    };
  }),

  myPhoneNumber: protectedProcedure.query(async ({ ctx }) => {
    const phone = await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {
          phoneNumber: true,
        },
      })
      .then((res) => {
        return res?.phoneNumber ?? null;
      });

    return phone;
  }),

  myReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const referralCode = await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: {
          referralCode: true,
        },
      })
      .then((res) => res?.referralCode ?? null);

    // If no referral code genereated
    if (!referralCode) {
      const [generatedCode] = await ctx.db
        .insert(referralCodes)
        .values({ ownerId: ctx.user.id, referralCode: generateReferralCode() })
        .returning();

      return generatedCode;
    }

    return referralCode;
  }),

  /** only for use with updateUser -- use updateUser instead of this */
  updateProfile: protectedProcedure
    .input(userUpdateSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.user.id))
        .returning();
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

  isHost: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return false;
    const res = await ctx.db.query.hostProfiles.findFirst({
      where: eq(hostProfiles.userId, ctx.user.id),
    });
    return !!res;
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

      await ctx.db.insert(hostProfiles).values({
        userId: ctx.user.id,
        curTeamId: teamId,
        hostawayApiKey: input.hostawayApiKey,
        hostawayAccountId: input.hostawayAccountId,
        hostawayBearerToken: input.hostawayBearerToken,
      });

      await sendSlackMessage({
        isProductionOnly: true,
        text: [
          "*Host Profile Created:*",
          `User ${ctx.user.firstName} ${ctx.user.lastName} has become a host`,
        ].join("\n"),
        channel: "host-bot",
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
        //creates the discount but doenst validate or resolve it
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
              const locInfo = await getCity({
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
                city: locInfo.city,
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

  updatePhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: zodString({ maxLen: 20 }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db
        .update(users)
        .set({
          phoneNumber: input.phoneNumber,
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updatedUser;
    }),

  phoneNumberIsTaken: protectedProcedure
    .input(
      z.object({
        phoneNumber: zodString({ maxLen: 20 }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.query.users
        .findFirst({
          columns: { id: true },
          where: eq(users.phoneNumber, input.phoneNumber),
        })
        .then((res) => !!res);
    }),

  getMyHostProfile: protectedProcedure.query(async ({ ctx }) => {
    return (
      (await ctx.db.query.hostProfiles.findFirst({
        where: eq(hostProfiles.userId, ctx.user.id),
      })) ?? null
    );
  }),

  checkCredentials: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { email, password } = input;

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        return "email not found";
      }

      if (!user.password) {
        return "passwordless";
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return "incorrect password";
      }

      return "success";
    }),

  getPassword: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        password: true,
      },
    });
  }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { oldPassword, newPassword } = input;

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      if (!user.password) {
        return "user has no password";
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return "incorrect old password";
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await ctx.db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, ctx.user.id));

      return "success";
    }),

  getUserVerifications: protectedProcedure
    .input(z.object({ madeByGroupId: z.number() }))
    .query(async ({ input, ctx }) => {
      const verifications = await ctx.db.query.groups
        .findFirst({
          where: eq(groups.id, input.madeByGroupId),
          with: {
            owner: {
              columns: {
                dateOfBirth: true,
                phoneNumber: true,
                emailVerified: true,
                email: true,
              },
            },
          },
        })
        .then((res) => res?.owner);

      if (!verifications) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        ...verifications,
        censoredEmail: censorEmail(verifications.email),
        censoredPhoneNumber: censorPhoneNumber(verifications.phoneNumber!),
      };
    }),

  getMyVerifications: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;

    const verifications = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        dateOfBirth: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!verifications) throw new TRPCError({ code: "NOT_FOUND" });

    return verifications;
  }),

  addEmergencyContacts: protectedProcedure
    .input(
      z.object({
        emergencyEmail: z.string(),
        emergencyPhone: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(emergencyContacts).values({
        userId: ctx.user.id,
        emergencyEmail: input.emergencyEmail,
        emergencyPhone: input.emergencyPhone,
      });
    }),

  deleteEmergencyContact: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(emergencyContacts)
        .where(eq(emergencyContacts.id, input.id));
    }),

  getEmergencyContacts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.emergencyContacts.findMany({
      where: eq(emergencyContacts.userId, ctx.user.id),
    });
  }),
});
