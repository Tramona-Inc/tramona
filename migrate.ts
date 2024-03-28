import { db } from "@/server/db";
import {
  groupInvites,
  groupMembers,
  groups,
  requestGroups,
  requests,
  users,
} from "@/server/db/schema";
import { sub } from "date-fns";
import { and, count, eq, exists, isNotNull, lt } from "drizzle-orm";

// isOwner -> ownerId
///////////////////////////////////////////////////////////////////////////////

// console.log(`getting group ids...`);

// const groupIds = await db.query.groups
//   .findMany({ columns: { id: true } })
//   .then((res) => res.map(({ id }) => id));

// console.log(`got ${groupIds.length} group ids`);

// for (const groupId of groupIds) {
//   const groupOwnerId = await db.query.groupMembers
//     .findFirst({
//       where: and(
//         eq(groupMembers.groupId, groupId),
//         eq(groupMembers.isOwner, true),
//       ),
//       columns: { userId: true },
//     })
//     .then((res) => res?.userId);

//   if (groupOwnerId) {
//     await db
//       .update(groups)
//       .set({ ownerId: groupOwnerId })
//       .where(eq(groups.id, groupId));
//     console.log(`updated group ${groupId}`);
//   } else {
//     await db.delete(groupMembers).where(eq(groupMembers.groupId, groupId));
//     await db.delete(groupInvites).where(eq(groupInvites.groupId, groupId));
//     await db.delete(groups).where(eq(groups.id, groupId));
//     console.log(`deleted group ${groupId}`);
//   }
// }

// requestGroups createdByUserId and createdAt
///////////////////////////////////////////////////////////////////////////////

// const allRequests = await db.query.requests.findMany({
//   with: { madeByGroup: { with: { owner: true } } },
// });

// console.log(`got ${allRequests.length} requests\n`);

// for (const request of allRequests) {
//   await db
//     .update(requestGroups)
//     .set({
//       createdByUserId: request.madeByGroup.owner?.id,
//       createdAt: request.createdAt,
//     })
//     .where(eq(requestGroups.id, request.requestGroupId));

//   console.log(`updated request ${request.id}`);
// }

///////////////////////////////////////////////////////////////////////////////

const usersWithUnconfirmedRequests = await db
  .select({
    phoneNumber: users.phoneNumber,
    isWhatsApp: users.isWhatsApp,
    numUnconfirmedRequests: count(requestGroups.id),
  })
  .from(requestGroups)
  .innerJoin(users, eq(requestGroups.createdByUserId, users.id))
  .where(
    and(
      eq(requestGroups.hasApproved, false),
      isNotNull(users.phoneNumber),
      lt(requestGroups.createdAt, sub(new Date(), { days: 1 })),
    ),
  )
  .groupBy(users.id);

console.log(usersWithUnconfirmedRequests);

///////////////////////////////////////////////////////////////////////////////

console.log(`done`);
process.exit();
