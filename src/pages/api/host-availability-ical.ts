// pages/api/reserved-dates.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/server/db';
import { reservedDates } from '@/server/db/schema/tables/reservedDates';
import { eq } from 'drizzle-orm';

export async function getReservedDates(propertyId: number) {
  try {
    const dates = await db
      .select({
        checkIn: reservedDates.checkIn,
        checkOut: reservedDates.checkOut,
      })
      .from(reservedDates)
      .where(eq(reservedDates.propertyId, propertyId));

    return dates.map(date => ({
      start: date.checkIn.toISOString(),
      end: date.checkOut.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching reserved dates:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { propertyId } = req.query;
      
      if (!propertyId || typeof propertyId !== 'string') {
        return res.status(400).json({ error: 'Property ID is required' });
      }

      const propertyIdNumber = parseInt(propertyId, 10);

      if (isNaN(propertyIdNumber)) {
        return res.status(400).json({ error: 'Invalid Property ID' });
      }

      const reservedDates = await getReservedDates(propertyIdNumber);
      res.status(200).json(reservedDates);
    } catch (error) {
      console.error('Error fetching reserved dates:', error);
      res.status(500).json({ error: 'Failed to fetch reserved dates' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}