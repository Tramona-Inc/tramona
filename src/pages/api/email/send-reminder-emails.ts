import { db } from "@/server/db";
import { trips } from "@/server/db/schema";
import { users } from "@/server/db/schema";
import { addDays } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";
import { sendEmail } from "@/server/server-utils";
import ThreeDaysBeforeEmail from "../../../../packages/transactional/emails/ThreeDaysBeforeEmail";
import OneWeekBeforeEmail from "../../../../packages/transactional/emails/OneWeekBeforeEmail";
import TwoWeeksBeforeEmail from "../../../../packages/transactional/emails/TwoWeeksBeforeEmail";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await runDailyCheck();
        res.status(200).json({ message: 'Reminder for check-in emails sent successfully' });
    } catch (error) {
        console.error('Error sending reminder emails:', error);
        res.status(500).json({ error: 'Failed to send reminder emails' });
    }
}

const runDailyCheck = async () => {
    try {
        const today = new Date();

        const tripsIn14Days = await db.query.trips.findMany({
            where: and(
                gte(trips.checkIn, addDays(today, 14)),
                lte(trips.checkIn, addDays(today, 15))
            ),
        });

        const tripsIn7Days = await db.query.trips.findMany({
            where: and(
                gte(trips.checkIn, addDays(today, 7)),
                lte(trips.checkIn, addDays(today, 8))
            ),
        });

        const tripsIn3Day = await db.query.trips.findMany({
            where: and(
                gte(trips.checkIn, addDays(today, 3)),
                lte(trips.checkIn, addDays(today, 4))
            ),
        });

        const processTrips = async (trips, reminderType) => {
            for (const trip of trips) {
                const relatedUser = await db.query.users.findFirst({
                    where: eq(users.id, trip.groupId),
                });

                if (relatedUser && relatedUser.email) {
                    let subject;
                    let content;

                    if (reminderType === 14) {
                        subject = 'Check-in Reminder (2 Weeks)';
                        content = TwoWeeksBeforeEmail;
                    } else if (reminderType === 7) {
                        subject = 'Check-in Reminder (1 Week)';
                        content = OneWeekBeforeEmail;
                    } else if (reminderType === 3) {
                        subject = 'Check-in Reminder (3 Days)';
                        content = ThreeDaysBeforeEmail;
                    }

                    await sendEmail({
                        to: relatedUser.email,
                        subject: subject,
                        content: content,
                    });
                } else {
                    console.error(`No user found for groupId ${trip.groupId}`);
                }
            }
        };

        await processTrips(tripsIn14Days, 14);
        await processTrips(tripsIn7Days, 7);
        await processTrips(tripsIn3Day, 3);

    } catch (error) {
        console.error(`Error running daily check: ${error}`);
    }
};

runDailyCheck();
