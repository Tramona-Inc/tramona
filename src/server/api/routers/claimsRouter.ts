import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

import { z } from "zod";
import {
  referralCodes,
  users,
  claims,
  claimItems,
  hostProfiles,
  trips,
} from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/server/server-utils";
import ClaimLinkEmail from "packages/transactional/emails/ClaimLinkEmail";

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

  getClaimDetailsWProperty: protectedProcedure
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
    .mutation(async ({ input }) => {
      const curTrip = await db.query.trips.findFirst({
        where: eq(trips.id, input.tripId),
      });

      const inputToClaimsConversion = input.claimItems.map((item) => ({
        claimId: input.claimId,
        tripId: input.tripId,
        propertyId: curTrip?.propertyId ?? null,
        itemName: item.itemName,
        requestedAmount: item.requestedAmount,
        outstandingAmount: item.requestedAmount,
        description: item.description,
        imagesList: item.imagesList,
      }));

      const inserterdClaimItems = await db
        .insert(claimItems)
        .values(inputToClaimsConversion)
        .returning();

      console.log(inserterdClaimItems);
      return;
    }),
});
