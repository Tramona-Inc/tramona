import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  groupMembers,
  groups,
  offerInsertSchema,
  offerSelectSchema,
  offerUpdateSchema,
  offers,
  properties,
  referralCodes,
  requestSelectSchema,
  users,
} from "@/server/db/schema";
import { getAddress, getCoordinates } from "@/server/google-maps";
import { formatDateRange } from "@/utils/utils";

import { TRPCError } from "@trpc/server";
import {
  and,
  desc,
  eq,
  exists,
  isNotNull,
  isNull,
  lt,
  ne,
  notInArray,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import axios from "axios";

export const pmsRouter = createTRPCRouter({
  generateHostawayBearerToken: publicProcedure
    .input(z.object({ accountId: z.string(), apiKey: z.string() }))
    .mutation(async ({ input }) => {
      const { accountId, apiKey } = input;
      const data = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: accountId,
        client_secret: apiKey,
        scope: 'general'
      }).toString();

      try {
        const response = await axios.post(
          "https://api.hostaway.com/v1/accessTokens",
          data,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cache-Control": "no-cache",
            },
          }
        );

        console.log("Hostaway bearer token response:", response.data.access_token);

        return {bearerToken: response.data.access_token};

      } catch (error) {
        console.error("Error generating Hostaway bearer token:", error);
        throw new Error("Failed to generate Hostaway bearer token");
      }

    }),
})