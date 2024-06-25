/* eslint-disable no-console */
import { env } from "@/env";
import {
  createConversationWithAdmin,
  fetchConversationWithAdmin,
} from "@/server/api/routers/messagesRouter";
import { stripe } from "@/server/api/routers/stripeRouter";
import { db } from "@/server/db";
import {
  offers,
  referralCodes,
  referralEarnings,
  requests,
  users,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { buffer } from "micro";
import { type NextApiRequest, type NextApiResponse } from "next";

// ! Necessary for stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    console.log('got webhook');
    console.log('req.body', req.body);
    // let event;
    // event = req.body;
    // switch (event.type) {
    //   case "reservation.created":
    //     console.log("reservation created");
    //     break;
    //   case "reservation.updated":
    //     console.log("reservation updated");
    //     break;
    //   default:
    // }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}