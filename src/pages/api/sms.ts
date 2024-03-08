import { NextApiRequest, NextApiResponse } from "next";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";
import { buffer } from "micro";
import { env } from "@/env";
import { api } from "@/utils/api";

import { db } from "@/server/db";
import { offers, referralCodes, referralEarnings, requests, users } from "@/server/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getServerAuthSession } from "@/server/auth";

type TwilioRequestBody = {
  ToCountry: string,
  ToState: string,
  SmsMessageSid: string,
  NumMedia: string,
  ToCity: string,
  FromZip: string,
  SmsSid: string,
  FromState: string,
  SmsStatus: string,
  FromCity: string,
  Body: string,
  FromCountry: string,
  To: string,
  ToZip: string,
  NumSegments: string,
  MessageSid: string,
  AccountSid: string,
  From: string,
  ApiVersion: string,
}

// ! Necessary for stripe
// export const config = {
//   api: string,
//     bodyParser: false,
//   },
// };

// function temp(userId: string) {
//   return db.query.requests.findFirst({
//     where: eq(requests.)
//   })
// }

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) =>  {

  const body = req.body as TwilioRequestBody;
  const phoneNumber = body.From;
  const userResponse = body.Body;

  const userId = await db.query.users.findFirst({
    where: eq(users.phoneNumber, phoneNumber),
    columns:{id: true}
  }).then(res => res?.id)

  if (!userId) return res.status(500);

  const mostRecentRequest = await db.query.requests
  .findFirst({
    where: eq(requests.userId, userId),
    orderBy: desc(requests.confirmationSentAt),
    columns: {hasApproved: true, id: true, location: true}
  })

  if (!mostRecentRequest) return res.status(500);

  const twiml = new MessagingResponse();

  console.log(mostRecentRequest);
  console.log(userResponse);


  if (!mostRecentRequest.hasApproved && userResponse.toLowerCase().trim() === 'yes') {
    twiml.message(`Thank you for confirming your request to ${mostRecentRequest.location}`);

    await db
    .update(requests)
    .set({
      hasApproved: true,
    })
    .where(eq(requests.id, mostRecentRequest.id))
  }

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(twiml.toString());
}