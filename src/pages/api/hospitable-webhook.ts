import {
  hostProfiles,
  hostTeamMembers,
  hostTeams,
  properties,
  reservedDateRanges,
  users,
  type PropertyType,
} from "@/server/db/schema";
import axios from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";
import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { sendSlackMessage } from "@/server/slack";
import { createLatLngGISPoint } from "@/server/server-utils";

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

  const teamId = await db
    .insert(hostTeams)
    .values({
      ownerId: user.id,
      name: `${user.name ?? user.username ?? user.email}`,
    })
    .returning()
    .then((res) => res[0]!.id);

  // Insert Host info

  await db.insert(hostTeamMembers).values({
    hostTeamId: teamId,
    userId: user.id,
  });

  await db.insert(hostProfiles).values({
    userId: user.id,
    curTeamId: teamId,
  });

  await sendSlackMessage({
    text: [
      "*Host Profile Created:*",
      `User ${user.name} has become a host`,
    ].join("\n"),
    channel: "host-bot",
  });
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
    id: string;
    public_name: string;
    property_type: AirbnbPropertyType;
    room_type: keyof typeof roomTypeMapping;
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
        break;
      case "listing.created":
        const userId = webhookData.data.channel.customer.id;
        console.log(webhookData.data);
        const imageResponse = await axios.get<ImageResponse>(
          `https://connect.hospitable.com/api/v1/customers/${userId}/listings/${webhookData.data.id}/images`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
            },
          },
        );
        const images = imageResponse.data.data.map((image) => image.url);
        const now = new Date();
        const firstStartDate = now.toISOString().split("T")[0];
        const firstEndDate = new Date(now);
        firstEndDate.setDate(firstEndDate.getDate() + 365);
        const firstEndDateString = firstEndDate.toISOString().split("T")[0];

        const secondStartDate = new Date(firstEndDate);
        secondStartDate.setDate(secondStartDate.getDate() + 1);
        const secondStartDateString = secondStartDate
          .toISOString()
          .split("T")[0];

        const secondEndDate = new Date(now);
        secondEndDate.setDate(now.getDate() + 539);
        const secondEndDateString = secondEndDate.toISOString().split("T")[0];

        //have to send 2 batches because hospitable only allows 365 days at a time, but it allows up to 540 days in the future
        const firstBatch = await axios.get<DateResponse>(
          `https://connect.hospitable.com/api/v1/listings/${webhookData.data.id}/calendar`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
            },
            params: {
              start_date: firstStartDate,
              end_date: firstEndDateString,
            },
          },
        );
        const secondBatch = await axios.get<DateResponse>(
          `https://connect.hospitable.com/api/v1/listings/${webhookData.data.id}/calendar`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
            },
            params: {
              start_date: secondStartDateString,
              end_date: secondEndDateString,
            },
          },
        );
        const combinedPricingAndCalendarResponse = [
          ...firstBatch.data.data.dates,
          ...secondBatch.data.data.dates,
        ];

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
        const latLngPoint = createLatLngGISPoint({ lat: webhookData.data.address.latitude, lng: webhookData.data.address.longitude });

        const propertyObject = {
          hostId: userId,
          propertyType: convertAirbnbPropertyType(
            webhookData.data.property_type,
          ),
          roomType: roomTypeMapping[webhookData.data.room_type],
          maxNumGuests: webhookData.data.capacity.max,
          numBeds: webhookData.data.capacity.beds,
          numBedrooms: webhookData.data.capacity.bedrooms,
          numBathrooms: webhookData.data.capacity.bathrooms,
          // latitude: webhookData.data.address.latitude,
          // longitude: webhookData.data.address.longitude,
          latLngPoint: latLngPoint,
          city: webhookData.data.address.city,
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
          originalListingId: webhookData.data.id,
          //amenities: webhookData.data.amenities,
          //cancellationPolicy: webhookData.data.cancellation_policy,
          //ratings: webhookData.data.ratings,
        };

        const propertyId = await db
          .insert(properties)
          .values(propertyObject)
          .returning({ id: properties.id })
          .then((result) => result[0]!.id);

        for (const dateRange of datesReserved) {
          await db.insert(reservedDateRanges).values({
            propertyId: propertyId,
            start: dateRange.start,
            end: dateRange.end,
            platformBookedOn: "airbnb"
          });
        }
        break;
    }

    // Add your processing logic here

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}


