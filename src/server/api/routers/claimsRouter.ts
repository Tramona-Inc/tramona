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
} from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/server/server-utils";
import ClaimLinkEmail from "packages/transactional/emails/ClaimLinkEmail";

const isProduction = process.env.NODE_ENV === "production";

const baseUrl = isProduction
  ? "https://www.tramona.com"
  : "http://localhost:3000"; //change to your live server

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
});
