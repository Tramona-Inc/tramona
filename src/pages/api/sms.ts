import { type NextApiRequest, type NextApiResponse } from "next";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";

import { db } from "@/server/db";
import { groupMembers, groups, requests, users } from "@/server/db/schema";
import { eq, desc, exists, and } from "drizzle-orm";

type TwilioRequestBody = {
  ToCountry: string;
  ToState: string;
  SmsMessageSid: string;
  NumMedia: string;
  ToCity: string;
  FromZip: string;
  SmsSid: string;
  FromState: string;
  SmsStatus: string;
  FromCity: string;
  Body: string;
  FromCountry: string;
  To: string;
  ToZip: string;
  NumSegments: string;
  MessageSid: string;
  AccountSid: string;
  From: string;
  ApiVersion: string;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as TwilioRequestBody;
  const phoneNumber = body.From;
  const userResponse = body.Body;

  const userId = await db.query.users
    .findFirst({
      where: eq(users.phoneNumber, phoneNumber),
      columns: { id: true },
    })
    .then((res) => res?.id);

  if (!userId) return res.status(500);

  const mostRecentRequest = await db
    .select({
      id: requests.id,
      hasApproved: requests.hasApproved,
      location: requests.location,
    })
    .from(groups)
    .innerJoin(requests, eq(groups.id, requests.madeByGroupId))
    .where(
      exists(
        db
          .select()
          .from(groupMembers)
          .where(
            and(
              eq(groupMembers.groupId, groups.id),
              eq(groupMembers.userId, userId),
              eq(groupMembers.isOwner, true),
            ),
          ),
      ),
    )
    .orderBy(desc(requests.confirmationSentAt))
    .then((res) => res[0]);

  if (!mostRecentRequest) return res.status(500);

  const twiml = new MessagingResponse();

  if (
    !mostRecentRequest.hasApproved &&
    userResponse.toLowerCase().trim() === "yes"
  ) {
    twiml.message(
      `Thank you for confirming your request to ${mostRecentRequest.location}! It has been sent to our network of hosts, and we will text you when you receive any new offers.`,
    );

    await db
      .update(requests)
      .set({
        hasApproved: true,
      })
      .where(eq(requests.id, mostRecentRequest.id));
  }

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(twiml.toString());
};
