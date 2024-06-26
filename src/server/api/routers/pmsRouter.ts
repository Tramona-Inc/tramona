import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import axios from "axios";

export const pmsRouter = createTRPCRouter({
  generateHostawayBearerToken: publicProcedure
    .input(z.object({ accountId: z.string(), apiKey: z.string() }))
    .mutation(async ({ input }) => {
      const { accountId, apiKey } = input;
      const data = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: accountId,
        client_secret: apiKey,
        scope: "general",
      }).toString();

      try {
        const response = await axios.post<{ access_token: string }>(
          "https://api.hostaway.com/v1/accessTokens",
          data,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cache-Control": "no-cache",
            },
          },
        );

        console.log(
          "Hostaway bearer token response:",
          response.data.access_token,
        );

        return { bearerToken: response.data.access_token };
      } catch (error) {
        console.error("Error generating Hostaway bearer token:", error);
        throw new Error("Failed to generate Hostaway bearer token");
      }
    }),

  getHostawayCalendar: publicProcedure
    .input(z.object({ bearerToken: z.string(), listingId: z.string() }))
    .mutation(async ({ input }) => {
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
        reservations: any[];
      }

      interface CalendarResponse {
        status: string;
        result: CalendarEntry[];
      }
      const { bearerToken, listingId } = input;

      try {
        const calendar: CalendarEntry[] = await axios
          .get<CalendarResponse>(
            `https://api.hostaway.com/v1/listings/${listingId}/calendar`,
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
              },
            },
          )
          .then((response) => {
            console.log("Hostaway calendar response:", response.data);
            return response.data.result;
          });

        return calendar.map((entry) => ({
          date: entry.date,
          status: entry.status,
        }));
      } catch (error) {
        console.error("Error fetching Hostaway calendar:", error);
        throw new Error("Failed to fetch Hostaway calendar");
      }
    }),
});
