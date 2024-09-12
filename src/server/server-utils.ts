import { render } from "@react-email/render";
import nodemailler, { type TransportOptions } from "nodemailer";
import { env } from "@/env";
import { type ReactElement } from "react";
import { Twilio } from "twilio";
import { db } from "./db";
import { waitUntil } from "@vercel/functions";
import { formatCurrency, getNumNights, plural } from "@/utils/utils";
import axiosRetry from "axios-retry";
import {
  and,
  between,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  lte,
  notExists,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import {
  type NewProperty,
  type Property,
  type User,
  bookedDates,
  groupInvites,
  groupMembers,
  groups,
  hostTeamInvites,
  hostTeamMembers,
  properties,
  offers,
  requestsToProperties,
  users,
  hostReferralDiscounts,
  referralCodes,
  requests,
  propertyStatusEnum,
} from "./db/schema";
import { getCity, getCoordinates } from "./google-maps";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import * as cheerio from "cheerio";
import { sendSlackMessage } from "./slack";
import { HOST_MARKUP, TRAVELER__MARKUP } from "@/utils/constants";
import { HostRequestsPageData } from "./api/routers/propertiesRouter";
import { property } from "lodash";

export const axiosWithRetry = axios.create();

axiosRetry(axiosWithRetry, {
  retries: 3,

  retryDelay: (retryCount) =>
    retryCount * 1000 /* Wait 1s, 2s, 3s between retries*/,

  retryCondition: (error) => {
    // Retry on knowing errors and any 5xx errors
    return (
      error.code === "EPROTO" ||
      error.code === "ERR_BAD_RESPONSE" ||
      (error.response?.status !== undefined && error.response.status >= 500)
    );
  },
});

export const proxyAgent = new HttpsProxyAgent(env.PROXY_URL);

export async function scrapeUrl(url: string) {
  return await axios
    .get<string>(url, { httpsAgent: proxyAgent, responseType: "text" })
    .then((res) => res.data)
    .then(cheerio.load);
}

// List of user agents to rotate
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
];

// Function to get a random user agent
function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

export async function scrapeUrlLikeHuman(url: string) {
  return await axios
    .get<string>(url, {
      httpsAgent: proxyAgent,
      responseType: "text",
      headers: {
        "User-Agent": getRandomUserAgent(),
      },
      timeout: 10000,
    })
    .then((res) => res.data)
    .then(cheerio.load);
}

const transporter = nodemailler.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  // debug: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
} as TransportOptions);

const twilio = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export async function sendEmail({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: ReactElement;
}) {
  return await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: env.EMAIL_FROM,
        to,
        subject,
        html: render(content),
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      },
    );
  });
}

export async function addUserToGroups(user: Pick<User, "email" | "id">) {
  // get the groups they were invited to
  const groupIds = await db.query.groupInvites
    .findMany({
      where: eq(groupInvites.inviteeEmail, user.email),
      columns: { groupId: true },
    })
    .then((res) => res.map((invite) => invite.groupId));

  if (groupIds.length === 0) return;

  await db.transaction(async (tx) => {
    // add user to groups
    await tx
      .insert(groupMembers)
      .values(groupIds.map((groupId) => ({ groupId, userId: user.id })));

    // delete invites
    await tx
      .delete(groupInvites)
      .where(
        and(
          inArray(groupInvites.groupId, groupIds),
          eq(groupInvites.inviteeEmail, user.email),
        ),
      );
  });
}

export async function addUserToHostTeams(user: Pick<User, "email" | "id">) {
  const hostTeamIds = await db.query.hostTeamInvites
    .findMany({
      where: eq(hostTeamInvites.inviteeEmail, user.email),
      columns: { hostTeamId: true },
    })
    .then((res) => res.map((invite) => invite.hostTeamId));

  if (hostTeamIds.length === 0) return;

  // make the user a host
  await db.update(users).set({ role: "host" }).where(eq(users.id, user.id));

  await db.transaction(async (tx) => {
    // add user to teams
    await tx
      .insert(hostTeamMembers)
      .values(
        hostTeamIds.map((hostTeamId) => ({ hostTeamId, userId: user.id })),
      );

    // delete invites
    await tx
      .delete(hostTeamInvites)
      .where(
        and(
          inArray(hostTeamInvites.hostTeamId, hostTeamIds),
          eq(hostTeamInvites.inviteeEmail, user.email),
        ),
      );
  });
}

export async function sendText({
  to,
  content,
}: {
  to: string;
  content: string;
}) {
  const response = await twilio.messages.create({
    body: content,
    from: env.TWILIO_FROM,
    to,
  });
  return response;
}

export async function sendWhatsApp({
  templateId,
  to,
  propertyName,
  propertyAddress,
  url,
  checkIn,
  checkOut,
  numRequests,
}: {
  templateId: string;
  to: string;
  propertyName?: string;
  propertyAddress?: string;
  url?: string;
  checkIn?: Date;
  checkOut?: Date;
  numRequests?: number;
}) {
  let contentVariables: Record<number, string | undefined> = {};

  // Set content variables based on template ID
  if (
    templateId === "HXd5256ff10d6debdf70a13d70504d39d5" ||
    templateId === "HXb293923af34665e7eefc81be0579e5db"
  ) {
    contentVariables = {
      1: propertyName,
      2: propertyAddress,
      3: checkIn?.toISOString(),
      4: checkOut?.toISOString(), //is this a problem?
    };

    if (templateId === "HXd5256ff10d6debdf70a13d70504d39d5") {
      contentVariables[5] = url;
    }
  } else if (templateId === "HX82b075be3d74f02e45957a453fd48cef") {
    if (numRequests) {
      contentVariables = {
        1:
          numRequests > 1
            ? `${numRequests} unconfirmed requests`
            : `${numRequests} unconfirmed request`,
        2:
          numRequests > 1
            ? `${numRequests} requests`
            : `${numRequests} request`,
        3: url,
      };
    }
  } else if (templateId === "HX08c870ee406c7ef4ff763917f0b3c411") {
    contentVariables = {
      1: propertyAddress,
    };
  }

  // Create Twilio message payload
  const twilioMessagePayload = {
    contentSid: templateId,
    from: `whatsapp:${env.TWILIO_FROM}`,
    messagingServiceSid: "MG7f313e1063abc277e6503fd9c9f3ef07",
    to: `whatsapp:${to}`,
    contentVariables: JSON.stringify(contentVariables),
  };

  // Send the Twilio message
  const response = await twilio.messages.create(twilioMessagePayload);
  return response;
}

export async function getGroupOwnerId(groupId: number) {
  return await db.query.groups
    .findFirst({
      columns: { ownerId: true },
      where: eq(groups.id, groupId),
    })
    .then((res) => res?.ownerId);
}

export async function getHostTeamOwnerId(hostTeamId: number) {
  return await db.query.hostTeams
    .findFirst({
      columns: { ownerId: true },
      where: eq(groups.id, hostTeamId),
    })
    .then((res) => res?.ownerId);
}

export async function addProperty({
  userId,
  userEmail,
  hostTeamId,
  property,
  isAdmin,
}: {
  userId?: string;
  userEmail?: string;
  hostTeamId?: number | null;
  isAdmin: boolean;
  property: Omit<NewProperty, "id" | "city" | "latLngPoint"> & {
    latLngPoint?: { x: number; y: number };
  };
}) {
  let lat = property.latLngPoint?.y;
  let lng = property.latLngPoint?.x;

  if (!lat || !lng) {
    const { location } = await getCoordinates(property.address);
    if (!location) throw new Error("Could not get coordinates for address");
    lat = location.lat;
    lng = location.lng;
  }
  const city = await getCity({ lat, lng });

  const [insertedProperty] = await db
    .insert(properties)
    .values({
      ...property,
      hostId: userId,
      // latitude: lat,
      // longitude: lng,
      city: city,
      latLngPoint: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
      hostTeamId,
    })
    .returning({ id: properties.id });

  // waitUntil(processRequests(insertedProperty!));

  await sendSlackMessage({
    isProductionOnly: true,
    channel: "host-bot",
    text: [
      `*New property added: ${property.name} in ${property.address}*
     by ${isAdmin ? "an Tramona admin" : userEmail}`,
    ].join("\n"),
  });
  return insertedProperty!.id;
}

// async function processRequests(
//   insertedProperty: Pick<Property, "id" | "latLngPoint" | "priceRestriction">,
// ) {

//   const allRequestsForProperty = await getRequestsForPropert({
//     id: insertedProperty.id,
//     latLngPoint: insertedProperty.latLngPoint,
//     priceRestriction: insertedProperty.priceRestriction,
//   });
//   // const allRequests = await db.query.requests.findMany({});
//   console.log("allRequestsForProperty: ");
//   for (const request of allRequestsForProperty) {
//     console.log("request: ", request);
//   }

// for (const request of allRequests) {
//   const matchingProperties = await getPropertiesForRequest({
//     id: request.id,
//     // lat: request.lat,
//     // lng: request.lng,
//     radius: request.radius,
//     location: request.location,
//     checkIn: request.checkIn,
//     checkOut: request.checkOut,
//     maxTotalPrice: request.maxTotalPrice,
//     latLngPoint: request.latLngPoint,
//     // propertyLatLngPoint: insertedProperty.latLngPoint,
//   });

// console.log("properties:", allRequestsForProperty);
// const propertyIds = request.map((property) => property.id);

// if (propertyIds.includes(insertedProperty.id)) {
//   await db.insert(requestsToProperties).values({
//     requestId: request.id,
//     propertyId: insertedProperty.id,
//   });
// }
//}
// }

export async function sendTextToHost(
  matchingProperties: { id: number; hostId: string | null }[],
  checkIn: Date,
  checkOut: Date,
  maxTotalPrice: number,
  location: string,
) {
  const uniqueHostIds = Array.from(
    new Set(matchingProperties.map((property) => property.hostId)),
  );
  const numHostPropertiesPerRequest = matchingProperties.reduce(
    (acc, property) => {
      if (property.hostId) {
        acc[property.hostId] = (acc[property.hostId] ?? 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  waitUntil(
    Promise.all(
      uniqueHostIds.filter(Boolean).map(async (hostId) => {
        const host = await db.query.users.findFirst({
          where: eq(users.id, hostId),
          columns: { name: true, email: true, phoneNumber: true },
        });

        if (!host?.phoneNumber) return;

        const numberOfNights = getNumNights(checkIn, checkOut);

        await sendText({
          to: host.phoneNumber,
          content: `Tramona: There is a request for ${formatCurrency(maxTotalPrice / numberOfNights)} per night for ${plural(numberOfNights, "night")} in ${location}. You have ${plural(numHostPropertiesPerRequest[hostId] ?? 0, "eligible property", "eligible properties")}. Please click here to make a match: ${env.NEXTAUTH_URL}/host/requests`,
        });

        //TODO SEND WHATSAPP MESSAGE
      }),
    ),
  );
}

export async function getRequestsForProperties(
  properties: Property[],
  //{
  // id: number;
  // propertyStaus: string;
  // latLngPoint: { x: number; y: number };
  // priceRestriction: number | null;
  //}
  //[],
  { tx = db } = {},
) {
  const requestIsNearProperties: SQL[] = [];
  // let priceRestrictionsSQL: SQL[] | undefined[] = [sql`FALSE`];
  const propertyToRequestMap: {
    property: Property;
    request: Request & { traveler: Pick<User, "name" | "image"> };
  }[] = [];

  for (const property of properties) {
    const requestIsNearProperty = sql`
      ST_DWithin(
        ST_Transform(requests.lat_lng_point, 3857),
        ST_Transform(ST_SetSRID(ST_MakePoint(${property.latLngPoint.x}, ${property.latLngPoint.y}), 4326), 3857),
        requests.radius * 1609.34
      )
    `;
    //  const numberOfNights = sql`DATE_PART('day', requests.check_out::timestamp - requests.check_in::timestamp)`;

    //   const priceRestrictionSQL = sql`
    //     ${property.priceRestriction} IS NULL OR
    //     (
    //       requests.max_total_price IS NOT NULL AND
    //       ${property.priceRestriction} >= (requests.max_total_price / DATE_PART('day', requests.check_out::timestamp - requests.check_in::timestamp)) * 1.15
    //     )
    // `;
    requestIsNearProperties.push(requestIsNearProperty);

    const requestsForProperty = await tx.query.requests.findMany({
      where: and(requestIsNearProperty, gte(requests.checkIn, new Date())),
      with: {
        madeByGroup: {
          with: { owner: { columns: { image: true, name: true } } },
        },
      },
    });
    //columns: { id: true, checkIn: true, checkOut: true, maxTotalPrice: true, location: true },

    // Store the matched requests along with the property
    for (const request of requestsForProperty) {
      const traveler = {
        name: request.madeByGroup.owner.name,
        image: request.madeByGroup.owner.image,
      };
      propertyToRequestMap.push({
        property,
        request: {
          ...request,
          traveler, // Include traveler info
        },
      });
    }
    // priceRestrictionsSQL.push(priceRestrictionSQL);
  }
  return propertyToRequestMap;
}

// export async function getRequestsForProperties(
//   properties: {
//     id: number;
//     propertyStaus: string;
//     latLngPoint: { x: number; y: number };
//     priceRestriction: number | null;
//   }[],
//   { tx = db } = {},
// ) {
//   const requestIsNearProperties: SQL[] = [];
//   // let priceRestrictionsSQL: SQL[] | undefined[] = [sql`FALSE`];

//   for (const property of properties) {
//   const requestIsNearProperty = sql`
//       ST_DWithin(
//         ST_Transform(requests.lat_lng_point, 3857),
//         ST_Transform(ST_SetSRID(ST_MakePoint(${property.latLngPoint.x}, ${property.latLngPoint.y}), 4326), 3857),
//         requests.radius * 1609.34
//       )
//     `;
// //  const numberOfNights = sql`DATE_PART('day', requests.check_out::timestamp - requests.check_in::timestamp)`;

// //   const priceRestrictionSQL = sql`
// //     ${property.priceRestriction} IS NULL OR
// //     (
// //       requests.max_total_price IS NOT NULL AND
// //       ${property.priceRestriction} >= (requests.max_total_price / DATE_PART('day', requests.check_out::timestamp - requests.check_in::timestamp)) * 1.15
// //     )
// // `;
//     requestIsNearProperties.push(requestIsNearProperty);
//     // priceRestrictionsSQL.push(priceRestrictionSQL);
//   }

//   const result = await tx.query.requests.findMany({
//     where: and(
//       or(...requestIsNearProperties),  //or requestIsNearProperties
//       gte(requests.checkIn, new Date()),
//       //TO DO: FIX ERROR WITH price restrictionSQL
//       // priceRestrictionSQL,

//       // or(
//       //   isNull(property.priceRestriction), // Include requests with no max price restriction
//       //   and(
//       //     isNotNull(property.priceRestriction),
//       //     gte(
//       //       property.priceRestriction,
//       //       )
//       //     )
//       //   )
//       // )

//     ),
//     //columns: { id: true, checkIn: true, checkOut: true, maxTotalPrice: true, location: true },

//   });

//   return result;
// }

export async function getPropertiesForRequest(
  req: {
    // lat: number;
    // lng: number;
    radius: number;
    location: string;
    checkIn: Date;
    checkOut: Date;
    maxTotalPrice: number;
    id: number;
    latLngPoint: { x: number; y: number };
    // propertyLatLngPoint?: Property["latLngPoint"];
  },
  { tx = db } = {},
) {
  let propertyIsNearRequest: SQL | undefined = sql`FALSE`;

  //WAITING FOR MAP PIN TO MERGE IN TO TEST THIS
  // if (req.lat != null && req.lng != null && req.radius != null) {
  // Convert radius from miles to degrees (approximate)
  const radiusInDegrees = req.radius * 1609.34;

  propertyIsNearRequest = sql`
    ST_DWithin(
      ST_Transform(properties.lat_lng_point, 3857),
      ST_Transform(ST_SetSRID(ST_MakePoint(${req.latLngPoint.x}, ${req.latLngPoint.y}), 4326), 3857),
      ${radiusInDegrees}
    )
  `;
  // } else {
  //   const coordinates = await getCoordinates(req.location);
  //   if (coordinates.bounds) {
  //     console.log(
  //       "bounds",
  //       coordinates.bounds,
  //       req.location,
  //       req.maxTotalPrice,
  //     );
  //     const { northeast, southwest } = coordinates.bounds;
  //     propertyIsNearRequest = sql`
  //       ST_Within(
  //         properties.lat_lng_point,
  //         ST_MakeEnvelope(
  //           ${southwest.lng}, ${southwest.lat},
  //           ${northeast.lng}, ${northeast.lat},
  //           4326
  //         )
  //       )
  //     `;
  //   } else if (coordinates.location) {
  //     const radiusInMiles = 10;
  //     const radiusInDegrees = radiusInMiles / 69.0;

  //     propertyIsNearRequest = sql`
  //       ST_DWithin(
  //         properties.lat_lng_point,
  //         ST_SetSRID(ST_MakePoint(${coordinates.location.lng}, ${coordinates.location.lat}), 4326),
  //         ${radiusInDegrees}
  //       )
  //     `;
  //   }
  // }

  const propertyisAvailable = notExists(
    tx
      .select()
      .from(bookedDates)
      .where(
        and(
          eq(bookedDates.propertyId, properties.id),
          between(bookedDates.date, req.checkIn, req.checkOut),
        ),
      ),
  );

  const numberOfNights = getNumNights(req.checkIn, req.checkOut);

  const result = await tx.query.properties.findMany({
    where: and(
      isNotNull(properties.hostId),
      propertyIsNearRequest,
      propertyisAvailable,
      or(
        isNull(properties.priceRestriction), // Include properties with no price restriction
        and(
          isNotNull(properties.priceRestriction),
          lte(
            properties.priceRestriction,
            Math.round((req.maxTotalPrice / numberOfNights) * 1.15),
          ),
        ),
      ),
    ),
    columns: { id: true, hostId: true },
  });

  return result;
}

export async function getAdminId() {
  return await db.query.users
    .findFirst({ where: eq(users.email, "info@tramona.com") })
    .then((res) => res!.id);
}

type HospitablePriceResponse = {
  data: {
    dates: {
      price: { amount: number };
    }[];
  };
};

type HostawayPriceResponse = {
  result: {
    totalPrice: number;
  };
};

export async function getPropertyOriginalPrice(
  property: Pick<Property, "originalListingId" | "originalListingPlatform">,
  params: {
    checkIn: string;
    checkOut: string;
    numGuests: number;
  },
) {
  if (property.originalListingPlatform === "Hospitable") {
    const { data } = await axios.get<HospitablePriceResponse>(
      `https://connect.hospitable.com/api/v1/listings/${property.originalListingId}/calendar`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
        },
        params: {
          start_date: params.checkIn,
          end_date: params.checkOut,
        },
      },
    );
    const totalPrice = data.data.dates.reduce((acc, date) => {
      return acc + date.price.amount;
    }, 0);
    return totalPrice;
  } else if (property.originalListingPlatform === "Hostaway") {
    const { data } = await axios.get<HostawayPriceResponse>(
      `https://api.hostaway.com/v1/properties/${property.originalListingId}/calendar/priceDetails`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HOSTAWAY_API_KEY}`,
        },
        params,
      },
    );
    const totalPrice = data.result.totalPrice;
    return totalPrice;
  }
  // code for other options
}

export interface SeparatedData {
  normal: HostRequestsPageData[];
  outsidePriceRestriction: HostRequestsPageData[];
}

//update spread on every fetch to keep information updated
export async function updateTravelerandHostMarkup({
  offerTotalPrice,
  offerId,
}: {
  offerTotalPrice: number;
  offerId: number;
}) {
  console.log("offerTotalPrice", offerTotalPrice);
  const travelerPrice = Math.ceil(offerTotalPrice * TRAVELER__MARKUP);
  const hostPay = Math.ceil(offerTotalPrice * HOST_MARKUP);
  console.log("travelerPrice", travelerPrice);
  await db
    .update(offers)
    .set({
      travelerOfferedPrice: travelerPrice,
      hostPayout: hostPay,
    })
    .where(and(eq(offers.id, offerId), isNull(offers.acceptedAt)));
}

export async function createHostReferral({
  userId,
  referralCodeUsed,
}: {
  userId: string;
  referralCodeUsed: string | null;
}) {
  console.log("this is the referral code ysed  ", referralCodeUsed);
  if (referralCodeUsed) {
    const isReferralUsed = await db.query.hostReferralDiscounts.findFirst({
      where: eq(hostReferralDiscounts.refereeUserId, userId),
    });
    console.log("about to return ", isReferralUsed);
    if (isReferralUsed) return;
    //find owner of the referral code
    const referrer = await db.query.referralCodes.findFirst({
      where: eq(referralCodes.referralCode, referralCodeUsed),
      columns: { ownerId: true },
    });
    //create host referral discount row
    if (referrer) {
      await db.insert(hostReferralDiscounts).values({
        referralCode: referralCodeUsed,
        ownerId: referrer.ownerId,
        refereeUserId: userId,
      });
    }
    //send an email or notification to the referrer
  }
}

function getRandomNormalDistribution(mean: number, stdDev: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num * stdDev + mean; // Scale to the desired mean and standard deviation
  return Math.round(num); // Round to nearest integer
}

function stripTimeFromDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function createNormalDistributionDates(
  numRanges: number,
): { checkIn: Date; checkOut: Date }[] {
  const dateRanges = [];

  for (let i = 0; i < numRanges; i++) {
    const today = new Date();
    const futureDate = new Date(
      today.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000,
    ); // Random date within next 90 days
    const startDate = stripTimeFromDate(new Date(futureDate));

    // Generate end date using a normal distribution with mean = 3 days and stdDev = 1 day
    let endDateOffset = getRandomNormalDistribution(3, 1);
    // Ensure endDateOffset is at least 1 day
    endDateOffset = Math.max(1, endDateOffset);

    const endDate = stripTimeFromDate(
      new Date(startDate.getTime() + endDateOffset * 24 * 60 * 60 * 1000),
    );

    dateRanges.push({
      checkIn: startDate,
      checkOut: endDate,
    });
  }

  return dateRanges;
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 3958.8; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}
