import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { phoneNumberOTPs } from "@/server/db/schema/tables/auth/phoneNumberOTPs";
import { sendText, sendWhatsApp } from "@/server/server-utils";
import { sendSlackMessage } from "@/server/slack";
import { generatePhoneNumberOTP } from "@/utils/utils";
import { TRPCError } from "@trpc/server";
import { subMinutes } from "date-fns";
import { eq } from "drizzle-orm";
import { Twilio } from "twilio";
import { type ServiceInstance } from "twilio/lib/rest/verify/v2/service";
import { z } from "zod";

const twilio = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

// let service: ServiceInstance; // singleton
const service = twilio.verify.v2.services(env.TWILIO_VERIFY_SERVICE_SID);
// const createService = async () => {
//   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//   if (service !== undefined) return;

// service = await twilio.verify.v2.services.create({
//   friendlyName: "Tramona",
//   codeLength: 6,
//   });
// };

export const twilioRouter = createTRPCRouter({
  sendSMS: protectedProcedure
    .input(
      z.object({
        msg: z.string(),
        to: z.string(),
        sendAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const isProduction = process.env.NODE_ENV === "production";
      const isProductionOnly = true;
      if (isProductionOnly && !isProduction) return;

      const { msg, to, sendAt } = input;

      const response = await twilio.messages.create({
        body: msg,
        from: env.TWILIO_FROM,
        to,
        sendAt, // ISO 8601
      });

      return response;
    }),

  // sendWhatsApp: protectedProcedure
  // .input(
  //   z.object({
  //     msg: z.string(),
  //     to: z.string(),
  //   }),
  // )
  // .mutation(async ({ input }) => {
  //   const { msg, to } = input;

  //   const response = await twilio.messages.create({
  //     from: `whatsapp:${env.TWILIO_FROM}`,
  //     body: msg,
  //     to: `whatsapp:${to}`
  //   });

  //   return response;
  // }),

  sendWhatsApp: protectedProcedure
    .input(
      z.object({
        templateId: z.string(),
        to: z.string(),
        propertyName: z.string().optional(),
        propertyAddress: z.string().optional(),
        url: z.string().optional(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
        numRequests: z.number().optional(),
        cost: z.string().optional(),
        price: z.number().optional(),
        dates: z.string().optional(),
        name: z.string().optional(),
        counterCost: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        templateId,
        to,
        propertyName,
        propertyAddress,
        url,
        checkIn,
        checkOut,
        numRequests,
        cost,
        price,
        dates,
        name,
        counterCost,
      } = input;
      let contentVariables: Record<number, string | undefined> = {};

      // Set content variables based on template ID
      if (
        templateId === "HXd5256ff10d6debdf70a13d70504d39d5" ||
        templateId === "HXb293923af34665e7eefc81be0579e5db"
      ) {
        contentVariables = {
          1: propertyName,
          2: propertyAddress,
          3: checkIn?.toISOString(),
          4: checkOut?.toISOString(), //is this a problem?
        };

        if (templateId === "HXd5256ff10d6debdf70a13d70504d39d5") {
          contentVariables[5] = url;
        }
      } else if (templateId === "HX82b075be3d74f02e45957a453fd48cef") {
        if (numRequests) {
          contentVariables = {
            1:
              numRequests > 1
                ? `${numRequests} unconfirmed requests`
                : `${numRequests} unconfirmed request`,
            2:
              numRequests > 1
                ? `${numRequests} requests`
                : `${numRequests} request`,
            3: url,
          };
        }
      } else if (
        templateId === "HX28c41122cfa312e326a9b5fc5e7bc255" ||
        templateId === "HX74ffb496915d8e4ef39b41e624ca605e" ||
        templateId === "HXa9200c7721c008928f1a932678727214" ||
        templateId === "HXd7d55b299c2170bd5af4cef76e058d78"
      ) {
        contentVariables = {
          1: cost,
          2: name,
          3: dates,
        };
        if (templateId === "HXa9200c7721c008928f1a932678727214") {
          contentVariables[4] = counterCost;
        }
      } else if (templateId === "HX1650cf0e293142a6db2b458167025222") {
        contentVariables = {
          1: price?.toString(),
          2: name,
          3: dates,
        };
      }

      // Create Twilio message payload
      const twilioMessagePayload = {
        contentSid: templateId,
        from: `whatsapp:${env.TWILIO_FROM}`,
        messagingServiceSid: "MG7f313e1063abc277e6503fd9c9f3ef07",
        to: `whatsapp:${to}`,
        contentVariables: JSON.stringify(contentVariables),
      };

      // Send the Twilio message
      const response = await twilio.messages.create(twilioMessagePayload);
      return response;
    }),

  sendOTP: publicProcedure
    .input(z.object({ phoneNumber: z.string() }))
    .mutation(async ({ input }) => {
      // const code = generatePhoneNumberOTP();
      const channel = input.phoneNumber.startsWith("+1") ? "sms" : "whatsapp";

      const verification = await service.verifications.create({
        to: channel === "whatsapp" ? `whatsapp:${input.phoneNumber}` : input.phoneNumber,
        channel: channel
      });

      await db.insert(phoneNumberOTPs).values({
        phoneNumber: input.phoneNumber,
        verificationSid: verification.sid,
      });
    }),

  sendSlack: protectedProcedure
    .input(z.object({ message: z.string(), isProductionOnly: z.boolean() }))
    .mutation(async ({ input }) => {
      const { message } = input;

      await sendSlackMessage({
        channel: "tramona-bot",
        text: message,
        isProductionOnly: input.isProductionOnly,
      });
    }),

  verifyOTP: publicProcedure
    .input(z.object({ phoneNumber: z.string(), code: z.string() }))
    .mutation(async ({ input }) => {
      const { phoneNumber, code } = input;

      const otpRecord = await db.query.phoneNumberOTPs.findFirst({
        where: eq(phoneNumberOTPs.phoneNumber, phoneNumber),
      });

      if (!otpRecord) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `No OTPs found for phone number ${phoneNumber}`,
        });
      }

      let check;
      try {
        check = await service.verificationChecks
          .create({
            verificationSid: otpRecord.verificationSid,
            code: code
          });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          message: `Error verifying OTP for phone number ${phoneNumber}, ${error}`,
        });
      }

      if (check.status === 'approved') {
        await db
          .delete(phoneNumberOTPs)
          .where(eq(phoneNumberOTPs.id, otpRecord.id));
      }

      return { status: check.status };
    }),
});
