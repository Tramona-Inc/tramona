import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/server/db';
import { properties } from '@/server/db/schema/tables/properties'; // Adjust this import path as necessary
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch all properties
      const allProperties = await db.select().from(properties);

      // Trigger calendar sync for each property
      for (const property of allProperties) {
        if (property.iCalUrl) {
          await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/calendar-sync`, {
            iCalUrl: property.iCalUrl,
            propertyId: property.id
          });
        }
      }

      res.status(200).json({ message: `Triggered calendar sync for ${allProperties.length} properties` });
    } catch (error) {
      console.error('Error triggering calendar sync:', error);
      res.status(500).json({ error: 'Failed to trigger calendar sync', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}