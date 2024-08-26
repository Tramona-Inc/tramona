import { sendEmail } from "@/server/server-utils";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { and, gte, lte } from "drizzle-orm";
import HowToUseTramonaEmail from "packages/transactional/emails/HowToUseTramonaEmail";
import WhyWeBuiltThisEmail from "packages/transactional/emails/WhyWeBuiltThisEmail";
import CaseStudyEmail from "packages/transactional/emails/CaseStudyEmail";
import HaveAnyQuestionsEmail from "packages/transactional/emails/HaveAnyQuestionsEmail";

//emails

export default async function scheduledEmailPostOnboard() {
  // you can send emails by calling the findUsersCreatedHoursAgo or findUsersCreatedDaysAgo to find the approiate users to send emails to

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
      subject: "Real Stories: Travelers Saving Money, Hosts Lowering Vacancies",
      content: CaseStudyEmail({
        name: user.firstName ?? user.name ?? "Traveler",
      }),
    });
  }

  // day 7 checking in
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
  async function findUsersCreatedHoursAgo(hours: number) {
    // Calculate the time that is `hours` ago from the current time
    const targetTime = new Date(Date.now() - hours * 60 * 60 * 1000).toString();

    // Query users who were created after the calculated `targetTime`
    const curUsers = await db.query.users.findMany({
      where: gte(users.createdAt, targetTime), // Users created at or after `targetTime`
    });

    return curUsers;
  }

  async function findUsersCreatedDaysAgo(days: number) {
    // Get the start of the day `days` ago
    const startOfDay = new Date();
    startOfDay.setUTCDate(startOfDay.getUTCDate() - days);
    startOfDay.setUTCHours(0, 0, 0, 0); // Set to the start of the day (00:00:00)

    // Get the end of the day `days` ago
    const endOfDay = new Date();
    endOfDay.setUTCDate(endOfDay.getUTCDate() - days);
    endOfDay.setUTCHours(23, 59, 59, 999); // Set to the end of the day (23:59:59)

    // Convert dates to strings since `users.createdAt` is stored as a string
    const startTime = startOfDay.toISOString().slice(0, 19).replace("T", " ");
    const endTime = endOfDay.toISOString().slice(0, 19).replace("T", " ");

    // Query users who were created within the calculated range
    const curUsers = await db.query.users.findMany({
      where: and(
        lte(users.createdAt, endTime),
        gte(users.createdAt, startTime),
      ),
    });

    return curUsers;
  }
}
