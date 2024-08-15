import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { sendSlackMessage } from "@/server/slack";
import { zodString } from "@/utils/zod-utils";
import { MailService } from "@sendgrid/mail";
import { TRPCError } from "@trpc/server";
import { Twilio } from "twilio";
import {
  type ServiceInstance,
  type ServiceListInstanceCreateOptions,
} from "twilio/lib/rest/verify/v2/service";
import { z } from "zod";

const twilio = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

const sgMail = new MailService();

sgMail.setApiKey(env.SENDGRID_API_KEY);

const verificationServiceConfig: ServiceListInstanceCreateOptions = {
  friendlyName: "Tramona",
  codeLength: 6,
};

let service: ServiceInstance; // singleton

const createService = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (service !== undefined) return;

  service = await twilio.verify.v2.services.create(verificationServiceConfig);
};

export const twilioRouter = createTRPCRouter({
  sendSMS: protectedProcedure
    .input(
      z.object({
        msg: z.string(),
        to: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { msg, to } = input;

      const response = await twilio.messages.create({
        body: msg,
        from: env.TWILIO_FROM,
        to,
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

  sendEmail: protectedProcedure
    .input(
      z.object({
        to: zodString().email(),
        subject: z.string(),
        text: z.string(),
        html: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { to, subject, text, html } = input;

      const response = await sgMail.send({
        to,
        from: env.SENDGRID_FROM,
        subject,
        text,
        html,
      });

      return response;
    }),

  sendOTP: publicProcedure
    .input(z.object({ to: z.string() }))
    .mutation(async ({ input }) => {
      await createService();

      const { to } = input;

      const { sid } = service;

      const verification = await twilio.verify.v2
        .services(sid)
        .verifications.create({
          to,
          channel: "sms",
        });

      return verification;
    }),

  sendSlack: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      const { message } = input;

      await sendSlackMessage({ channel: "tramona-bot", text: message });
    }),

  verifyOTP: publicProcedure
    .input(z.object({ to: z.string(), code: z.string() }))
    .mutation(async ({ input }) => {
      await createService();

      const { to, code } = input;

      const { sid } = service;

      try {
        const verificationCheck = await twilio.verify.v2
          .services(sid)
          .verificationChecks.create({
            to,
            code,
          });

        return verificationCheck;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exists",
        });
      }
    }),
});
