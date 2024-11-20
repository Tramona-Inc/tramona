import { db } from "@/server/db";
import { requestsToBook } from "@/server/db/schema";
import { eq, lt, and } from "drizzle-orm";
import { sendSlackMessage } from "@/server/slack";

export default async function handler() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    await db
      .update(requestsToBook)
      .set({
        status: "Expired",
      })
      .where(
        and(
          lt(requestsToBook.createdAt, twentyFourHoursAgo),
          eq(requestsToBook.status, "Pending"),
        ),
      );
  } catch (error) {
    await sendSlackMessage({
      isProductionOnly: true,
      channel: "tramona-bot",
      text: [
        `Request To book set to expire cron job error, please check console`,
      ].join("\n"),
    });
  }
}
