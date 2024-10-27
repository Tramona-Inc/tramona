import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

import { z } from "zod";
import {
  users,
  claims,
  claimItems,
  trips,
  claimItemResolutions,
  ALL_RESOLUTION_RESULTS,
  ALL_PAYMENT_SOURCES,
  claimPayments,
  groups,
  ALL_TRAVELER_CLAIM_RESPONSES,
} from "@/server/db/schema";

import type {
  Claim,
  ClaimItemResolution,
  ClaimPayment,
  ClaimItem,
} from "@/server/db/schema";
import { db } from "@/server/db";
import { and, eq, gte, sql } from "drizzle-orm";
import { sendEmail } from "@/server/server-utils";
import ClaimLinkEmail from "packages/transactional/emails/ClaimLinkEmail";
import { sendSlackMessage } from "@/server/slack";
import { TRPCError } from "@trpc/server";
import TravelerClaimLinkEmail from "packages/transactional/emails/TravelerClaimLinkEmail";

interface QueryResultRow {
  claims: Claim | null; // Claims can be nullable if no matching row
  claim_items: ClaimItem | null; // ClaimItem can also be null
  claim_item_resolutions: ClaimItemResolution | null; // ClaimItemResolution can be null
}

const isProduction = process.env.NODE_ENV === "production";

const baseUrl = isProduction
  ? "https://www.tramona.com"
  : "http://localhost:3000"; //change to your live server

const claimItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  requestedAmount: z.number().min(0, "Price must be a positive number"),
  description: z.string(),
  imagesList: z.array(z.string()),
});

export const claimsRouter = createTRPCRouter({
  getAllClaims: roleRestrictedProcedure(["admin"]).query(async () => {
    const allClaims = await db
      .select()
      .from(claims)
      .leftJoin(
        claimItemResolutions,
        eq(claims.id, claimItemResolutions.claimId),
      )
      .leftJoin(claimItems, eq(claims.id, claimItems.claimId));

    const result = allClaims.reduce<
      Record<
        string,
        {
          claim: Claim;
          claimItems: ClaimItem[];
          claimItemResolutions: ClaimItemResolution[];
        }
      >
    >((acc, row: QueryResultRow) => {
      const claim = row.claims;
      const claimItem = row.claim_items;
      const claimItemResolution = row.claim_item_resolutions;

      if (claim?.id) {
        // Initialize the claim if it doesn't exist in the accumulator
        if (!acc[claim.id]) {
          acc[claim.id] = {
            claim,
            claimItems: [],
            claimItemResolutions: [],
          };
        }

        // Add claim item if it doesn't already exist in the array
        if (
          claimItem &&
          !acc[claim.id]!.claimItems.some((item) => item.id === claimItem.id)
        ) {
          acc[claim.id]!.claimItems.push(claimItem);
        }

        // Add claim item resolution if it doesn't already exist in the array
        if (
          claimItemResolution &&
          !acc[claim.id]!.claimItemResolutions.some(
            (resolution) => resolution.id === claimItemResolution.id,
          )
        ) {
          acc[claim.id]!.claimItemResolutions.push(claimItemResolution);
        }
      }

      return acc;
    }, {});

    return Object.values(result); // Return the accumulated result as an array
  }),

  getClaimWithAllDetailsById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const claimWDetails = await db
        .select()
        .from(claims)
        .where(eq(claims.id, input))
        .leftJoin(
          claimItemResolutions,
          eq(claims.id, claimItemResolutions.claimId),
        )
        .leftJoin(claimItems, eq(claims.id, claimItems.claimId));

      const result = claimWDetails.reduce<{
        claim: Claim;
        claimItems: ClaimItem[];
        claimItemResolutions: ClaimItemResolution[];
      }>(
        (acc, row) => {
          const claim = row.claims;
          const claimItem = row.claim_items;
          const claimItemResolution = row.claim_item_resolutions;

          // Assign the claim once
          if (!acc.claim) {
            acc.claim = claim;
          }

          // Deduplicate claimItems
          if (
            claimItem &&
            !acc.claimItems.some((item) => item.id === claimItem.id)
          ) {
            acc.claimItems.push(claimItem);
          }

          // Deduplicate claimItemResolutions
          if (
            claimItemResolution &&
            !acc.claimItemResolutions.some(
              (res) => res.id === claimItemResolution.id,
            )
          ) {
            acc.claimItemResolutions.push(claimItemResolution);
          }

          return acc;
        },
        {
          claim: null!,
          claimItems: [],
          claimItemResolutions: [],
        },
      );

      return result;
    }),

  getCurrentAllClaimsAgainstTraveler: protectedProcedure.query(
    async ({ ctx }) => {
      const claimsWithItemsRaw = await db
        .select({ claims, claimItems })
        .from(claims)
        .innerJoin(trips, eq(claims.tripId, trips.id))
        .innerJoin(groups, eq(trips.groupId, groups.id))
        .innerJoin(claimItems, eq(claimItems.claimId, claims.id))
        .where(eq(groups.ownerId, ctx.user.id));

      claimsWithItemsRaw;
      // Post-process the results to structure them by claims with nested claim items
      const claimsAgainstUser = Object.values(
        claimsWithItemsRaw.reduce<
          Record<
            string, // Use string for the ID key
            {
              claim: Claim;
              claimItems: ClaimItem[];
            }
          >
        >((acc, row) => {
          const { claims, claimItems } = row;
          const claimId = claims.id.toString();

          if (acc[claimId]) {
            acc[claimId].claimItems.push(claimItems);
          } else {
            // If the claim does not exist, initialize it with the claim and first item
            acc[claimId] = {
              claim: claims,
              claimItems: [claimItems],
            };
          }

          return acc;
        }, {}),
      );
      claimsAgainstUser;
      return claimsAgainstUser;
    },
  ),

  createClaim: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        hostId: z.string(),
        superhogRequestId: z.number().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      //check to see if inputs exist
      const newClaimId = uuidv4();
      const newHostClaimLink = `${baseUrl}/host/report/claim/${newClaimId}`;

      await db.insert(claims).values({
        id: newClaimId,
        tripId: input.tripId,
        filedByHostId: input.hostId,
        claimsLink: newHostClaimLink,
        reportedThroughSuperhogAt: input.superhogRequestId ? new Date() : null,
        superhogRequestId: input.superhogRequestId,
      });

      const filedHost = await db.query.users.findFirst({
        where: eq(users.id, input.hostId),
      });

      if (filedHost) {
        await sendEmail({
          to: filedHost.email,
          subject: "Complete Your Incident Report - Action Required",
          content: ClaimLinkEmail({
            hostName: filedHost.firstName ?? "Traveler",
            claimLink: newHostClaimLink,
          }),
        });
      }

      return;
    }),

  getMyClaims: protectedProcedure.query(async ({ ctx }) => {
    const myClaims = await db.query.claims.findMany({
      where: eq(claims.filedByHostId, ctx.user.id),
    });
    myClaims;

    return myClaims;
  }),

  getClaimDetailsWPropertyById: protectedProcedure
    .input(z.object({ claimId: z.string() }))
    .query(async ({ input }) => {
      const curClaim = await db.query.claims.findFirst({
        where: eq(claims.id, input.claimId),
        with: {
          trip: {
            with: {
              property: {
                columns: {
                  name: true,
                  city: true,
                  imageUrls: true,
                },
              },
            },
          },
        },
      });

      return curClaim;
    }),
  //this is to submit claim evidence after recieving the email link
  submitClaimEvidence: protectedProcedure
    .input(
      z.object({
        claimId: z.string().uuid(),
        tripId: z.number(),
        claimItems: z.array(claimItemSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const curTrip = await db.query.trips.findFirst({
        where: eq(trips.id, input.tripId),
      });

      //set claim to inRever
      await db
        .update(claims)
        .set({ claimStatus: "In Review", inReviewAt: new Date() })
        .where(eq(claims.id, input.claimId));

      let insertedItemsLength = 0;
      await db.transaction(async (trx) => {
        // Convert input to claim items
        const inputToClaimsConversion = input.claimItems.map((item) => ({
          claimId: input.claimId,
          tripId: input.tripId,
          propertyId: curTrip?.propertyId ?? null,
          itemName: item.itemName,
          requestedAmount: item.requestedAmount,
          outstandingAmount: item.requestedAmount,
          description: item.description,
          imageUrls: item.imagesList,
        }));

        // Insert the claim items in one go
        const insertedClaimItems = await trx
          .insert(claimItems)
          .values(inputToClaimsConversion)
          .returning();
        // Store the length of inserted claim items
        insertedItemsLength = insertedClaimItems.length;
        insertedClaimItems;

        // Map the inserted claim items to claim resolutions in one go
        const claimResolutions = insertedClaimItems.map((item) => ({
          claimId: input.claimId,
          claimItemId: item.id,
        }));

        // Insert the resolutions in one go
        await trx.insert(claimItemResolutions).values(claimResolutions);
      });

      //sendEmail to traveler that a claim has been opened against them
      //send email to trip owner id
      const newTravelerClaimLink = `${baseUrl}/my-trips/billing/claim-details/${input.claimId}`;

      const tripOwner = await db
        .select({ email: users.email, firstName: users.firstName })
        .from(trips)
        .innerJoin(groups, eq(trips.groupId, groups.id))
        .innerJoin(users, eq(groups.ownerId, users.id))
        .execute()
        .then((res) => res[0]!);

      await sendEmail({
        to: tripOwner.email,
        subject: "Damage - Action Required",
        content: TravelerClaimLinkEmail({
          travelerName: tripOwner.firstName ?? "Traveler",
          claimLink: newTravelerClaimLink,
        }),
      });

      await sendSlackMessage({
        isProductionOnly: true,
        channel: "tramona-bot",
        text: [
          `* ${ctx.user.email} added items to their claim report*`,
          ` ${insertedItemsLength} damaged item(s) has been added in their claim. Please review the details and proceed with the necessary actions.`,
          `You can access the full report for further review and resolution at the link below:`,
          `<https://tramona.com/admin/reports|Go to report dashboard>`,
        ].join("\n"),
      });
      return;
    }),

  travelerCounterClaim: protectedProcedure
    .input(
      z.object({
        claimId: z.string(),
        claimItemId: z.number(),
        travelerClaimResponse: z.enum(ALL_TRAVELER_CLAIM_RESPONSES),
        travelerResponseDescription: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //check to make sure that the correct traveler is submitting claim
      const tripOwnerId = await db
        .select({ id: users.id })
        .from(claims)
        .innerJoin(trips, eq(claims.tripId, trips.id))
        .innerJoin(groups, eq(trips.groupId, groups.id))
        .innerJoin(users, eq(groups.ownerId, users.id))
        .where(eq(claims.id, input.claimId))
        .execute()
        .then((res) => res[0]!);

      tripOwnerId.id;
      if (ctx.user.id === tripOwnerId.id) {
        //2.update the claimItems Id await
        await db
          .update(claimItems)
          .set({
            travelerClaimResponse: input.travelerClaimResponse,
            travelerResponseDescription: input.travelerResponseDescription,
          })
          .where(eq(claimItems.id, input.claimItemId));
        //check so if all the claim items are solved, then send slack (we might not need this)
        const allClaimItemsFulfilled = await db.query.claimItems
          .findMany({
            where: eq(claimItems.claimId, input.claimId),
          })
          .then((res) => {
            return res.every(
              (item) => item.travelerClaimResponse !== "Pending",
            );
          });

        if (allClaimItemsFulfilled) {
          await sendSlackMessage({
            text: [
              "*A Traveler completed their claim response:*",
              ` ${ctx.user.email} has completed claim ${input.claimId}`,
              `<https://tramona.com/admin/reports/claim-details/${input.claimId}|Please Resolve Claim Here>`,
            ].join("\n"),
            channel: "tramona-bot",
            isProductionOnly: false,
          });
        }
      } else {
        throw new TRPCError({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
          cause: "Unauthorized User",
        });
      }
      return;
    }),

  resolveClaimItem: protectedProcedure
    .input(
      z.object({
        claimId: z.string(),
        claimItemId: z.number(),
        resolutionResult: z.enum(ALL_RESOLUTION_RESULTS),
        resolutionDescription: z.string(),
        approvedAmount: z.number(),
        paymentSource: z.enum(ALL_PAYMENT_SOURCES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //we need to do two things
      //1.) create a payment result
      //2.)we need to update the claim_resolution resolutionResults, description, resolved
      //3.) update the claim_items payment complete, and outstandingAmount
      //4.) Dont update claims do that at the verryyyy end

      await db.insert(claimPayments).values({
        claimItemId: input.claimItemId,
        source: input.paymentSource,
        amountPaid: input.approvedAmount,
        paymentDate: new Date(),
      });

      //update claimResoultion
      await db
        .update(claimItemResolutions)
        .set({
          resolutionResult: input.resolutionResult,
          resolutionDescription: input.resolutionDescription,
          resolvedByAdminId: ctx.user.id,
        })
        .where(eq(claimItemResolutions.claimItemId, input.claimItemId));
      //update claim items

      await db
        .update(claimItems)
        .set({
          outstandingAmount: sql`${claimItems.outstandingAmount} - ${input.approvedAmount}`,
          paymentCompleteAt: new Date(),
          resolvedBySuperhog: input.paymentSource === "Superhog" ? true : false,
        })
        .where(eq(claimItems.id, input.claimItemId));

      return;
    }),

  closeClaim: roleRestrictedProcedure(["admin"])
    .input(z.object({ claimId: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .update(claims)
        .set({ resolvedAt: new Date(), claimStatus: "Resolved" })
        .where(eq(claims.id, input.claimId));

      return;
    }),
});
