import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "@/env";

import { db } from "@/server/db";
import {
  requests,
  users,
  messages,
  conversations,
  conversationParticipants,
} from "@/server/db/schema";
import { eq, and, isNotNull, desc, sql } from "drizzle-orm";

import { sendText } from "@/server/server-utils";
import { alias } from "drizzle-orm/pg-core";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const latestMessageFromConversation = await db.execute(sql`
  WITH LatestMessages AS (
    SELECT
      *,
      ROW_NUMBER() OVER (PARTITION BY conversation_id ORDER BY created_at DESC) AS message_rank
    FROM
      ${messages}
  )
  , LatestUnreadMessages AS (
    SELECT
      conversation_id, user_id
    FROM
      LatestMessages
    WHERE
      message_rank = 1
      AND "read" = false
  )
  , UsersWithUnreadMessages AS (
    SELECT
      cp.user_id
    FROM
      LatestUnreadMessages lum
    JOIN ${conversationParticipants} cp ON cp.conversation_id = lum.conversation_id
    WHERE
      cp.user_id != lum.user_id
  )
  SELECT
    u.phone_number
  FROM
    ${users} u
  JOIN
    UsersWithUnreadMessages uwum ON u.id = uwum.user_id;

  `);

  console.log(latestMessageFromConversation);
};
