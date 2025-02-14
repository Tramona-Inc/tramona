import { db } from "@/server/db";
import { hostTeamMembers, propertyMessages } from "@/server/db/schema";
import { sendText } from "@/server/server-utils";
import { subMinutes } from "date-fns";
import { desc, inArray, isNull } from "drizzle-orm";
import { sumBy, uniq, uniqBy } from "lodash";

export default async function handler() {
  const unreadConversations = await db.query.propertyConversations
    .findMany({
      columns: { travelerId: true },
      with: {
        property: {
          columns: {},
          with: { hostTeam: { columns: { id: true } } },
        },
        traveler: {
          columns: { id: true, phoneNumber: true, isBurner: true },
        },
        messages: {
          columns: { authorId: true, createdAt: true },
          where: isNull(propertyMessages.readAt),
          orderBy: desc(propertyMessages.createdAt),
        },
      },
    })
    .then((res) =>
      res.filter(
        (c) =>
          // convo must have 1+ unreads, the latest of which must be 5+ minutes old (to avoid sending too many texts)
          c.messages[0] && c.messages[0].createdAt >= subMinutes(new Date(), 5),
      ),
    );

  // Handle host notifications
  const hostTeamIdsWithUnreads = uniq(
    unreadConversations
      .filter((c) => c.messages[0]!.authorId === c.travelerId) // the unread message(s) are from the traveler, so we notify the hosts
      .map((c) => c.property.hostTeam.id),
  );

  const hostsWithUnreads = await db.query.hostTeamMembers.findMany({
    where: inArray(hostTeamMembers.hostTeamId, hostTeamIdsWithUnreads),
    with: {
      hostTeam: true,
      user: { columns: { id: true, phoneNumber: true } },
    },
  });

  for (const host of uniq(hostsWithUnreads.map((h) => h.user))) {
    const teams = hostsWithUnreads.filter((h) => h.user.id === host.id);

    const numUnreadMessages = sumBy(
      unreadConversations.filter((c) =>
        teams.map((t) => t.hostTeam.id).includes(c.property.hostTeam.id),
      ),
      (c) => c.messages.length,
    );

    if (teams.length === 1 && teams[0]) {
      const { hostTeam } = teams[0];
      await sendText({
        to: host.phoneNumber!,
        content: `You have ${numUnreadMessages} unread messages in ${hostTeam.name}, visit tramona.com/host/messages to view`,
      });
    } else {
      await sendText({
        to: host.phoneNumber!,
        content: `You have ${numUnreadMessages} unread messages across ${teams.length} host teams, visit tramona.com/host/messages to view`,
      });
    }
  }

  // Handle traveler notifications
  const travelersConvosWithUnreads = unreadConversations.filter(
    (c) => c.messages[0]!.authorId !== c.travelerId, // the unread message(s) are from the host(s), so we notify the traveler
  );

  const travelers = uniqBy(
    travelersConvosWithUnreads.map((c) => c.traveler),
    (t) => t.id,
  );

  for (const traveler of travelers) {
    if (!traveler.isBurner) {
      const numUnreadMessages = sumBy(
        travelersConvosWithUnreads.filter((c) => c.traveler.id === traveler.id),
        (c) => c.messages.length,
    );
    await sendText({
      to: traveler.phoneNumber!,
        content: `You have ${numUnreadMessages} unread messages, visit tramona.com/messages to view`,
      });
    }
  }
}
