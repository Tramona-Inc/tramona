import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getPropertyCalendar } from "@/server/server-utils";
import { TRPCError } from "@trpc/server";
import {
  getASingleCustomerChanel,
  getCustomersChannelByCustomerId,
  getHospitableReviewsByChanelId,
} from "@/utils/webhook-functions/hospitable-utils";

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

  getHospitableCustomer: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });
    if (!user) {
      throw new Error("User not found");
    }
    const { id } = user;

    try {
      const response = await axios.get(
        `https://connect.hospitable.com/api/v1/customers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
          },
        },
      );

      type HospitableCustomerResponse = {
        data: AxiosResponse;
      };

      return response.data as HospitableCustomerResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
      }
    }
  }),

  deleteHospitableCustomer: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });
    if (!user) {
      throw new Error("User not found");
    }
    const { id } = user;

    try {
      await axios.delete(
        `https://connect.hospitable.com/api/v1/customers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
          },
        },
      );
    } catch (error) {
      console.error("Error deleting Hospitable customer:", error);
      throw new Error("Failed to delete Hospitable customer");
    }
  }),

  createHospitableCustomer: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });

    // Check if a user was found
    if (!user) {
      throw new Error("User not found");
    }

    // Destructure the necessary properties from the user object
    const { id, firstName, lastName, email, phoneNumber } = user;
    const name = `${firstName} ${lastName}`;

    if (!id || !name || !email || !phoneNumber) {
      throw new Error("User is missing required information");
    }
    await axios.post(
      "https://connect.hospitable.com/api/v1/customers",
      {
        id,
        name,
        email,
        phone: phoneNumber,
        timezone: "UTC",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
        },
      },
    );
    try {
      type HospitableAuthCodeResponse = {
        data: {
          expires_at: Date;
          return_url: string;
        };
      };

      const authCodeResponse = await axios.post<HospitableAuthCodeResponse>(
        "https://connect.hospitable.com/api/v1/auth-codes",
        {
          customer_id: id,
          redirect_url:
            process.env.NEXTAUTH_URL +
            "/load-airbnb-properties/checking-hospitable-status",
          // redirect_url: "https://179c-2601-600-8e81-3180-4171-fe-a3a4-da1d.ngrok-free.app/host",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
          },
        },
      );

      // try {
      //   await axios.delete(
      //     `https://connect.hospitable.com/api/v1/customers/${id}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
      //       },
      //     },
      //   );
      // } catch (error) {
      //   console.error("Error deleting Hospitable customer:", error);
      //   throw new Error("Failed to delete Hospitable customer");
      // }

      return authCodeResponse.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        if (
          error.message &&
          error.message === "Request failed with status code 422"
        ) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "User info is not valid",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Please contact support",
          });
        }
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Please contact support",
        });
      }
    }
  }),

  getHospitableCalendar: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ input }) => {
      const { propertyId } = input;
      console.log("propertyId", propertyId);
      return await getPropertyCalendar(propertyId);
    }),

  resetHospitableCustomer: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.query.users
      .findFirst({
        columns: { id: true },
        where: eq(users.id, ctx.user.id),
      })
      .then(async (user) => {
        if (!user) {
          throw new Error("User not found");
        }
        const { id } = user;
        try {
          await axios.delete(
            `https://connect.hospitable.com/api/v1/customers/${id}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
              },
            },
          );
          console.log("Hospitable customer reset successfully");
        } catch (error) {
          console.error("Error resetting Hospitable customer:", error);
          throw new Error("Failed to reset Hospitable customer");
        }
      });
  }),

  getHospitableChannelByHospitableCustomerId: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input }) => {
      console.log(input.customerId);
      const hospitableChannel = await getCustomersChannelByCustomerId(
        input.customerId,
      );
      return hospitableChannel;
    }),

  getHospitableReviewsByHospitableCustomerId: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input }) => {
      console.log(input.customerId);
      try {
        const hospitableChannel = await getCustomersChannelByCustomerId(
          input.customerId,
        );
        console.log(hospitableChannel.data[0]?.id);
        if (hospitableChannel.data[0]?.id) {
          const returnedChannel = await getASingleCustomerChanel({
            channelId: hospitableChannel.data[0].id,
            customerId: input.customerId,
          });

          console.log(returnedChannel);

          const reviews = await getHospitableReviewsByChanelId(
            "97cd9f01-aa96-4786-acd1-63cce241998e",
          );
          console.log(reviews);
          return reviews;
        }
      } catch {
        console.error("error");
        return;
      }
    }),
});
