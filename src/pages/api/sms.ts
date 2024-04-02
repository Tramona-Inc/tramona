import { type NextApiRequest, type NextApiResponse } from "next";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";

import { db } from "@/server/db";
import { requestGroups, requests, users } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

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

  console.log("getting user...");

  const userId = await db.query.users
    .findFirst({
      where: eq(users.phoneNumber, phoneNumber),
      columns: { id: true },
    })
    .then((res) => res?.id);

  if (!userId)
    return res
      .status(500)
      .send(`User for phone number ${phoneNumber} not found`);

  console.log("getting most recent request group...");

  const mostRecentRequestGroup = await db
    .select({ hasApproved: requestGroups.hasApproved, id: requestGroups.id })
    .from(requestGroups)
    .where(eq(requestGroups.createdByUserId, userId))
    .orderBy(desc(requestGroups.confirmationSentAt))
    .limit(1)
    .then((res) => res[0]);

  if (!mostRecentRequestGroup)
    return res.status(500).send("request group not found for request");

  console.log("getting requests in group...");

  const requestsInGroup = await db.query.requests.findMany({
    where: eq(requests.requestGroupId, mostRecentRequestGroup.id),
    columns: { location: true },
  });

  console.log(
    `found ${requestsInGroup.length} requests in group #${mostRecentRequestGroup.id}`,
  );

  const twiml = new MessagingResponse();

  if (
    !mostRecentRequestGroup.hasApproved &&
    userResponse.toLowerCase().trim() === "yes"
  ) {
    twiml.message(
      `Thank you for confirming ${requestsInGroup.length === 1 ? `your request to ${requestsInGroup[0]!.location}` : `your trip with ${requestsInGroup.length} requests`}! ${requestsInGroup.length === 1 ? "It has" : "They have"} been sent to our network of hosts. We will text you when you receive offers.`,
    );

    await db
      .update(requestGroups)
      .set({ hasApproved: true })
      .where(eq(requestGroups.id, mostRecentRequestGroup.id));
  }

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(twiml.toString());
};
