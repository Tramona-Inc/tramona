import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/server/db';
import { offers } from '@/server/db/schema';
import { lt, isNotNull, and, isNull, sql } from 'drizzle-orm';
import { add, subHours } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const now = new Date();
    const fortyEightHoursAgo = subHours(now, 48);

    // 1. Update offers that are due to be marked as unclaimed
    const markUnclaimedResult = await db
      .update(offers)
      .set({ 
        unclaimedOffer: true,
        updateQueueTime: null,
        unclaimedAt: now
      })
      .where(
        and(
          isNotNull(offers.updateQueueTime),
          lt(offers.updateQueueTime, now)
        )
      )
      .returning({ updatedId: offers.id });

    // 2. Remove offers from the queue that have been unclaimed for 48 hours
    const removeFromQueueResult = await db
      .update(offers)
      .set({ 
        unclaimedOffer: false,
        unclaimedAt: null
      })
      .where(
        and(
          isNotNull(offers.unclaimedAt),
          lt(offers.unclaimedAt, fortyEightHoursAgo)
        )
      )
      .returning({ updatedId: offers.id });

    res.status(200).json({ 
      message: `Processed offers queue`,
      markedUnclaimed: markUnclaimedResult.length,
      removedFromQueue: removeFromQueueResult.length
    });
  } catch (error) {
    console.error('Error processing offer update queue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}