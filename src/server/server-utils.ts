import { render } from "@react-email/render";
import nodemailler, { type TransportOptions } from "nodemailer";
import { env } from "@/env";
import { type ReactElement } from "react";
import { Twilio } from "twilio";
import { db } from "./db";
import { waitUntil } from "@vercel/functions";

import {
  and,
  between,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  notExists,
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
  requestsToProperties,
  users,
} from "./db/schema";
import { getCity, getCoordinates } from "./google-maps";
import puppeteer from "puppeteer";
import { sleep } from "@/utils/utils";
import { TRPCError } from "@trpc/server";

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
  hostId,
  hostTeamId,
  property,
}: {
  hostId?: string | null;
  hostTeamId?: number | null;
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
      hostId,
      latitude: lat,
      longitude: lng,
      city: city,
      latLngPoint: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
      hostTeamId,
    })
    .returning({ id: properties.id, latLngPoint: properties.latLngPoint });

  waitUntil(processRequests(insertedProperty!));

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
      latLngPoint: request.latLngPoint,
      propertyLatLngPoint: insertedProperty.latLngPoint,
    });

    if (matchingProperties.includes(insertedProperty.id)) {
      await db.insert(requestsToProperties).values({
        requestId: request.id,
        propertyId: insertedProperty.id,
      });
    }
  }
}

export async function getPropertiesForRequest(
  req: {
    lat?: number | null;
    lng?: number | null;
    radius?: number | null;
    location: string;
    checkIn: Date;
    checkOut: Date;
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

  const result = await tx.query.properties.findMany({
    where: and(
      isNotNull(properties.hostId),
      propertyIsNearRequest,
      propertyisAvailable,
    ),
    columns: { id: true, city: true, latitude: true, longitude: true },
  });

  return result.map((p) => p.id);
}

export async function getAdminId() {
  return await db.query.users
    .findFirst({ where: eq(users.email, "info@tramona.com") })
    .then((res) => res!.id);
}

//function to scrape using the url
export async function scrapeUsingLink(url: string) {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  console.log("the pupeetter function was called");
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await sleep(2000);

    const dialogExists = await page.$('[role="dialog"]');
    if (dialogExists) {
      // If popup appears, click outside of it to dismiss
      await page.mouse.click(10, 10); // Click on a point outside the popup
    }

    await sleep(1000);

    // Extract city name above the map with a longer timeout and error handling
    const cityName = await page.evaluate(() => {
      const citySection = document.querySelector(
        "#site-content > div > div:nth-child(1) > div:nth-child(5) > div > div > div > div:nth-child(2) > section",
      );
      const cityDiv = citySection?.querySelector("div:nth-child(2)");
      console.log("The pupeeter function is working and is about to return ");
      return cityDiv!.textContent!.trim();
    });

    await page.evaluate(() => {
      const xpathResult = document.evaluate(
        '//span[contains(text(), "Reserve")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );

      const firstNode = xpathResult.singleNodeValue;
      if (firstNode && firstNode instanceof HTMLElement) {
        firstNode.parentElement?.click();
      }
    });
    await sleep(5000);

    const priceItems = await page.evaluate(() => {
      const divsWithPriceItemTestIds = Array.from(
        document.querySelectorAll('div[data-testid^="price-item"]'),
      );
      const prices = divsWithPriceItemTestIds.map((div) => {
        const testId = div.getAttribute("data-testid");
        if (testId && testId.startsWith("price-item-ACCOMMODATION")) {
          const siblingDivs = Array.from(div.parentElement?.children ?? []);
          const siblingTextContents = siblingDivs.map((sibling) =>
            sibling.textContent?.trim(),
          );
          return siblingTextContents;
        } else {
          const span = div.querySelector("span");
          return span ? span.textContent?.trim() : null;
        }
      });
      return prices.flat().filter((price) => price !== null);
    });

    const listingCardTextContent = await page.evaluate(() => {
      const listingCardSection = document.querySelector(
        '[data-section-id="LISTING_CARD"]',
      );
      if (!listingCardSection) return [];

      const textContents = [];
      for (const child of listingCardSection.children) {
        textContents.push(child.textContent);
      }
      return textContents.filter(Boolean);
    });

    await browser.close();

    const totalPrice = Number(
      priceItems.slice(-1)[0]?.replace("$", "").replace(",", "").trim(),
    );
    const numDaysStr = priceItems[0]?.split(" ")[0]; // Get the number of nights
    const numDays = Number(numDaysStr);
    if (isNaN(numDays)) {
      throw new Error("Failed to extract number of days from price items");
    }
    const nightlyPrice = totalPrice / numDays;
    const formattedNightlyPrice = Math.round(nightlyPrice * 100);
    const propertyName =
      listingCardTextContent[0]?.substring(0, 255) ?? "Airbnb Property";
    const checkIn = new Date(searchParams.get("check_in")!);
    const checkOut = new Date(searchParams.get("check_out")!);
    const numGuests = Number(searchParams.get("adults"));
    const response = {
      cityName,
      formattedNightlyPrice,
      propertyName,
      checkIn,
      checkOut,
      numGuests,
    };
    return response;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
