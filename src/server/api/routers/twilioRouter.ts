import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Twilio } from "twilio";
import {
  type ServiceListInstanceCreateOptions,
  type ServiceInstance,
} from "twilio/lib/rest/verify/v2/service";
import { MailService } from "@sendgrid/mail";
import { env } from "@/env";
import { z } from "zod";
import { zodString } from "@/utils/zod-utils";

const twilio = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

const sgMail = new MailService();

sgMail.setApiKey(env.SENDGRID_API_KEY);

const verificationServiceConfig: ServiceListInstanceCreateOptions = {
  friendlyName: "Tramona",
  codeLength: 6,
};

let service: ServiceInstance; // singleton

const createService = async () => {
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

  sendOTP: protectedProcedure
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

  verifyOTP: protectedProcedure
    .input(z.object({ to: z.string(), code: z.string() }))
    .mutation(async ({ input }) => {
      await createService();

      const { to, code } = input;

      const { sid } = service;

      const verificationCheck = await twilio.verify.v2
        .services(sid)
        .verificationChecks.create({
          to,
          code,
        });

      return verificationCheck;
    }),
});
