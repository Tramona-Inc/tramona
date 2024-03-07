import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  MAX_REQUEST_GROUP_SIZE,
  groupMembers,
  groups,
  requestGroups,
  requestInsertSchema,
  requestSelectSchema,
  requests,
} from "@/server/db/schema";
import { getRequestStatus } from "@/utils/formatters";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

async function createGroup({
  ownerId,
  _db = db,
}: {
  ownerId?: string;
  _db?: typeof db;
}) {
  const groupId = await _db
    .insert(groups)
    .values({})
    .returning()
    .then((res) => res[0]!.id);

  if (ownerId) {
    await _db
      .insert(groupMembers)
      .values({ groupId, userId: ownerId, isOwner: true });
  }

  return groupId;
}

export const requestsRouter = createTRPCRouter({
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    const groupedRequests = await ctx.db.query.groupMembers
      .findMany({
        where: eq(groupMembers.userId, ctx.user.id),
        with: {
          group: {
            with: {
              requests: {
                with: {
                  offers: {
                    with: {
                      property: {
                        with: {
                          host: {
                            columns: {
                              name: true,
                              email: true,
                              image: true,
                              id: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              members: {
                with: {
                  user: {
                    columns: { name: true, email: true, image: true, id: true },
                  },
                },
              },
              invites: true,
            },
          },
        },
      })

      // 1. turn the data into a nicer shape
      .then((res) =>
        res
          .map((groupMember) => {
            const {
              group: { requests, members, invites },
            } = groupMember;

            return requests.map((request) => ({
              ...request,
              groupMembers: members.map((member) => ({
                ...member.user,
                isGroupOwner: member.isOwner,
              })),
              groupInvites: invites,
            }));
          })
          .flat(1),
      )

      .then((res) => {
        const ungroupedRequests = res

          // 2. extract host images & offers count
          .map((request) => {
            const hostImages = request.offers
              .map((offer) => offer.property.host?.image)
              .filter(Boolean);

            const numOffers = request.offers.length;

            const { offers: _, ...requestExceptOffers } = request;

            return { ...requestExceptOffers, hostImages, numOffers };
          })

          // 3. sort
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
              b.createdAt.getTime() - a.createdAt.getTime(),
          );

        // 4. group
        const groupedRequests: {
          groupId: number;
          requests: typeof ungroupedRequests;
        }[] = [];

        for (const request of ungroupedRequests) {
          const group = groupedRequests.find(
            ({ groupId }) => groupId === request.requestGroupId,
          );

          if (group) {
            group.requests.push(request);
          } else {
            groupedRequests.push({
              groupId: request.requestGroupId,
              requests: [request],
            });
          }
        }

        return groupedRequests;
      });

    // 5. group by active/inactive (and put partially-active groups on active)

    const activeRequestGroups = groupedRequests.filter((group) =>
      group.requests.some((request) => request.resolvedAt === null),
    );

    const inactiveRequestGroups = groupedRequests.filter(
      (group) => !activeRequestGroups.includes(group),
    );

    // 5. all done

    return {
      activeRequestGroups,
      inactiveRequestGroups,
    };
  }),

  getAll: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.requests
      .findMany({
        with: {
          madeByGroup: {
            with: {
              members: {
                with: {
                  user: {
                    columns: {
                      name: true,
                      email: true,
                      image: true,
                      phoneNumber: true,
                      id: true,
                    },
                  },
                },
              },
              invites: true,
            },
          },
          offers: { columns: { id: true } },
        },
      })
      // doing this until drizzle adds aggregations for
      // relational queries lol
      .then((res) =>
        res
          .map((req) => {
            const { offers, madeByGroup, ...reqWithoutOffers } = req;
            return {
              ...reqWithoutOffers,
              numOffers: offers.length,
              groupMembers: madeByGroup.members.map((member) => ({
                ...member.user,
                isGroupOwner: member.isOwner,
              })),
              groupInvites: madeByGroup.invites,
            };
          })
          .sort(
            (a, b) =>
              b.numOffers - a.numOffers ||
              a.createdAt.getTime() - b.createdAt.getTime(),
          ),
      )
      .then((res) => ({
        incomingRequests: res.filter(
          (req) => getRequestStatus(req) === "pending",
        ),
        pastRequests: res.filter((req) => getRequestStatus(req) !== "pending"),
      }));
  }),

  createMultiple: protectedProcedure
    .input(
      requestInsertSchema
        .omit({ madeByGroupId: true, requestGroupId: true })
        .array()
        .max(MAX_REQUEST_GROUP_SIZE),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const requestGroupId = await tx
          .insert(requestGroups)
          .values({})
          .returning()
          .then((res) => res[0]!.id);

        const results = await Promise.allSettled(
          input.map(async (req) => {
            const madeByGroupId = await createGroup({
              ownerId: ctx.user.id,
              _db: tx,
            });

            await tx.insert(requests).values({
              ...req,
              madeByGroupId,
              requestGroupId,
            });
          }),
        );

        if (results.some((result) => result.status === "rejected")) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      });
    }),

  // resolving a request with no offers = reject

  // requests are automatically resolved when they have offers but
  // this might change in the future (e.g. "here's an offer but more are on the way")

  // Only admins can reject requests for now

  // in the future, well need to validate that a host actually received the request,
  // or else a malicious host could reject any request

  resolve: roleRestrictedProcedure(["admin"])
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(requests)
        .set({ resolvedAt: new Date() })
        .where(eq(requests.id, input.id));
    }),

  delete: protectedProcedure
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      // Only group owner and admin can delete
      // (or anyone if theres no group owner for whatever reason)

      if (ctx.user.role !== "admin") {
        const groupOwnerId = await ctx.db.query.requests
          .findFirst({
            where: eq(requests.id, input.id),
            with: {
              madeByGroup: {
                with: { members: { where: eq(groupMembers.isOwner, true) } },
              },
            },
          })
          .then((request) => request?.madeByGroup.members[0]?.userId);

        if (!groupOwnerId) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        if (ctx.user.id !== groupOwnerId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(requests).where(eq(requests.id, input.id));
    }),
});
