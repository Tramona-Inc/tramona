import { type NextApiRequest, type NextApiResponse } from 'next';
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { propertyId } = req.query;

  console.log("propertyId", propertyId);
  if (!propertyId || Array.isArray(propertyId)) {
    return res.status(400).json({ error: 'Invalid propertyId' });
  }

  try {
    const ctx = await createTRPCContext({ req, res });
    const caller = appRouter.createCaller(ctx);

    const icsContent = await caller.calendar.getICSContent({ propertyId: parseInt(propertyId) });

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="tramona_calendar_${propertyId}.ics"`);
    res.status(200).send(icsContent);
  } catch (error) {
    console.error('Error generating ICS content:', error);
    res.status(500).json({ error: 'Failed to generate ICS content' });
  }
}