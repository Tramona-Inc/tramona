import { sendEmail } from "@/server/server-utils";
import { db } from "@/server/db";
import { users, type User } from "@/server/db/schema";
import { and, gte, lte } from "drizzle-orm";
import HowToUseTramonaEmail from "packages/transactional/emails/HowToUseTramonaEmail";
import WhyWeBuiltThisEmail from "packages/transactional/emails/WhyWeBuiltThisEmail";
import CaseStudyEmail from "packages/transactional/emails/CaseStudyEmail";
import HaveAnyQuestionsEmail from "packages/transactional/emails/HaveAnyQuestionsEmail";

// Core function to send emails
export async function scheduledEmailPostOnboard() {
  try {
    // 1 Hour Later: How to Use Tramona
    const usersOneHourAgo = await findUsersCreatedHoursAgo(1);
    for (const user of usersOneHourAgo) {
      await sendEmail({
        to: user.email,
        subject: "How to Make the Most of Tramona",
        content: HowToUseTramonaEmail(),
      });
    }

    // Day 2: Why We Built This
    const usersTwoDaysAgo = await findUsersCreatedDaysAgo(2);
    for (const user of usersTwoDaysAgo) {
      await sendEmail({
        to: user.email,
        subject: "The Mission Behind Tramona",
        content: WhyWeBuiltThisEmail(),
      });
    }

    // Day 4: Case Study
    const usersFourDaysAgo = await findUsersCreatedDaysAgo(4);
    for (const user of usersFourDaysAgo) {
      await sendEmail({
        to: user.email,
        subject:
          "Real Stories: Travelers Saving Money, Hosts Lowering Vacancies",
        content: CaseStudyEmail({
          name: user.firstName ?? user.name ?? "Traveler",
        }),
      });
    }

    // Day 7: Any Questions
    const usersSevenDaysAgo = await findUsersCreatedDaysAgo(7);
    for (const user of usersSevenDaysAgo) {
      await sendEmail({
        to: user.email,
        subject: "Any Questions? We're Here to Help!",
        content: HaveAnyQuestionsEmail({
          name: user.firstName ?? user.name ?? "Traveler",
        }),
      });
    }
  } catch (error) {
    console.error("Error in scheduledEmailPostOnboard:", error);
  }
}

// Utility function to find users created `hours` ago
async function findUsersCreatedHoursAgo(hours: number): Promise<User[]> {
  const targetTime = new Date(Date.now() - hours * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return await db.query.users.findMany({
    where: gte(users.createdAt, targetTime),
  });
}

// Utility function to find users created `days` ago
async function findUsersCreatedDaysAgo(days: number): Promise<User[]> {
  const startOfDay = new Date();
  startOfDay.setUTCDate(startOfDay.getUTCDate() - days);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setUTCDate(endOfDay.getUTCDate() - days);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const startTime = startOfDay.toISOString().slice(0, 19).replace("T", " ");
  const endTime = endOfDay.toISOString().slice(0, 19).replace("T", " ");

  return await db.query.users.findMany({
    where: and(gte(users.createdAt, startTime), lte(users.createdAt, endTime)),
  });
}

// API handler function to trigger the email scheduling
type Request = {
  body: Record<string, unknown>;
  query: Record<string, string | undefined>;
  // 添加其他需要的字段
};

type Response = {
  status: (statusCode: number) => Response;
  json: (body: Record<string, unknown>) => void;
  // 添加其他需要的字段
};

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await scheduledEmailPostOnboard();
    res.status(200).json({ message: "Emails scheduled successfully!" });
  } catch (error) {
    console.error("Error scheduling emails:", error);
    res.status(500).json({ error: "Failed to schedule emails" });
  }
}
