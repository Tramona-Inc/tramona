/* eslint-disable no-console */
import { type PropertyType } from "@/server/db/schema";
import axios from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";

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
];

type airbnbPropertyType = typeof airbnbPropertyTypes[number];

function convertAirbnbPropertyType(str: airbnbPropertyType): PropertyType {
  switch (str) {
    case "house":
      return "House";
    case "apartment":
      return "Apartment";
    case "barn":
      return "Barn";
    case "bnb": return "Bed & Breakfast";
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
      return "Shepherd's Hut";
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
    default:
      return
  }
}

const roomTypeMapping = {
  entire_home: "Entire place",
  private_room: "Private room",
  shared_room: "Shared room",
} as const;



export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    console.log("got webhook");

    const webhookData = req.body;
    switch (webhookData.action) {
      case "channel.activated":
        console.log("channel created");
        break;
      case "listing.created":
        const userId = webhookData.data.channel.customer.id;
        const imageResponse = await axios.get(`https://connect.hospitable.com/api/v1/customers/${userId}/listings/${webhookData.data.id}/images`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
            },
          }
        );
        const images = imageResponse.data.data.map((image) => image.url);
        const now  = new Date();
        const firstStartDate = now.toISOString().split('T')[0];
        const firstEndDate = new Date(now);
        firstEndDate.setDate(firstEndDate.getDate() + 365);
        const firstEndDateString = firstEndDate.toISOString().split('T')[0];

        const secondStartDate = new Date(firstEndDate);
        secondStartDate.setDate(secondStartDate.getDate() + 1);
        const secondStartDateString = secondStartDate.toISOString().split('T')[0];

        const secondEndDate = new Date(now);
        secondEndDate.setDate(now.getDate() + 540);
        const secondEndDateString = secondEndDate.toISOString().split('T')[0];

        let combinedPricingAndCalendarResponse;

        //have to send 2 batches because hospitable only allows 365 days at a time, but it allows up to 540 days in the future
        const firstBatch = await axios.get(`https://connect.hospitable.com/api/v1/listings/${webhookData.data.id}/calendar`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
            },
            params: {
              start_date: firstStartDate,
              end_date: firstEndDateString,
            }
          }
        );
        const secondBatch = await axios.get(`https://connect.hospitable.com/api/v1/listings/${webhookData.data.id}/calendar`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
            },
            params: {
              start_date: secondStartDateString,
              end_date: secondEndDateString,
            }
          }
        );
        combinedPricingAndCalendarResponse = [...firstBatch.data.data, ...secondBatch.data.data];

        const propertyObject = {
          hostId: userId,
          propertyType: convertAirbnbPropertyType(webhookData.data.property_type),
          roomType: roomTypeMapping[webhookData.data.room_type],
          maxNumGuests: webhookData.data.capacity.max,
          numBeds: webhookData.data.capacity.beds,
          numBedrooms: webhookData.data.capacity.bedrooms,
          numBathrooms: webhookData.data.capacity.bathrooms,
          latitude: webhookData.data.address.latitude,
          longitude: webhookData.data.address.longitude,
          city: webhookData.data.address.city,
          hostName: webhookData.data.channel.customer.name,
          name: webhookData.data.public_name,
          about: webhookData.data.description,
          address: webhookData.data.address.street + ", " + webhookData.data.address.city + ", " + webhookData.data.address.state + ", " + webhookData.data.address.country_code,
          imageUrls: images,
          //amenities: webhookData.data.amenities,
          //cancellationPolicy: webhookData.data.cancellation_policy,
          //ratings: webhookData.data.ratings,
        }

        console.log("channel updated");
        break;
      default:
    }

    console.log('Received webhook data:', webhookData);



    // Do something with the webhook data
    const {
      id,
      created,
      action,
      version,
      data: {
        id: channelId,
        platform,
        platform_id,
        name,
        picture,
        location,
        description,
        first_connected_at,
        customer
      }
    } = webhookData;

    console.log(`Channel ID: ${channelId}`);
    console.log(`Platform: ${platform}`);
    console.log(`Customer Name: ${customer.name}`);
    // Add your processing logic here


    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
