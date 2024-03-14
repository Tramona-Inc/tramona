import { render } from "@react-email/render";
import nodemailler, { type TransportOptions } from "nodemailer";
import { env } from "@/env";
import { type ReactElement } from "react";
import { Twilio } from "twilio";

import sgMail from "@sendgrid/mail";
import { db } from "./db";
import { and, eq, inArray } from "drizzle-orm";
import { type User, groupInvites, groupMembers } from "./db/schema";

const transporter = nodemailler.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  // debug: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
} as TransportOptions);

const twilio = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export async function sendEmail({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: ReactElement;
}) {
  return await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: env.EMAIL_FROM,
        to,
        subject,
        html: render(content),
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      },
    );
  });
}

export async function addUserToGroups(user: Pick<User, "email" | "id">) {
  // get the groups they were invited to
  const groupIds = await db.query.groupInvites
    .findMany({
      where: eq(groupInvites.inviteeEmail, user.email),
      columns: { groupId: true },
    })
    .then((res) => res.map((invite) => invite.groupId));

  if (groupIds.length === 0) return;

  await db.transaction(async (tx) => {
    // add user to groups
    await tx
      .insert(groupMembers)
      .values(groupIds.map((groupId) => ({ groupId, userId: user.id })));

    // delete invites
    await tx
      .delete(groupInvites)
      .where(
        and(
          inArray(groupInvites.groupId, groupIds),
          eq(groupInvites.inviteeEmail, user.email),
        ),
      );
  });
}

export async function sendText({
  to,
  content,
}: {
  to: string;
  content: string;
}) {
  const response = await twilio.messages.create({
    body: content,
    from: env.TWILIO_FROM,
    to,
  });
  return response;
}
