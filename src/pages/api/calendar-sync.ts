import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import ical, { VEvent } from 'node-ical';
import { db } from '@/server/db';
import { reservedDates } from '@/server/db/schema/tables/reservedDates';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Received POST request to sync calendar');
    try {
      const { iCalUrl, propertyId } = req.body;
      console.log('iCal URL:', iCalUrl);
      console.log('Property ID:', propertyId);
      
      if (!propertyId) {
        throw new Error('Property ID is required');
      }

      // Fetch the iCal data
      console.log('Fetching iCal data...');
      const response = await axios.get(iCalUrl);
      const icsData = response.data;
      console.log('iCal data fetched successfully');

      // Parse the iCal data
      console.log('Parsing iCal data...');
      const parsedData = await ical.async.parseICS(icsData);
      console.log('Number of items in parsed data:', Object.keys(parsedData).length);

      // Process the data
      console.log('Processing events...');
      const events = Object.values(parsedData).filter((event): event is VEvent => 
        event.type === 'VEVENT' && 'start' in event && 'end' in event
      );
      console.log('Number of VEVENT items:', events.length);

      // Delete existing reserved dates for this property
      await db.delete(reservedDates).where(eq(reservedDates.propertyId, propertyId));

      // Insert new reserved dates
      for (const event of events) {
        if (event.start && event.end) {
          await db.insert(reservedDates).values({
            propertyId: propertyId,
            checkIn: new Date(event.start),
            checkOut: new Date(event.end),
          });
        }
      }

      console.log(`Synced ${events.length} events for property ${propertyId}`);
      res.status(200).json({ message: `Synced ${events.length} events` });
    } catch (error) {
      console.error('Error syncing calendar:', error);
      res.status(500).json({ error: 'Failed to sync calendar', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    console.log(`Received unsupported ${req.method} request`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}