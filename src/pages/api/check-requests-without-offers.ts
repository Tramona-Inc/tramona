// import { NextApiRequest, NextApiResponse } from 'next';
// import { checkRequestsWithoutOffers } from '@/server/server-utils';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       await checkRequestsWithoutOffers();
//       res.status(200).json({ message: 'Requests checked successfully' });
//     } catch (error) {
//       console.error('Error checking requests without offers:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }