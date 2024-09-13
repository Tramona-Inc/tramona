import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeAirbnbListings } from '@/server/external-listings-scraping/airbnb';
import { getNumNights } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('API route: Starting Airbnb scraping process');

      const checkIn = new Date("2024-10-20T19:56:53.132Z");
      const checkOut = new Date("2024-10-25T19:56:53.132Z");

      console.log('Number of nights:', getNumNights(checkIn, checkOut));

      const listings = await scrapeAirbnbListings({
        request: {
          location: 'Los Angeles, CA',
          numGuests: 2,
          checkIn,
          checkOut,
          maxTotalPrice: 2000, // $400 per night for 5 nights
        },
        limit: 10, // Limit to 10 listings for testing
      });

      console.log('API route: Airbnb scraping process completed');
      res.status(200).json({ 
        message: `Successfully scraped ${listings.length} Airbnb listings.`,
        listings: listings.map(listing => ({
          id: listing.property.originalListingId,
          name: listing.property.name,
          nightlyPrice: listing.nightlyPrice,
          originalNightlyPrice: listing.property.originalNightlyPrice,
          totalPrice: listing.nightlyPrice * 5, // Assuming 5 nights
          originalTotalPrice: listing.property.originalNightlyPrice * 5,
          discountPercentage: ((listing.property.originalNightlyPrice - listing.nightlyPrice) / listing.property.originalNightlyPrice * 100).toFixed(2) + '%'
        }))
      });
    } catch (error) {
      console.error('API route: Error during Airbnb scraping process:', error);
      res.status(500).json({ error: 'An error occurred while scraping Airbnb.', details: error instanceof Error ? error.message : String(error) });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}