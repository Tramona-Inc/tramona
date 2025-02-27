import SupportEmail from "packages/transactional/emails/SupportEmail";
import ReferAHostEmail from "packages/transactional/emails/ReferAHostEmail";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { sendEmail } from "@/server/server-utils";
import { zodEmail, zodString } from "@/utils/zod-utils";
import { z } from "zod";
import { referralCodes, users } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import WelcomeEmail from "packages/transactional/emails/WelcomeEmail";
import WelcomeHostEmail from "packages/transactional/emails/WelcomeHostsEmail";
export const emailRouter = createTRPCRouter({
  sendSupportEmail: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: zodEmail(),
        message: zodString({ maxLen: 300 }),
      }),
    )
    .mutation(async ({ input }) => {
      await sendEmail({
        to: "info@tramona.com",
        subject: "New Support/Bug/Request Feature | Tramona",
        content: SupportEmail({
          email: input.email,
          name: input.name,
          message: input.message,
        }),
      });
    }),

  sendListOfHostReferralEmails: protectedProcedure
    .input(z.object({ emailList: z.string().email().array() }))
    .mutation(async ({ ctx, input }) => {
      const referrer = await db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });
      const userFirstAndLastName =
        referrer!.firstName + " " + referrer!.lastName;

      const referralCode = await db.query.referralCodes.findFirst({
        where: eq(referralCodes.ownerId, ctx.user.id),
      });

      console.log(referralCode);

      for (const email of input.emailList) {
        await sendEmail({
          to: email,
          subject: `${userFirstAndLastName} invited you to join Tramona`,
          content: ReferAHostEmail({
            referrerFirstAndLastName: userFirstAndLastName,
            referralCode: referralCode!.referralCode,
          }),
        });
      }
    }),

  sendWelcomeEmail: protectedProcedure.mutation(async ({ ctx }) => {
    const referralCode = await db.query.referralCodes.findFirst({
      where: eq(referralCodes.ownerId, ctx.user.id),
    });
    await sendEmail({
      to: ctx.user.email,
      subject: "Welcome to Tramona",
      content: WelcomeEmail({
        name: ctx.user.firstName ?? ctx.user.name ?? "Guest",
        referralCode: referralCode!.referralCode,
      }),
    });
  }),

  sendWelcomeHostEmail: protectedProcedure.mutation(async ({ ctx }) => {
    const referralCode = await db.query.referralCodes.findFirst({
      where: eq(referralCodes.ownerId, ctx.user.id),
    });

    await sendEmail({
      to: ctx.user.email,
      subject: "Welcome to Tramona",
      content: WelcomeHostEmail({
        name: ctx.user.firstName ?? ctx.user.name ?? "Guest",
        referralCode: referralCode!.referralCode,
      }),
    });
  }),
});
