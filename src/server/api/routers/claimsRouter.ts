import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

import { z } from "zod";
import {
  users,
  claims,
  claimItems,
  hostProfiles,
  trips,
  claimResolutions,
} from "@/server/db/schema";
import type {
  Claim,
  ClaimResolution,
  ClaimPayment,
  ClaimItem,
} from "@/server/db/schema";
import { db } from "@/server/db";
import { and, eq, gte } from "drizzle-orm";
import { sendEmail } from "@/server/server-utils";
import ClaimLinkEmail from "packages/transactional/emails/ClaimLinkEmail";
import { sendSlackMessage } from "@/server/slack";
import { subDays } from "date-fns"; // Importing a date utility to subtract days from current date

interface QueryResultRow {
  claims: Claim | null; // Claims can be nullable if no matching row
  claim_items: ClaimItem | null; // ClaimItem can also be null
  claim_resolutions: ClaimResolution | null; // ClaimResolution can be null
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
      .leftJoin(claimResolutions, eq(claims.id, claimResolutions.claimId))
      .leftJoin(claimItems, eq(claims.id, claimItems.claimId));

    console.log(allClaims);
    const result = allClaims.reduce<
      Record<
        string, // Use string for the ID key
        {
          claim: Claim;
          claimItems: ClaimItem[];
          claimResolutions: ClaimResolution[];
        }
      >
    >((acc, row: QueryResultRow) => {
      // Explicitly type `row` here
      const claim = row.claims;
      const claimItem = row.claim_items;
      const claimResolution = row.claim_resolutions;

      // Ensure that claim and claim.id exist
      if (claim?.id) {
        // Initialize the claim if it doesn't exist in the accumulator
        if (!acc[claim.id]) {
          acc[claim.id] = {
            claim,
            claimItems: [],
            claimResolutions: [],
          };
        }

        // If there's a claim item, add it to the array
        if (claimItem) {
          acc[claim.id]!.claimItems.push(claimItem);
        }

        // If there's a claim resolution, add it to the array
        if (claimResolution) {
          acc[claim.id]!.claimResolutions.push(claimResolution);
        }
      }

      return acc;
    }, {});

    console.log(Object.values(result));
    return Object.values(result); // Return the accumulated result as an array
  }),

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
      const newClaimsLink = `${baseUrl}/host/report/claim/${newClaimId}`;
      console.log(input.superhogRequestId);

      await db.insert(claims).values({
        id: newClaimId,
        tripId: input.tripId,
        filedByHostId: input.hostId,
        claimsLink: newClaimsLink,
        reportedThroughSuperhogAt: input.superhogRequestId ? new Date() : null,
        superhogRequestId: input.superhogRequestId,
      });

      //create a resolution result for that claim
      await db.insert(claimResolutions).values({
        claimId: newClaimId,
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
            claimLink: newClaimsLink,
          }),
        });
      }

      return;
    }),

  getMyClaims: protectedProcedure.query(async ({ ctx }) => {
    const myClaims = await db.query.claims.findMany({
      where: eq(claims.filedByHostId, ctx.user.id),
    });
    console.log(myClaims);

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
        .set({ claimStatus: "In Review" })
        .where(eq(claims.id, input.claimId));

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

      const inserterdClaimItems = await db
        .insert(claimItems)
        .values(inputToClaimsConversion)
        .returning();

      console.log(inserterdClaimItems);
      await sendSlackMessage({
        isProductionOnly: true,
        channel: "tramona-bot",
        text: [
          `* ${ctx.user.email} added items to their claim report*`,
          ` ${inserterdClaimItems.length} damaged item(s) has been added in their claim. Please review the details and proceed with the necessary actions.`,
          `You can access the full report for further review and resolution at the link below:`,
          `<https://tramona.com/admin/reports|Go to report dashboard>`,
        ].join("\n"),
      });
      return;
    }),
});
