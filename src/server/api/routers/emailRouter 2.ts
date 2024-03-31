import { SupportEmail } from "@/components/email-templates/SupportEmail";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sendEmail } from "@/server/server-utils";
import { zodEmail, zodString } from "@/utils/zod-utils";
import { z } from "zod";

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
});
