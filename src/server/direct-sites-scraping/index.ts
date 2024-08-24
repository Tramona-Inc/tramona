import { NewProperty, Review } from "../db/schema";
import { arizonaScraper } from "./integrity-arizona";
import { db } from "../db";
import { properties } from "../db/schema";
import { eq } from 'drizzle-orm';
import { PropertyType, ALL_PROPERTY_TYPES, ListingSiteName } from "@/server/db/schema/common";

export type DirectSiteScraper = (options: {
  checkIn: Date;
  checkOut: Date;
}) => Promise<
  ScrapedListing[]
>;

type ScrapedListing = 
  (NewProperty & {
    originalListingUrl: string; // enforce that its non-null
    originalTotalPrice: number; // in cents
    reservedDateRanges: { start: Date; end: Date }[];
    reviews: Review[];
  });

export const directSiteScrapers: DirectSiteScraper[] = [
  // add more scrapers here
  arizonaScraper,
];

const testData = [
  {
    originalListingId: '588763',
    name: 'Gorgeous Hacienda on the River! Private dock!',
    about: 'Gorgeous Hacienda on the River! Private dock!<br />\n' +
      'One of the most beautiful homes on the Parker Strip is now a vacation home! It doesn&#39;t get any better than this! Fully refreshed with no detail overlooked! Top of the line everything including a gourmet kitchen, a fully stocked beverage center, a new dock and balconies abound! Two story, 4 bedroom, 3 bathrooms, gourmet kitchen, bar, gameroom, fireplace, private dock and launch ramp. &nbsp;Total resort style home with no detail overlooked. Perfect for the whole family and all the friends. In addition to the main house there are 2 apartments underneath for even more room. (only for use with main house rental)&nbsp; Everything you need to make the most memorable river trip yet!<br />\n' +
      'This is the one you want!',
    propertyType: ALL_PROPERTY_TYPES[3],
    address: 'Parker Strip, Parker, AZ',
    city: 'Parker',
    latitude: 34.2849743,
    longitude: -114.1356908,
    maxNumGuests: 15,
    numBeds: 4,
    numBedrooms: 4,
    numBathrooms: 3,
    amenities: [
      'Fireplace',
      'Decked area',
      'Air Conditioning',
      'Coffee Maker',
      'Microwave',
      'Dishwasher',
      'Dishes Utensils',
      'Spices',
      'BBQ',
      'Cooking Basics',
      'Blender',
      'Internet',
      'Fireplace',
      'Air Conditioning',
      'Heating',
      'Washer',
      'Dryer',
      'Game Room',
      'Hair Dryer',
      'Linens',
      'Towels',
      'Shampoo',
      'Essentials',
      'TV',
      'Linens provided',
      'Towels provided',
      'Extra Pillows And Blankets',
      'Conditioner',
      'Body Soap',
      'Grill',
      'Outdoor seating',
      'Watersports nearby',
      'Golf course within 30 min drive',
      'Beach',
      'River',
      'Waterfront',
      'Beach Front',
      'Water View',
      'Beachfront'
    ],
    otherAmenities: [],
    imageUrls: [
      'https://gallery.streamlinevrs.com/units-gallery/00/08/FB/image_163966547.jpeg',
      'https://gallery.streamlinevrs.com/units-gallery/00/08/FB/image_163966512.jpeg',
      'https://gallery.streamlinevrs.com/units-gallery/00/08/FB/image_163966555.jpeg',
      'https://gallery.streamlinevrs.com/units-gallery/00/08/FB/image_163966575.jpeg'
    ],
    originalListingUrl: 'https://integrityarizonavacationrentals.com/588763',
    avgRating: 4.7,
    numRatings: 10,
    originalListingPlatform: "IntegrityArizona" as ListingSiteName,
    originalTotalPrice: 236175,
    reservedDateRanges: [
      { start: new Date("2024-08-29T17:50:46.272Z"), end: new Date("2024-08-31T17:50:46.272Z") }
    ],
    reviews: [
      {
        name: 'Jennifer Paino',
        profilePic: '',
        review: "So happy for the opportunity to have stayed in this beautiful home! Excellent support and communication from the property managers, very well-equipped kitchen/bedrooms/bathrooms/dock and everyone in our group felt this property was super clean, spacious, comfortable, well organized and best of all, FUN! We can't wait to return! Thank you!!",
        rating: 5
      },
      {
        name: 'Cindy Tran',
        profilePic: '',
        review: "I really don't want to write this review because then it will always be booked out but this house definitely deserved a 5 star rating! This place was amazing .It had everything renters would need. From utensils, to ziplocks, baking items, to qtips and a lot more to name that other rentals don't have to use. The kitchen was FULLY supplied. We always bring our own supplies but I was shocked this place had so much of everything u can think of. One thing that I love about this place is they have a huge ice maker! Always ready with ice. And another freezer in the garage. And another huge cooler fridge for our drinks. Spectacular views throughout the house. Bob the park manager was so helpful and nice. The house was spotless. The deck was amazing! The ac worked well even with 110 plus degrees outside. We can't wait to come back for our next stay here.",
        rating: 5
      },
      {
        name: 'Rubi Rodriguez',
        profilePic: '',
        review: "Second time booking the house love the views . House was clean and it's very spacious. House is equipped with everything that you need. We had a good time !",
        rating: 5
      },
      {
        name: 'Robert Ruiz',
        profilePic: '',
        review: "Great location. Beautiful views. Property was very nice. Bob the onsite caretaker was great! Layla the property manager was quick to respond to our texts. This trip would have been 5 star but there was a sewage smell inside the home and inside the studios that was almost unbearable. You couldn't escape it and this is the only thing that took away from being a perfect trip. Had we known this was an issue, we would not have chosen this property.",
        rating: 3
      },
      {
        name: 'Tami Stafford',
        profilePic: '',
        review: 'The hacienda is gorgeous, even better than the photos!  It was a perfect space for us, very clean, and had every single thing you can imagine needing for your vacation.  Plenty of parking and a private dock for our toys. Layla was wonderful to work with and we would absolutely rent from her again!\n' +
          '\n' +
          "I would be remiss if I did not mention to my fellow boaters that the launch ramp is extremely steep and did present challenges both loading and unloading our wakeboard boat.  Thankfully, because of the dock, we only had that experience twice.  Also, this property is near Parker Dam and the current is strong.  Depending on the time of day, you may encounter water as shallow as 2.5 feet deep as you make your way to an area where you can wakeboard or surf. If you've ever torn up a prop, you may have PTSD navigating your boat through the water haha. This obviously wouldn't be an issue for fishing boats or other shallow boats, but if you have a wakeboard boat, understand that you will be making about a 20-minute trek down river to enjoy it.",
        rating: 4
      },
      {
        name: 'Aaron Mundinger',
        profilePic: '',
        review: 'Our host Bob was amazing and the home we beautiful and clean.  Would definitely come back  ',
        rating: 5
      },
      {
        name: 'Dianna Newport',
        profilePic: '',
        review: 'We rent a lot of vacation homes and this one is one of the top 3! It was clean, beautifully decorated, stocked with everything we needed and way more!  Would definitely recommend this home to anyone.',
        rating: 5
      },
      {
        name: 'Susan Kollars',
        profilePic: '',
        review: 'Everything was so easy from booking, to check in, to departure. The house is incredibly stocked & beautiful',
        rating: 5
      },
      {
        name: 'Ruby Rodriguez',
        profilePic: '',
        review: 'The house was beautiful better than the pictures clean and very spacious for a big group for the family or friends. Had a great time.',
        rating: 4
      },
      {
        name: 'Gary Nicholas',
        profilePic: '',
        review: 'We absolutely adored your home! It was very accommodating and made our stay superb!!!  The beautiful decor made it relaxing and comfortable, with River views, private dock and more! We had endless amounts of fun with family and friends and will definitely be back to take it on again!!!! Thank you!',
        rating: 5
      }
    ]
  }
]
// Helper function to filter out fields not in NewProperty
const filterNewPropertyFields = (listing: ScrapedListing): NewProperty => {
  const newPropertyKeys = Object.keys(properties).filter(key => key !== 'id');
  return Object.fromEntries(
    Object.entries(listing).filter(([key]) => newPropertyKeys.includes(key))
  ) as NewProperty;
};

// handle the scraped properties and reviews
export const scrapeDirectListings = async (options: {
  checkIn: Date;
  checkOut: Date;
}) => {
  // const allListings = await Promise.all(
  //   directSiteScrapers.map((scraper) => scraper(options)),
  // );
  // const listings = allListings.flat();
  const listings = testData;
  if (listings.length > 0) {
    await db.transaction(async (trx) => {
      // for each listing, insert or update the property, and insert the reviews
      for (const listing of listings) {
        if(!listing.originalListingId) {continue;}
        const existingPropertyIdList = await trx.select({id: properties.originalListingId})
          .from(properties)
          .where(eq(properties.originalListingId, listing.originalListingId));
        const existingPropertyId = existingPropertyIdList[0]?.id;

        const newPropertyListing = filterNewPropertyFields(listing);
        let tramonaPropertyId = null;
        if (existingPropertyId) {
          await trx.update(properties)
          .set({ ...newPropertyListing }) // Only keeps fields that are defined in the NewProperty schema
          .where(eq(properties.originalListingId, existingPropertyId)) 
        } else {
          tramonaPropertyId = await trx.insert(properties).values(newPropertyListing).returning({id: properties.id});
          console.log('Inserted new property with id:', tramonaPropertyId);
        }
      }
    });
  }

  return listings;
};