import { render } from "@react-email/render";
import nodemailler, { type TransportOptions } from "nodemailer";
import { env } from "@/env";
import { type ReactElement } from "react";
import { Twilio } from "twilio";
import { db } from "./db";
import { getNumNights } from "@/utils/utils";
import axiosRetry from "axios-retry";
import {
  and, eq,
  exists,
  gt,
  gte,
  inArray, isNull,
  lt,
  lte,
  notExists,
  notInArray,
  or,
  sql,
  type SQL
} from "drizzle-orm";
import {
  type NewProperty,
  type Property,
  type User,
  type Request,
  type RequestsToBook, groupInvites,
  groupMembers,
  groups,
  hostTeamMembers,
  properties,
  offers,
  users,
  hostReferralDiscounts,
  referralCodes,
  requests,
  rejectedRequests,
  hostTeams,
  requestsToBook,
  hostProfiles,
  reservedDateRanges
} from "./db/schema";
import { getAddress, getCoordinates } from "./google-maps";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import * as cheerio from "cheerio";
import { sendSlackMessage } from "./slack";
import { HOST_MARKUP, TRAVELER_MARKUP } from "@/utils/constants";
import {
  HostRequestsPageData,
  HostRequestsPageOfferData,
} from "@/server/types/propertiesRouter";
import { Session } from "next-auth";
import { calculateTotalTax } from "@/utils/payment-utils/taxData";
import {
  scrapePage,
  serpPageSchema,
  transformSearchResult,
} from "./external-listings-scraping/airbnbScraper";
import { getSerpUrl } from "./external-listings-scraping/airbnbScraper";
import { createStripeConnectId } from "@/utils/stripe-utils";
import { zodEmail } from "@/utils/zod-utils";
import { z } from "zod";
import { createUserNameAndPic } from "@/components/activity-feed/admin/generationHelper";
import { handleRequestSubmission } from "./request-utils";

export const proxyAgent = new HttpsProxyAgent(env.PROXY_URL);

export const axiosWithRetry = axios.create({
  httpsAgent: proxyAgent,
});

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

export async function urlScrape(url: string) {
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

export async function scrapeUrl(url: string) {
  return await axios
    .get<string>(url, { httpsAgent: proxyAgent, responseType: "text" })
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

export async function sendTextToHostTeamMembers({
  hostTeamId,
  message,
}: {
  hostTeamId: number;
  message: string;
}) {
  const hostTeamMembers = await db.query.hostTeams.findMany({
    where: eq(hostTeams.id, hostTeamId),
    with: {
      members: {
        with: {
          user: {
            columns: { phoneNumber: true },
          },
        },
      },
    },
  });
  const hostTeamMemberPhoneNumbers = hostTeamMembers.flatMap((member) =>
    member.members.map((m) => m.user.phoneNumber),
  );

  await Promise.all(
    hostTeamMemberPhoneNumbers.map((phoneNumber) =>
      sendText({ to: phoneNumber!, content: message }),
    ),
  );
}

export async function sendText({
  to,
  content,
  isProductionOnly = true,
}: {
  to: string;
  content: string;
  isProductionOnly?: boolean;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProductionOnly && !isProduction) return;
  try {
    const response = await twilio.messages.create({
      body: content,
      from: env.TWILIO_FROM,
      to,
    });

    return response;
  } catch (error) {
    // Log the error (optional, but good practice)
    console.error("Error sending text message:", error);
  }
}

export async function sendScheduledText({
  to,
  content,
  sendAt,
  isProductionOnly = true,
}: {
  to: string;
  content: string;
  sendAt: Date;
  isProductionOnly?: boolean;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProductionOnly && !isProduction) return;
  const response = await twilio.messages.create({
    body: content,
    from: env.TWILIO_FROM,
    to,
    sendAt,
    messagingServiceSid: "MG7f313e1063abc277e6503fd9c9f3ef07",
    scheduleType: "fixed",
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
  property,
  isAdmin,
  userEmail,
  hostTeamId,
}: {
  userEmail?: string;
  hostTeamId: number;
  isAdmin: boolean;
  property: Omit<
    NewProperty,
    | "id"
    | "hostTeamId"
    | "latLngPoint"
    | "city"
    | "county"
    | "stateName"
    | "stateCode"
    | "country"
    | "countryISO"
    | "bookItNowEnabled"
    | "discountTiers"
  > & {
    latLngPoint?: { x: number; y: number }; // make optional
  };
} & (
    | { isAdmin?: boolean; userEmail: string }
    | { isAdmin: true; userEmail?: undefined }
  )) {
  let lat = property.latLngPoint?.y;
  let lng = property.latLngPoint?.x;

  if (!lat || !lng) {
    // get lat lng if not provided
    const { location } = await getCoordinates(property.address);
    if (!location) throw new Error("Could not get coordinates for address");
    lat = location.lat;
    lng = location.lng;
  }

  const { city, country, countryISO, county, stateCode, stateName } =
    await getAddress({ lat, lng });

  const propertyValues = {
    ...property,
    hostTeamId,
    city,
    county,
    stateCode,
    stateName,
    country,
    countryISO,
    latLngPoint: createLatLngGISPoint({ lat, lng }),
  };

  const [insertedProperty] = await db
    .insert(properties)
    .values(propertyValues)
    .returning({ id: properties.id });

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

async function getRequestsInLast12HoursForHostTeam(tx: typeof db, hostTeamId: number) {
  if (hostTeamId === 54) {
    return [];
  }
  const propertiesForTeam = await tx.query.properties.findMany({
    where: eq(properties.hostTeamId, hostTeamId),
  });

  const requestsForProperties = await getRequestsForProperties(propertiesForTeam, { tx });
  return requestsForProperties.filter((request) => {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    return request.request.createdAt > twelveHoursAgo;
  });
}

export async function sendTextToHost({
  matchingProperties,
  request,
  tx,
}: {
  matchingProperties: { id: number; hostTeamId: number }[];
  request: Pick<Request, "checkIn" | "checkOut" | "maxTotalPrice" | "location">;
  tx: typeof db;
}) {
  const uniqueHostTeamIds = Array.from(
    new Set(matchingProperties.map((property) => property.hostTeamId)),
  );
  // Get all host team members with their contact info and lastTextAt
  const allTeamMembers = await tx.query.hostTeamMembers.findMany({
    where: inArray(hostTeamMembers.hostTeamId, uniqueHostTeamIds),
    with: {
      user: {
        columns: {
          id: true,
          lastTextAt: true,
          phoneNumber: true
        },
      },
      hostTeam: {
        columns: {
          id: true
        }
      }
    },
  });
  // Filter members who haven't been texted in last 12 hours
  const eligibleMembers = allTeamMembers.filter(member => {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    return !member.user.lastTextAt ||
      new Date(member.user.lastTextAt) < twelveHoursAgo;
  });
  // Group members by host team ID
  const membersByTeam = eligibleMembers.reduce((acc, member) => {
    acc[member.hostTeam.id] = acc[member.hostTeam.id] ?? [];
    acc[member.hostTeam.id]?.push(member.user);
    return acc;
  }, {} as Record<number, typeof eligibleMembers[0]['user'][]>);

  console.log(membersByTeam, "membersByTeam");
  // Send messages to each eligible member per team
  await Promise.all(
    Object.entries(membersByTeam).map(async ([teamId, members]) => {
      console.log(teamId, "teamId");
      const teamRequests = await getRequestsInLast12HoursForHostTeam(tx, Number(teamId));

      console.log(teamRequests, "teamRequests");

      // const numberOfNights = getNumNights(request.checkIn, request.checkOut);
      await Promise.all(members.map(async (user) => {
        console.log(user, "user");
        if (!user.phoneNumber) return;

        await sendText({
          to: user.phoneNumber,
          content: `Tramona: You have ${teamRequests.length} new requests! View: ${env.NEXTAUTH_URL}/host/requests`
        });

        console.log("sent text");

        // Update lastTextAt after sending
        await tx.update(users)
          .set({ lastTextAt: new Date() })
          .where(eq(users.id, user.id));
      }));
      console.log("sent text to all members");
    })
  );
  console.log("done");
}

export async function getRequestsForProperties(
  hostProperties: Property[],
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
    property: Property & { taxAvailable: boolean };
    request: Request & {
      traveler: Pick<
        User,
        | "firstName"
        | "lastName"
        | "name"
        | "image"
        | "location"
        | "about"
        | "dateOfBirth"
        | "id"
      >;
    };
  }[] = [];

  await Promise.all(hostProperties.map(async (property) => {
    const requestIsNearProperty = sql`
      ST_DWithin(
        ST_Transform(ST_SetSRID(requests.lat_lng_point, 4326), 3857),
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
    // requestIsNearProperties.push(requestIsNearProperty);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log(twentyFourHoursAgo, "twentyFourHoursAgo");

    const requestsForProperty = await tx.query.requests.findMany({
      where: and(
        requestIsNearProperty,
        gte(requests.checkIn, new Date()),
        gte(requests.createdAt, twentyFourHoursAgo),
        eq(requests.status, "Pending"),
        notExists(
          db
            .select()
            .from(offers)
            .where(
              and(
                eq(offers.requestId, requests.id),
                exists(
                  db
                    .select()
                    .from(properties)
                    .where(
                      and(
                        eq(properties.id, offers.propertyId),
                        eq(properties.hostTeamId, property.hostTeamId),
                      ),
                    ),
                ),
              ),
            ),
        ),
        notExists(
          db
            .select()
            .from(rejectedRequests)
            .where(
              and(
                eq(rejectedRequests.requestId, requests.id),
                eq(rejectedRequests.hostTeamId, property.hostTeamId),
              ),
            ),
        ),
        // notExists(
        //   db
        //     .select()
        //     .from(reservedDateRanges)
        //     .where(
        //       and(
        //         eq(reservedDateRanges.propertyId, property.id),
        //         or(
        //           and(
        //             gte(reservedDateRanges.start, requests.checkIn),
        //             lt(reservedDateRanges.start, requests.checkOut),
        //           ),
        //           and(
        //             gt(reservedDateRanges.end, requests.checkIn),
        //             lte(reservedDateRanges.end, requests.checkOut),
        //           ),
        //           and(
        //             lte(reservedDateRanges.start, requests.checkIn),
        //             gte(reservedDateRanges.end, requests.checkOut),
        //           ),
        //         ),
        //       ),
        //     ),
        // ),
      ),
      with: {
        madeByGroup: {
          with: {
            owner: {
              columns: {
                image: true,
                name: true,
                firstName: true,
                lastName: true,
                location: true,
                about: true,
                dateOfBirth: true,
                id: true,
              },
            },
          },
        },
      },
    });

    // Store the matched requests along with the property
    for (const request of requestsForProperty) {
      console.log(request, "request");
      //here we can  update each of the reque
      const traveler = request.madeByGroup.owner;
      const taxInfo = calculateTotalTax(property);

      propertyToRequestMap.push({
        property: {
          ...property,
          taxAvailable: taxInfo.length > 0, //// come back here
        },
        request: {
          ...request,
          traveler, // Include traveler info
        },
      });
    }
    // priceRestrictionsSQL.push(priceRestrictionSQL);
  }));
  return propertyToRequestMap;
}

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

  const userAge = await tx.query.requests
    .findFirst({
      where: eq(requests.id, req.id),
      with: {
        madeByGroup: {
          with: {
            owner: {
              columns: { dateOfBirth: true },
            },
          },
        },
      },
    })
    .then((result) => {
      if (result?.madeByGroup.owner.dateOfBirth) {
        const age = calculateAge(result.madeByGroup.owner.dateOfBirth);
        return age;
      }
      return null;
    });

  const ageRestrictionCheck = sql`CASE
        WHEN ${properties.ageRestriction} IS NULL THEN true
        WHEN ${properties.ageRestriction} IS NOT NULL AND ${sql.raw(String(userAge))} >= ${properties.ageRestriction} THEN true
        ELSE false
      END`;

  //WAITING FOR MAP PIN TO MERGE IN TO TEST THIS
  // if (req.lat != null && req.lng != null && req.radius != null) {
  // Convert radius from miles to degrees (approximate)
  const radiusInDegrees = req.radius * 1609.34;

  propertyIsNearRequest = sql`
    ST_DWithin(
      ST_Transform(ST_SetSRID(properties.lat_lng_point, 4326), 3857),
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

  const checkInDate = req.checkIn.toISOString();
  const checkOutDate = req.checkOut.toISOString();

  const conflictingPropertyIds = await tx.query.reservedDateRanges.findMany(
    {
      columns: { propertyId: true },
      where: and(
        or(
          and(
            lte(reservedDateRanges.start, checkInDate),
            gte(reservedDateRanges.end, checkInDate),
          ),
          and(
            lte(reservedDateRanges.start, checkOutDate),
            gte(reservedDateRanges.end, checkOutDate),
          ),
          and(
            gte(reservedDateRanges.start, checkInDate),
            lte(reservedDateRanges.end, checkOutDate),
          ),
        ),
      ),
    },
  );

  // Extract conflicting property IDs into an array
  const conflictingIds = conflictingPropertyIds.map(
    (item) => item.propertyId,
  );

  const numberOfNights = getNumNights(req.checkIn, req.checkOut);

  const filteredProperties = await tx.query.properties.findMany({
    where: and(
      propertyIsNearRequest,
      notInArray(properties.id, conflictingIds),
      ageRestrictionCheck,
    ),
    columns: {
      id: true,
      hostTeamId: true,
      autoOfferEnabled: true,
      discountTiers: true,
      originalListingId: true,
      hospitableListingId: true,
      offerDiscountPercentage: true,
    },
  });

  const propertiesWithValidPricing = [];

  for (const property of filteredProperties) {
    if (!property.hospitableListingId) continue; // Skip if no Hospitable listing ID

    const nightlyPrices = await fetchNightlyPrices(property.hospitableListingId, req.checkIn.toISOString(), req.checkOut.toISOString());
    if (!nightlyPrices) continue; // Skip if no pricing data available
    const offerDiscountPercentage = property.offerDiscountPercentage;
    const avgNightlyPrice = nightlyPrices.reduce((sum: number, price: number) => sum + price, 0) / nightlyPrices.length;
    const minAllowedPrice = avgNightlyPrice * (1 - offerDiscountPercentage / 100);

    if (req.maxTotalPrice / numberOfNights >= minAllowedPrice) {
      propertiesWithValidPricing.push(property);
    }
  }

  return propertiesWithValidPricing;
}

export const fetchNightlyPrices = async (listingId: string, checkIn: string, checkOut: string) => {
  const url = `https://connect.hospitable.com/api/v1/listings/${listingId}/calendar?start_date=${checkIn}&end_date=${checkOut}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}` },
  });

  console.log(response, "response");

  if (!response.ok) return null;

  const data = await response.json() as HospitableCalendarResponse;
  if (!data?.data?.dates) return null;

  // Extract nightly prices (ignoring availability)
  const nightlyPrices = data.data.dates.map((day) => day.price.amount / 100); // Convert cents to dollars

  return nightlyPrices.length ? nightlyPrices : null;
};

export const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export async function getAdminId() {
  return await db.query.users
    .findFirst({ where: eq(users.email, "info@tramona.com") })
    .then((res) => res!.id);
}

type HospitableCalendarResponse = {
  data: {
    dates: {
      date: string;
      price: {
        amount: number;
        currency: string;
      };
      availability: {
        available: boolean;
      };
    }[];
  };
};

type HostawayPriceResponse = {
  result: {
    totalBasePriceBeforeFees: number;
  };
};

export async function getPropertyCalendar(propertyId: string) {
  const now = new Date();
  const firstStartDate = now.toISOString().split("T")[0];
  const firstEndDate = new Date(now);
  firstEndDate.setDate(firstEndDate.getDate() + 365);
  const firstEndDateString = firstEndDate.toISOString().split("T")[0];

  const secondStartDate = new Date(firstEndDate);
  secondStartDate.setDate(secondStartDate.getDate() + 1);
  const secondStartDateString = secondStartDate.toISOString().split("T")[0];

  const secondEndDate = new Date(now);
  secondEndDate.setDate(now.getDate() + 539);
  const secondEndDateString = secondEndDate.toISOString().split("T")[0];

  // Construct the URL with query params for logging
  const firstBatchUrl = `https://connect.hospitable.com/api/v1/listings/${propertyId}/calendar?start_date=${firstStartDate}&end_date=${firstEndDateString}`;
  const secondBatchUrl = `https://connect.hospitable.com/api/v1/listings/${propertyId}/calendar?start_date=${secondStartDateString}&end_date=${secondEndDateString}`;

  // Log the URLs
  console.log("First request URL:", firstBatchUrl);
  console.log("Second request URL:", secondBatchUrl);

  // Make the requests
  const firstBatch = await axios.get<HospitableCalendarResponse>(
    firstBatchUrl,
    {
      headers: {
        Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
      },
    },
  );

  const secondBatch = await axios.get<HospitableCalendarResponse>(
    secondBatchUrl,
    {
      headers: {
        Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
      },
    },
  );

  const combinedPricingAndCalendarResponse = [
    ...firstBatch.data.data.dates,
    ...secondBatch.data.data.dates,
  ];
  return combinedPricingAndCalendarResponse;
}

export async function getPropertyOriginalPrice(
  property: Pick<
    Property,
    "hospitableListingId" | "originalListingPlatform" | "originalListingId"
  >,
  params: {
    checkIn: string;
    checkOut: string;
    numGuests: number;
  },
): Promise<number | undefined> {
  // Explicit return type
  try {
    if (property.originalListingPlatform === "Hospitable") {
      const formattedCheckIn = new Date(params.checkIn)
        .toISOString()
        .split("T")[0];
      const formattedCheckOut = new Date(params.checkOut)
        .toISOString()
        .split("T")[0];

      console.log("formattedCheckIn", formattedCheckIn);
      console.log("formattedCheckOut", formattedCheckOut);

      const { data } = await axios.get<HospitableCalendarResponse>(
        `https://connect.hospitable.com/api/v1/listings/${property.hospitableListingId}/calendar`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
          },
          params: {
            start_date: formattedCheckIn,
            end_date: formattedCheckOut,
          },
        },
      );

      const stayNights = data.data.dates.slice(0, -1);

      if (stayNights.length === 0) {
        return 0;
      }

      const totalPrice = stayNights.reduce((acc, date) => {
        return acc + date.price.amount;
      }, 0);

      const averagePrice = totalPrice / stayNights.length;

      console.log(averagePrice);
      return averagePrice;
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
      const originalBasePrice = data.result.totalBasePriceBeforeFees;
      return originalBasePrice;
    }
    // code for other options
  } catch (error) {
    console.error("Error fetching original price:", error);
    return undefined; // Return undefined on error
  }
}

export interface SeparatedData {
  normal: HostRequestsPageData[];
  other: HostRequestsPageData[];
}

export interface RequestsPageOfferData {
  sent: HostRequestsPageOfferData[];
}

//update spread on every fetch to keep information updated
export async function updateTravelerandHostMarkup({
  offerTotalBasePriceBeforeFees,
  offerId,
}: {
  offerTotalBasePriceBeforeFees: number;
  offerId: number;
}) {
  console.log("offerTotalBasePriceBeforeFees", offerTotalBasePriceBeforeFees);
  const travelerPrice = Math.ceil(
    offerTotalBasePriceBeforeFees * TRAVELER_MARKUP,
  );
  const hostPay = Math.ceil(offerTotalBasePriceBeforeFees * HOST_MARKUP);
  console.log("travelerPrice", travelerPrice);
  await db
    .update(offers)
    .set({
      calculatedTravelerPrice: travelerPrice,
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

export function createLatLngGISPoint({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const latLngPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;
  return latLngPoint;
}

/**
 * returns the distance in kilometers between two points
 */
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

export async function checkRequestsWithoutOffers() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const requestsWithoutOffers = await db.query.requests.findMany({
    where: and(
      lte(requests.createdAt, twentyFourHoursAgo),
      eq(requests.notifiedNoOffers, false),
      notExists(
        db.select().from(offers).where(eq(offers.requestId, requests.id)),
      ),
    ),
    with: {
      madeByGroup: {
        with: {
          owner: {
            columns: {
              phoneNumber: true,
            },
          },
        },
      },
    },
  });

  for (const request of requestsWithoutOffers) {
    const travelerPhoneNumber = request.madeByGroup.owner.phoneNumber;

    if (travelerPhoneNumber) {
      await sendText({
        to: travelerPhoneNumber,
        content: `Tramona: Your request for ${request.location} for ${request.maxTotalPrice} didn't yield any offers in the last 24 hours. Consider submitting a new request with a different price range or a broader location to increase your chances of finding a match.`,
      });
    }

    await db
      .update(requests)
      .set({ notifiedNoOffers: true })
      .where(eq(requests.id, request.id));
  }

  return requestsWithoutOffers.length; // return whatever
}

/**
 * Even though most hosts might not have a team, the simplest way to implement teams is
 * to treat everything as a team, which means treating single hosts as teams of one.
 * This function creates that initial team of one for a host.
 */
export async function createInitialHostTeam(
  user: Pick<User, "id" | "name" | "username" | "email">,
) {
  const teamName = user.name ?? user.username ?? user.email;

  const teamId = await db
    .insert(hostTeams)
    .values({ ownerId: user.id, name: teamName })
    .returning()
    .then((res) => res[0]!.id);

  await db.insert(hostTeamMembers).values({
    hostTeamId: teamId,
    userId: user.id,
    role: "Admin Access",
  });

  return teamId;
}

export async function createOrFindInitalHostTeamId(
  user: Pick<User, "id" | "name" | "username" | "email">,
) {
  const existingHostTeamWhereIsOwner = await db.query.hostTeams.findFirst({
    where: eq(hostTeams.ownerId, user.id),
  });

  if (!existingHostTeamWhereIsOwner) {
    const newTeamId = await createInitialHostTeam(user);
    return newTeamId;
  }
  return existingHostTeamWhereIsOwner.id;
}

export async function scrapeAirbnbInitialPageHelper({
  checkIn,
  checkOut,
  location,
  numGuests,
}: {
  checkIn: Date;
  checkOut: Date;
  location: string;
  numGuests: number;
}) {
  const serpUrl = getSerpUrl({
    checkIn: checkIn,
    checkOut: checkOut,
    location: location,
    numGuests: numGuests,
  });

  const numNights = getNumNights(checkIn, checkOut);

  const pageData = await scrapePage(serpUrl).then(async (unparsedData) => {
    return serpPageSchema.parse(unparsedData);
  });
  const searchResults = (
    await Promise.all(
      pageData.staysSearch.results.searchResults.map((searchResult) =>
        transformSearchResult({ searchResult, numNights, numGuests }),
      ),
    )
  ).filter(Boolean);

  // console.log("length of results:", searchResults.length);
  // console.log('result:', searchResults[0]);
  // const results = pageData.flatMap((data) => data.staysSearch.results.searchResults)
  return { data: pageData, res: searchResults };
}

export async function scrapeAirbnbPagesHelper({
  checkIn,
  checkOut,
  location,
  numGuests,
  cursors,
}: {
  checkIn: Date;
  checkOut: Date;
  location: string;
  numGuests: number;
  cursors: string[];
}) {
  const pageUrls = cursors.map((cursor) =>
    getSerpUrl({
      checkIn,
      checkOut,
      location,
      numGuests,
      cursor,
    }),
  );

  const numNights = getNumNights(checkIn, checkOut);

  return (await Promise.all(pageUrls.map(scrapePage)))
    .flatMap((data) => data.staysSearch.results.searchResults)
    .map((searchResult) =>
      transformSearchResult({ searchResult, numNights, numGuests }),
    )
    .filter(Boolean);
}

export async function getRequestsToBookForProperties(
  hostProperties: Property[],
  { user }: { user: Session["user"] },
  { tx = db } = {},
) {
  const propertyToRequestMap: {
    requestToBook: RequestsToBook & {
      traveler: Pick<
        User,
        "firstName" | "lastName" | "name" | "image" | "location" | "about"
      >;
      property: Property & { taxAvailable: boolean };
    };
  }[] = [];

  for (const property of hostProperties) {
    const requestsForProperty = await tx.query.requestsToBook.findMany({
      where: and(
        eq(requestsToBook.propertyId, property.id),
        eq(requestsToBook.userId, user.id),
        gte(requestsToBook.checkIn, new Date()),
      ),
      with: {
        madeByGroup: {
          with: {
            owner: {
              columns: {
                image: true,
                name: true,
                firstName: true,
                lastName: true,
                location: true,
                about: true,
              },
            },
          },
        },
      },
    });

    const { city, stateCode, country } = await getAddress({
      lat: property.latLngPoint.y,
      lng: property.latLngPoint.x,
    });

    const taxInfo = calculateTotalTax({ country, stateCode, city });
    console.log("taxInfo", taxInfo, city);

    for (const requestToBook of requestsForProperty) {
      const traveler = {
        name: requestToBook.madeByGroup.owner.name,
        image: requestToBook.madeByGroup.owner.image,
        firstName: requestToBook.madeByGroup.owner.firstName,
        lastName: requestToBook.madeByGroup.owner.lastName,
        location: requestToBook.madeByGroup.owner.location,
        about: requestToBook.madeByGroup.owner.about,
      };
      propertyToRequestMap.push({
        requestToBook: {
          ...requestToBook,
          traveler,
          property: {
            ...property,
            taxAvailable: taxInfo.length > 0 ? true : false, //// come back here
          },
        },
      });
    }
  }
  return propertyToRequestMap;
}

export async function getHostTeamFromProperty(propertyId: number) {
  const hostTeam = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
    columns: {
      hostTeamId: true,
    },
  });
  return hostTeam?.hostTeamId;
}

export async function addHostProfile({
  userId,
  hostawayApiKey,
  hostawayAccountId,
  hostawayBearerToken,
}: {
  userId: string;
  hostawayApiKey?: string;
  hostawayAccountId?: string;
  hostawayBearerToken?: string;
}) {
  const curUser = await db.query.users.findFirst({
    columns: { email: true, firstName: true, lastName: true },
    where: eq(users.id, userId),
  });
  if (curUser) {
    await db.insert(hostProfiles).values({
      userId,
      hostawayApiKey,
      hostawayAccountId,
      hostawayBearerToken,
    });

    await createStripeConnectId({ userId, userEmail: curUser.email });

    await sendSlackMessage({
      isProductionOnly: true,
      text: [
        "*Host Profile Created:*",
        `User ${curUser.firstName} ${curUser.lastName} has become a host`,
      ].join("\n"),
      channel: "host-bot",
    });
  }
}

export async function generateFakeUser(email: string) {
  const userDataPromise = createUserNameAndPic(1);
  const [userData] = await Promise.all([userDataPromise]);
  let firstName = "";
  let lastName = "";
  let image = "";

  if (userData[0]) {
    firstName = userData[0].name.split(" ")[0] ?? "";
    lastName = userData[0].name.split(" ")[1] ?? "";
    image = userData[0].picture;
  }
  const fakeUser = await db.insert(users).values({
    id: crypto.randomUUID(),
    email,
    isBurner: true,
    stripeCustomerId: null,
    stripeConnectId: null,
    setupIntentId: null,
    isIdentityVerified: 'false',
    isWhatsApp: false,
    role: 'guest',
    username: null,
    referralCodeUsed: null,
    referralTier: 'Partner',
    createdAt: new Date().toISOString(),
    chargesEnabled: false,
    name: null,
    phoneNumber: '+11111111111',
    firstName,
    lastName,
    image,
    dateOfBirth: '6/11/1987',
  }).returning({ id: users.id });
  return fakeUser[0]!.id;
}

