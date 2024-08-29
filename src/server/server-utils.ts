import { render } from "@react-email/render";
import nodemailler, { type TransportOptions } from "nodemailer";
import { env } from "@/env";
import { type ReactElement } from "react";
import { Twilio } from "twilio";
import { db } from "./db";
import { waitUntil } from "@vercel/functions";
import { formatCurrency, getNumNights, plural } from "@/utils/utils";

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
} from "./db/schema";
import { getCity, getCoordinates } from "./google-maps";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import * as cheerio from "cheerio";
import { sendSlackMessage } from "./slack";
import { HOST_MARKUP, TRAVELER__MARKUP } from "@/utils/constants";
import { HostRequestsPageData } from "./api/routers/propertiesRouter";

export const proxyAgent = new HttpsProxyAgent(env.PROXY_URL);

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
  property: Omit<NewProperty, "id" | "city" | "latitude" | "longitude"> & {
    latitude?: number;
    longitude?: number;
  };
}) {
  let lat = property.latitude;
  let lng = property.longitude;

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
      latitude: lat,
      longitude: lng,
      city: city,
      latLngPoint: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
      hostTeamId,
    })
    .returning({ id: properties.id, latLngPoint: properties.latLngPoint });

  waitUntil(processRequests(insertedProperty!));

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

async function processRequests(
  insertedProperty: Pick<Property, "id" | "latLngPoint">,
) {
  const allRequests = await db.query.requests.findMany({});

  for (const request of allRequests) {
    const matchingProperties = await getPropertiesForRequest({
      id: request.id,
      lat: request.lat,
      lng: request.lng,
      radius: request.radius,
      location: request.location,
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      maxTotalPrice: request.maxTotalPrice,
      latLngPoint: request.latLngPoint,
      propertyLatLngPoint: insertedProperty.latLngPoint,
    });

    console.log('properties:', matchingProperties);
    const propertyIds = matchingProperties.map((property) => property.id);

    if (propertyIds.includes(insertedProperty.id)) {
      await db.insert(requestsToProperties).values({
        requestId: request.id,
        propertyId: insertedProperty.id,
      });
    }
  }
}

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

  void uniqueHostIds.filter(Boolean).map(async (hostId) => {
    const host = await db.query.users.findFirst({
      where: eq(users.id, hostId),
      columns: { name: true, email: true, phoneNumber: true },
    });
    if (host) {
      const hostPhoneNumber = host.phoneNumber;

      if (hostPhoneNumber) {
        const numberOfNights = getNumNights(checkIn, checkOut);
        // Send a text message to the host
        await sendText({
          to: hostPhoneNumber,
          content: `Tramona: There is a request for ${formatCurrency(maxTotalPrice / numberOfNights)} per night for ${plural(numberOfNights, "night")} in ${location}. You have ${plural(numHostPropertiesPerRequest[hostId] ?? 0, "eligible property", "eligible properties")}. Please click here to make a match: ${env.NEXTAUTH_URL}/host/requests`,
        });
        //TO DO SEND WHATSAPP MESSAGE
      }
    }
  });
}

export async function getPropertiesForRequest(
  req: {
    lat?: number | null;
    lng?: number | null;
    radius?: number | null;
    location: string;
    checkIn: Date;
    checkOut: Date;
    maxTotalPrice: number;
    id: number;
    latLngPoint?: { x: number; y: number } | null;
    propertyLatLngPoint?: Property["latLngPoint"];
  },
  { tx = db } = {},
) {
  let propertyIsNearRequest: SQL | undefined = sql`FALSE`;

  //WAITING FOR MAP PIN TO MERGE IN TO TEST THIS
  if (req.lat != null && req.lng != null && req.radius != null) {
    // Convert radius from miles to degrees (approximate)
    const radiusDegrees = req.radius / 69;

    propertyIsNearRequest = and(
      gte(properties.latitude, req.lat - radiusDegrees),
      lte(properties.latitude, req.lat + radiusDegrees),
      gte(properties.longitude, req.lng - radiusDegrees),
      lte(properties.longitude, req.lng + radiusDegrees),
    );
  } else {
    const coordinates = await getCoordinates(req.location);
    if (coordinates.bounds) {
      console.log("bounds", coordinates.bounds, req.location, req.maxTotalPrice);
      const { northeast, southwest } = coordinates.bounds;
      propertyIsNearRequest = sql`
        ST_Within(
          properties.lat_lng_point,
          ST_MakeEnvelope(
            ${southwest.lng}, ${southwest.lat},
            ${northeast.lng}, ${northeast.lat},
            4326
          )
        )
      `;
    } else if (coordinates.location) {
      const radiusInMiles = 10;
      const radiusInDegrees = radiusInMiles / 69.0;

      propertyIsNearRequest = sql`
        ST_DWithin(
          properties.lat_lng_point,
          ST_SetSRID(ST_MakePoint(${coordinates.location.lng}, ${coordinates.location.lat}), 4326),
          ${radiusInDegrees}
        )
      `;
    }
  }

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
