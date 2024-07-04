import { render } from "@react-email/render";
import nodemailler, { type TransportOptions } from "nodemailer";
import { env } from "@/env";
import { type ReactElement } from "react";
import { Twilio } from "twilio";
import { db } from "./db";
import { and, between, eq, gte, inArray, isNull, lte, sql } from "drizzle-orm";
import {
  type NewProperty,
  Request,
  type User,
  bookedDates,
  groupInvites,
  groupMembers,
  groups,
  hostTeamInvites,
  hostTeamMembers,
  properties,
  requests,
  requestsToProperties,
  users,
} from "./db/schema";
import { getCity, getCoordinates } from "./google-maps";

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
  property,
}: {
  hostId?: string | null;
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
  const city = await getCity({lat, lng});

  const [insertedProperty] = await db
    .insert(properties)
    .values({
      ...property,
      hostId,
      latitude: lat,
      longitude: lng,
      city: city,
    })
    .returning({ id: properties.id });

    async function isDateAvailable(propertyId: number, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
      const overlappingBookings = await db
        .select()
        .from(bookedDates)
        .where(
          and(
            eq(bookedDates.propertyId, propertyId),
            between(bookedDates.date, checkInDate, checkOutDate),
          ),
        )
        .limit(1);

      return overlappingBookings.length === 0;
    }

    async function getRequestsInBounds({ lat, lng }: { lat: number, lng: number }) {

        const coordinates = await getCoordinates(city);
        console.log('coordinates:', coordinates);
        if (!coordinates.bounds) {
          throw new Error("Bounds are undefined");
        }
        const { northeast, southwest } = coordinates.bounds;
        // Use address-based filtering
        if (requests.lat === null || requests.lng === null) {
          const requestCoords = await getCoordinates(requests.location);
          
        const requestIdsInBounds = await db.query.requests
          .findMany({
            where: and(
              and(
                and(
                  and(
                    gte(requests.lat, southwest.lat),
                    lte(requests.lat, northeast.lat),
                  ),
                  gte(requests.lng, southwest.lng),
                ),
                lte(requests.lng, northeast.lng),
              ),
              isNull(requests.resolvedAt),
            ),
            columns: { id: true },
          })
          .then((res) => res.map((r) => r.id));

      return requestIdsInBounds;
    }

    // Get all requests in the same bounds
    const requestIdsInBounds = await getRequestsInBounds({
      lat: lat,
      lng: lng,
    });

    // Filter requests to only include those with available dates
    const validRequests = [];

    console.log('requestIdsInBounds:', requestIdsInBounds);

    for (const requestId of requestIdsInBounds) {
      const request: Request = await db.query.requests.findOne({
        where: eq(requests.id, requestId),
        columns: { id: true, checkIn: true, checkOut: true },
      });

      console.log(insertedProperty.id, request.checkIn, request.checkOut);

      if (request) {
        const isAvailable = await isDateAvailable(insertedProperty?.id, request.checkIn, request.checkOut);
        if (isAvailable) {
          validRequests.push(request.id);
        }
      }
    }

    console.log('valid:', validRequests);

    // Insert valid requests into requestsToProperties
    if (validRequests.length > 0) {
      await db.insert(requestsToProperties)
        .values(validRequests.map((requestId) => ({ requestId, propertyId: insertedProperty!.id })));
    }

    return insertedProperty!.id;
  }