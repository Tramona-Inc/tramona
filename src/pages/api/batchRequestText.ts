import { db } from "@/server/db";
import { offers, RequestMessageCase, requests } from "@/server/db/schema";
import { eq, lt, ne, and, isNotNull, isNull, inArray } from "drizzle-orm";
import { addHours, addMinutes, subMinutes } from "date-fns";
import { env } from "@/env";
import { sendScheduledText } from "@/server/server-utils";

type Request = {
  id: number;
  messageCase: string | null;
  location: string;
  madeByGroup: {
    owner: {
      phoneNumber: string | null;
    };
  };
};

type GroupedRequests = Record<string, Record<string, Record<string, Request[]>>>;

export default async function handler() {
  const unsentRequestTexts: Request[] = await db.query.requests.findMany({
    columns: {
      id: true,
      location: true,
      messageCase: true,
    },
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
    where: and(isNotNull(requests.messageCase), isNull(requests.messageSent), lt(requests.createdAt, subMinutes(new Date(), 3))),
  });

  const groupedByPhoneNumber = unsentRequestTexts.reduce((acc: GroupedRequests, request: Request) => {
    const phoneNumber = request.madeByGroup.owner.phoneNumber!;
    const messageCase = request.messageCase!;  // Cast messageCase to the correct type
    const location = request.location;

    // Ensure the structure exists
    if (!acc[phoneNumber]) {
      acc[phoneNumber] = {};
    }
    if (!acc[phoneNumber][location]) {
      acc[phoneNumber][location] = {};
    }
    if (!acc[phoneNumber][location][messageCase]) {
      acc[phoneNumber][location][messageCase] = [];
    }

    acc[phoneNumber][location][messageCase].push(request);

    return acc;
  }, {} as GroupedRequests);

  console.log(groupedByPhoneNumber);


  for (const phoneNumber in groupedByPhoneNumber) {
    const locations = groupedByPhoneNumber[phoneNumber];

    for (const location in locations) {
      const messageCases = locations[location];

      for (const messageCase in messageCases) {
        const requests = messageCases[messageCase];
        
        if (requests) {
          const requestIds = requests.map((request) => request.id);
          let totalMatches = 0;

          switch (messageCase) {
            case "No matches within price range":
              await sendScheduledText({
                to: phoneNumber,
                content: `Tramona: Thank you for submitting ${requests.length > 1 ? 'your requests' : 'your request'}!\n\nUnfortunately, no hosts have submitted a match for your price. But don’t worry—our team is actively searching for options that fit your needs.\n\nIs your budget flexible? We do have hosts with options in ${location}. Adjust your request if you’d like to explore other possibilities.\n\nThank you for choosing Tramona!`,
                sendAt: addHours(new Date(), 24),
              });
              break;
            case "Some close matches":
              totalMatches = await db.query.offers.findMany({
                where: inArray(offers.requestId, requestIds),
              }).then((offers) => offers.length);

              await sendScheduledText({
                to: phoneNumber,
                content: `Tramona: You have ${totalMatches} matches for your ${requests.length > 1 ? 'your requests' : 'your request'} in ${location}! Some are close to your requested price, but most are outside of it.\n\nWe’re actively working to get you more matches that align with your budget. For now, check them out at tramona.com/requests, and if you’re flexible, consider submitting a different price to see even more options!`,
                sendAt:
                  totalMatches <= 5
                    ? addMinutes(new Date(), 25)
                    : addMinutes(new Date(), 55),
              });
              break;
            case "No close matches":
              await sendScheduledText({
                to: phoneNumber,
                content: `Tramona: Thank you for submitting ${requests.length > 1 ? 'your requests' : 'your request'}!\n\nUnfortunately, no hosts have submitted a match for your price. But don't worry—our team is actively searching for options that fit your needs.\n\nIn case your budget is flexible, some hosts sent matches slightly out of your budget take a look here: ${env.NEXTAUTH_URL}/requests. We’ll notify you as soon as we find the perfect stay.\n\nIn the meantime, feel free to adjust your request if you’d like to explore other possibilities. Thank you for choosing Tramona!`,
                sendAt: addHours(new Date(), 24),
              });
              break;
            case "Many close matches":
              totalMatches = await db.query.offers.findMany({
                where: inArray(offers.requestId, requestIds),
              }).then((offers) => offers.length);

              await sendScheduledText({
                to: phoneNumber,
                content: `Tramona: You have ${totalMatches} matches for your requests in ${location}! Check them out at tramona.com/requests.`,
                sendAt:
                  totalMatches <= 5
                    ? addMinutes(new Date(), 25)
                    : addMinutes(new Date(), 55),
              });
              break;
          }
        }
      }
    }
  }
}
