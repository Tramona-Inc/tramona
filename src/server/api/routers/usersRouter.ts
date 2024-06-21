import * as bcrypt from "bcrypt";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  hostProfiles,
  hostTeamMembers,
  hostTeams,
  properties,
  propertyPMS,
  referralCodes,
  userUpdateSchema,
  users,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { db } from "@/server/db";
import { generateReferralCode } from "@/utils/utils";
import { zodString } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { number, z } from "zod";
import axios from "axios";
import { MaximizeIcon } from "lucide-react";
import { check } from "drizzle-orm/mysql-core";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        role: true,
        referralCodeUsed: true,
      },
    });

    return {
      role: res?.role ?? "guest",
      referralCodeUsed: res?.referralCodeUsed ?? null,
    };
  }),

  myVerificationStatus: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        isIdentityVerified: true,
      },
    });
    return {
      isIdentityVerified: res?.isIdentityVerified,
    };
  }),

  myPhoneNumber: protectedProcedure.query(async ({ ctx }) => {
    const phone = await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {
          phoneNumber: true,
        },
      })
      .then((res) => {
        return res?.phoneNumber ?? null;
      });

    return phone;
  }),

  myReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const referralCode = await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: {
          referralCode: true,
        },
      })
      .then((res) => res?.referralCode ?? null);

    // If no referral code genereated
    if (!referralCode) {
      const [generatedCode] = await ctx.db
        .insert(referralCodes)
        .values({ ownerId: ctx.user.id, referralCode: generateReferralCode() })
        .returning();

      return generatedCode;
    }

    return referralCode;
  }),

  updateProfile: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, input.id))
        .returning();

      return updatedUser;
    }),

  createUrlToBeHost: protectedProcedure
    .input(
      z.object({
        conversationId: zodString(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin") {
        const payload = {
          email: ctx.user.email,
          id: ctx.user.id,
        };

        // Create token
        const token = jwt.sign(payload, env.NEXTAUTH_SECRET!, {
          expiresIn: "24h",
        });

        const url = `${env.NEXTAUTH_URL}/auth/signup/host?token=${token}&conversationId=${input.conversationId}`;

        return url;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Must be admin to create URL",
        });
      }
    }),
  insertPhoneWithEmail: publicProcedure
    .input(
      z.object({
        email: z.string(),
        phone: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db
        .update(users)
        .set({ phoneNumber: input.phone })
        .where(eq(users.email, input.email));
    }),
  insertPhoneWithUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        phone: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db
        .update(users)
        .set({ phoneNumber: input.phone })
        .where(eq(users.id, input.userId));
    }),
  isHost: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.hostProfiles.findFirst({
      where: eq(hostProfiles.userId, ctx.user.id),
    });
    return { data: !!res };
  }),

  createHostProfile: protectedProcedure
    .input(
      z.object({
        hostawayAccountId: z.string().optional(),
        hostawayBearerToken: z.string().optional(),
        hostawayApiKey: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const teamId = await ctx.db
        .insert(hostTeams)
        .values({
          ownerId: ctx.user.id,
          name: `${ctx.user.name ?? ctx.user.username ?? ctx.user.email}`,
        })
        .returning()
        .then((res) => res[0]!.id);

      // Insert Host info

      await ctx.db.insert(hostTeamMembers).values({
        hostTeamId: teamId,
        userId: ctx.user.id,
      });

      const res = await ctx.db
        .insert(hostProfiles)
        .values({
          userId: ctx.user.id,
          curTeamId: teamId,
          hostawayApiKey: input.hostawayApiKey,
          hostawayAccountId: input.hostawayAccountId,
          hostawayBearerToken: input.hostawayBearerToken
        })
        .returning();



      // if(input.hostawayBearerToken) {
      //   const hostawayProperties = await axios.get(
      //     `https://api.hostaway.com/v1/listings`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${input.hostawayBearerToken}`,
      //       },
      //     },
      //   )
      //   .then((res) => res.result);

      //   await ctx.db.insert(properties).values(
      //     hostawayProperties.map((property: any) => ({
      //       hostId: ctx.user.id,
      //       propertyType: "other",
      //       roomType: property.roomType,    //need to configure theirs to ours
      //       maxNumGuests: property.personCapacity,
      //       numBeds: property.bedsNumber,
      //       numBedrooms: property.bedroomsNumber,
      //       numBathrooms: property.bathroomsNumber,
      //       latitude: property.lat,
      //       longitude: property.lng,
      //       hostName: property.contactName,
      //       checkInTime: property.checkInTimeStart,
      //       checkOutTime: property.checkOutTime,
      //       name: property.name,
      //       about: property.description,
      //       propertyPMS: "Hostaway",
      //       address: property.address,
      //       avgRating: property.starRating,
      //       hostTeamId: teamId,
      //       imageUrls: property.listingImages,

      //     }))
      //   );

      // }



      return res;
    }),

  getHostInfo: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.hostProfiles.findMany({
      columns: {
        userId: true,
        // type: true,
        becameHostAt: true,
        // profileUrl: true,
      },
      with: {
        hostUser: {
          columns: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: (user, { desc }) => [desc(user.becameHostAt)],
      limit: 10,
    });

    // Flatten the hostUser
    return res.map((item) => ({
      ...item,
      name: item.hostUser.name,
      email: item.hostUser.email,
      phoneNumber: item.hostUser.phoneNumber,
    }));
  }),

  updatePhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: zodString({ maxLen: 20 }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db
        .update(users)
        .set({
          phoneNumber: input.phoneNumber,
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updatedUser;
    }),

  phoneNumberIsTaken: protectedProcedure
    .input(
      z.object({
        phoneNumber: zodString({ maxLen: 20 }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.query.users
        .findFirst({
          columns: { id: true },
          where: eq(users.phoneNumber, input.phoneNumber),
        })
        .then((res) => !!res);
    }),

  getMyHostProfile: protectedProcedure.query(async ({ ctx }) => {
    return (
      (await ctx.db.query.hostProfiles.findFirst({
        where: eq(hostProfiles.userId, ctx.user.id),
      })) ?? null
    );
  }),

  checkCredentials: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { email, password } = input;

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        return "email not found";
      }

      if (!user.password) {
        return "incorrect credentials";
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return "incorrect password";
      }

      return "success";
    }),

  getPassword: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        password: true,
      },
    });
  }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { oldPassword, newPassword } = input;

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      if (!user.password) {
        return "user has no password";
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return "incorrect old password";
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await ctx.db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, ctx.user.id));

      return "success";
    }),
});
