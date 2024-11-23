import {
  hostProfiles,
  properties,
  reservedDateRanges,
  users,
  type PropertyType,
} from "@/server/db/schema";
import axios, { AxiosError } from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { sendSlackMessage } from "@/server/slack";
import {
  addHostProfile,
  axiosWithRetry,
  createInitialHostTeam,
  createLatLngGISPoint,
  getPropertyCalendar,
  proxyAgent,
} from "@/server/server-utils";
import { getAddress } from "@/server/google-maps";
import { calculateTotalTax } from "@/utils/payment-utils/taxData";
import {
  getAmenities,
  getCancellationPolicy,
  getListingDataUrl,
  getReviewsUrl,
} from "@/server/external-listings-scraping/scrapeAirbnbListing";
import { airbnbHeaders } from "@/utils/constants";
import { addDays } from "@/utils/utils";

export async function insertHost(id: string) {
  // Insert Host info
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existingHostProfile = await db.query.hostProfiles.findFirst({
    where: eq(hostProfiles.userId, user.id),
  });

  if (existingHostProfile) {
    return existingHostProfile;
  }

  const teamId = await createInitialHostTeam(user);

  await addHostProfile({ userId: user.id, curTeamId: teamId });
}

const airbnbPropertyTypes = [
  "house",
  "apartment",
  "barn",
  "bnb",
  "boat",
  "cabin",
  "rv",
  "casa_particular",
  "castle",
  "cave",
  "shipping_container",
  "cycladic_house",
  "dammuso",
  "dome_house",
  "earthhouse",
  "farm_stay",
  "guesthouse",
  "hotel",
  "houseboat",
  "kezhan",
  "minsu",
  "riad",
  "ryokan",
  "shepherds_hut",
  "tent",
  "tiny_house",
  "tower",
  "treehouse",
  "trullo",
  "windmill",
  "yurt",
] as const;

type AirbnbPropertyType = (typeof airbnbPropertyTypes)[number];

function convertAirbnbPropertyType(str: AirbnbPropertyType): PropertyType {
  switch (str) {
    case "house":
      return "House";
    case "apartment":
      return "Apartment";
    case "barn":
      return "Barn";
    case "bnb":
      return "Bed & Breakfast";
    case "boat":
      return "Boat";
    case "cabin":
      return "Cabin";
    case "rv":
      return "Camper/RV";
    case "casa_particular":
      return "Casa Particular (Cuba)";
    case "castle":
      return "Castle";
    case "cave":
      return "Cave";
    case "shipping_container":
      return "Shipping Container";
    case "cycladic_house":
      return "Cycladic House";
    case "dammuso":
      return "Dammusi";
    case "dome_house":
      return "Dome House";
    case "earthhouse":
      return "Earth House";
    case "farm_stay":
      return "Farm Stay";
    case "guesthouse":
      return "Guesthouse";
    case "hotel":
      return "Hotel";
    case "houseboat":
      return "Houseboat";
    case "kezhan":
      return "Kezhan";
    case "minsu":
      return "Minsu (Taiwan)";
    case "riad":
      return "Riad";
    case "ryokan":
      return "Ryokan (Japan)";
    case "shepherds_hut":
      return "Shepherd’s Hut";
    case "tent":
      return "Tent";
    case "tiny_house":
      return "Tiny House";
    case "tower":
      return "Tower";
    case "treehouse":
      return "Treehouse";
    case "trullo":
      return "Trullo";
    case "windmill":
      return "Windmill";
    case "yurt":
      return "Yurt";
  }
}

const roomTypeMapping = {
  entire_home: "Entire place",
  private_room: "Private room",
  shared_room: "Shared room",
} as const;

interface ListingCreatedWebhook {
  action: "listing.created";
  data: {
    platform_id: string;
    id: string;
    public_name: string;
    property_type: AirbnbPropertyType;
    room_type: keyof typeof roomTypeMapping;
    house_rules: string;
    capacity: {
      max: number;
      beds: number;
      bedrooms: number;
      bathrooms: number;
    };
    address: {
      latitude: number;
      longitude: number;
      city: string;
      state: string;
      country_code: string;
      street: string;
    };
    description: string;
    channel: {
      id: string;
      name: string;
      customer: {
        id: string;
        name: string;
      };
    };
  };
}

interface ChannelActivatedWebhook {
  action: "channel.activated";
  data: {
    name: string;
    picture: string;
    location: string;
    description: string;
    customer: {
      id: string;
      name: string;
    };
  };
}

type ImageResponse = {
  data: {
    url: string;
  }[];
};

type DateResponse = {
  data: {
    dates: {
      date: string;
      availability: {
        available: boolean;
      };
    }[];
  };
};

type ReviewResponse = {
  data: {
    id: string;
    platform_id: string;
    reservation_platform_id: string;
    detailed_ratings: {
      rating: number;
      comment: string;
    }[];
  }[];
};

type ReservationResponse = {
  data: {
    id: string;
    guest: {
      first_name: string;
      last_name: string;
    };
  }[];
};
type HospitableWebhook = ListingCreatedWebhook | ChannelActivatedWebhook;

export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    console.log("got webhook");
    const webhookData = req.body as HospitableWebhook;
    switch (webhookData.action) {
      case "channel.activated":
        console.log("channel created");
        await insertHost(webhookData.data.customer.id);
        await db
          .update(users)
          .set({
            image: webhookData.data.picture,
            location: webhookData.data.location,
            about: webhookData.data.description,
          })
          .where(eq(users.id, webhookData.data.customer.id));
        break;
      case "listing.created":
        console.log("listing created", webhookData.data);
        const userId = webhookData.data.channel.customer.id;
        const imageResponse = await axios.get<ImageResponse>(
          `https://connect.hospitable.com/api/v1/customers/${userId}/listings/${webhookData.data.id}/images`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
            },
          },
        );
        const images = imageResponse.data.data.map((image) => image.url);
        const combinedPricingAndCalendarResponse = await getPropertyCalendar(webhookData.data.id);

        let currentRange: { start: string; end: string } | null = null;
        const datesReserved: { start: string; end: string }[] = [];

        combinedPricingAndCalendarResponse.forEach((day) => {
          if (!day.availability.available) {
            if (currentRange) {
              currentRange.end = day.date;
            } else {
              currentRange = { start: day.date, end: day.date };
            }
          } else {
            if (currentRange) {
              datesReserved.push(currentRange);
              currentRange = null;
            }
          }
        });

        // Handle the last range if it exists
        if (currentRange) {
          datesReserved.push(currentRange);
        }

        // Insert data into the reservedDates table
        const latLngPoint = createLatLngGISPoint({
          lat: webhookData.data.address.latitude,
          lng: webhookData.data.address.longitude,
        });

        const { city, stateCode, country, countryISO, stateName, county } = await getAddress({
          lat: webhookData.data.address.latitude,
          lng: webhookData.data.address.longitude,
        });

        const taxInfo = calculateTotalTax({ country, stateCode, city });

        if (taxInfo.length === 0) {
          await sendSlackMessage({
            text: `Host created a listing in ${city}, ${stateCode}, ${country} but we don't have tax info for that location`,
            channel: "host-bot",
          });
        }
        const listingId = webhookData.data.platform_id;
        const dateIn3Days = addDays(new Date(), 3);
        const dateIn5Days = addDays(new Date(), 5);

        //const allReviews = await axios.get(`https://connect.hospitable.com/api/v1/channels/${channelId}/reviews`);

        const listingDataUrl = getListingDataUrl(listingId, {
          checkIn: dateIn3Days,
          checkOut: dateIn5Days,
        });

        console.log("listingDataUrl", listingDataUrl);
        const reviewsUrl = getReviewsUrl(listingId);

        const [listingData, reviewsData] = (await Promise.all(
          [
            listingDataUrl,
            reviewsUrl, // 10 best reviews
          ].map((url) =>
            axiosWithRetry
              .get<string>(url, {
                headers: airbnbHeaders,
                httpsAgent: proxyAgent,
                responseType: "text",
              })
              .then((r) => r.data)
              .catch((e) => {
                console.error(`Error fetching ${url}:`, e);
                throw e;
              }),
          ),
        )) as [string, string];


        // console.log("listingData", listingData);

        let cancellationPolicy;
        try {
          cancellationPolicy = getCancellationPolicy(listingData, listingId);
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error(axiosError.message);
          cancellationPolicy = "Flexible";
        }

        const amenities = getAmenities(listingData, listingId);

        // const allReviews = (
        //   await axios.get<ReviewResponse>(
        //     `https://connect.hospitable.com/api/v1/channels/${webhookData.data.channel.id}/reviews`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
        //       },
        //     },
        //   )
        // ).data;
        // const reviewsForProperty = allReviews.data.filter((review) => {
        //   return review.platform_id === listingId;
        // })[0];
        // let [numReviews, avgRating] = [0, 0];
        // if (reviewsForProperty) {
        //   numReviews = reviewsForProperty.detailed_ratings.length;
        //   let sum = 0;
        //   for (const review of reviewsForProperty.detailed_ratings) {
        //     sum += review.rating;
        //   }
        //   avgRating = sum / numReviews;
        // }


        const hostProfile = await db.query.hostProfiles.findFirst({
          where: eq(hostProfiles.userId, userId),
        });

        if (!hostProfile) {
          throw new Error(`Host profile not found for user ${userId}`);
        }

        const propertyId = await db
          .insert(properties)
          .values({
            hostTeamId: hostProfile.curTeamId,
            propertyType: convertAirbnbPropertyType(
              webhookData.data.property_type,
            ),
            roomType: roomTypeMapping[webhookData.data.room_type],
            maxNumGuests: webhookData.data.capacity.max,
            numBeds: webhookData.data.capacity.beds,
            numBedrooms: webhookData.data.capacity.bedrooms,
            numBathrooms: webhookData.data.capacity.bathrooms,
            otherHouseRules: webhookData.data.house_rules,
            latLngPoint: latLngPoint,
            hostName: webhookData.data.channel.customer.name,
            name: webhookData.data.public_name,
            about: webhookData.data.description,
            address:
              webhookData.data.address.street +
              ", " +
              webhookData.data.address.city +
              ", " +
              webhookData.data.address.state +
              ", " +
              webhookData.data.address.country_code,
            imageUrls: images,
            originalListingPlatform: "Hospitable" as const,
            originalListingId: webhookData.data.platform_id,
            amenities: amenities,
            cancellationPolicy: cancellationPolicy,
            hospitableListingId: webhookData.data.id,
            stateName: stateName,
            stateCode: stateCode,
            county: county,
            city: city,
            countryISO: countryISO,
            country: country,
            //ratings: webhookData.data.ratings,
          })
          .returning({ id: properties.id })
          .then((result) => result[0]!.id);

        await db.insert(reservedDateRanges).values(
          datesReserved.map((dateRange) => ({
            propertyId: propertyId,
            start: dateRange.start,
            end: dateRange.end,
            platformBookedOn: "airbnb" as const,
          })),
        );

        break;
    }

    // Add your processing logic here

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
