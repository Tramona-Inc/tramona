import * as bcrypt from "bcrypt";
import {
  createTRPCRouter,
  optionallyAuthedProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  emergencyContacts,
  groups,
  hostProfiles,
  profiles,
  referralCodes,
  userUpdateSchema,
  users,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import {
  censorEmail,
  censorPhoneNumber,
  generateReferralCode,
} from "@/utils/utils";
import { zodString } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { FieldConfigSchema } from "@/components/dashboard/host/profile/fieldConfig";

export const usersRouter = createTRPCRouter({
  getUser: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    return await db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });
  }),

  getOnboardingStep: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        onboardingStep: true,
      },
    });
    if (!res) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    return res.onboardingStep;
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

  /** only for use with updateUser -- use `const { updateUser } = useUpdateUser()` instead of this */
  updateProfile: protectedProcedure
    .input(userUpdateSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.user.id))
        .returning();
    }),

  updateLastTextAt: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ lastTextAt: new Date() })
        .where(eq(users.id, input.userId));
    }),

  isHost: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return false;
    const res = await ctx.db.query.hostProfiles.findFirst({
      where: eq(hostProfiles.userId, ctx.user.id),
    });
    return !!res;
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
        return "passwordless";
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

  getUserVerifications: protectedProcedure
    .input(z.object({ madeByGroupId: z.number() }))
    .query(async ({ input, ctx }) => {
      const verifications = await ctx.db.query.groups
        .findFirst({
          where: eq(groups.id, input.madeByGroupId),
          with: {
            owner: {
              columns: {
                dateOfBirth: true,
                phoneNumber: true,
                emailVerified: true,
                email: true,
              },
            },
          },
        })
        .then((res) => res?.owner);

      if (!verifications) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        ...verifications,
        censoredEmail: censorEmail(verifications.email),
        censoredPhoneNumber: censorPhoneNumber(verifications.phoneNumber!),
      };
    }),

  getMyVerifications: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;

    const verifications = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        dateOfBirth: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
      },
    });

    //if (!verifications) throw new TRPCError({ code: "NOT_FOUND" });

    return verifications;
  }),

  addEmergencyContacts: protectedProcedure
    .input(
      z.object({
        emergencyEmail: z.string(),
        emergencyPhone: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(emergencyContacts).values({
        userId: ctx.user.id,
        emergencyEmail: input.emergencyEmail,
        emergencyPhone: input.emergencyPhone,
      });
    }),

  deleteEmergencyContact: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(emergencyContacts)
        .where(eq(emergencyContacts.id, input.id));
    }),

  getEmergencyContacts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.emergencyContacts.findMany({
      where: eq(emergencyContacts.userId, ctx.user.id),
    });
  }),

  getUserByStripeConnectId: protectedProcedure
    .input(z.object({ connectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const connectID = `acct_${input.connectId}`; //add the acc_ back
      console.log(connectID);
      const curUser = await db.query.users.findFirst({
        where: eq(users.stripeConnectId, connectID),
      });
      if (!curUser) {
        throw new TRPCError({
          //throw error if user does not have connect id shouldn't happen all host host have a connectId
          message: "User does not have Connect Id ",
          code: "NOT_FOUND",
        });
      }
      {
        if (ctx.user.id !== curUser.id)
          throw new TRPCError({
            //throw error if user is not current user
            message: "Unauthorized",
            code: "UNAUTHORIZED",
          });

        return curUser;
      }
    }),

  //PROFILE RELATED STUFF
  getUserWithProfile: publicProcedure // for general audience
    .input(z.string())
    .query(async ({ input }) => {
      const userWProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, input),
        with: {
          user: true,
        },
      });
      if (!userWProfile)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exist",
        });

      return userWProfile;
    }),

  getMyUserWProfile: protectedProcedure.query(async ({ ctx }) => {
    const myProfile = await db.query.profiles
      .findFirst({
        where: eq(profiles.userId, ctx.user.id),
        with: {
          user: true,
        },
      })
      .then((res) => res!);
    return myProfile;
  }),
  updateUserImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      console.log("running");
      const updatedImage = await db
        .update(users)
        .set({
          image: input,
        })
        .where(eq(users.id, ctx.user.id))
        .returning()
        .then((res) => res[0]);
      console.log(updatedImage);
      return;
    }),
  updateProfileShowDecadeBorn: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ input, ctx }) => {
      await db
        .update(profiles)
        .set({
          showBirthDecade: input,
        })
        .where(eq(profiles.userId, ctx.user.id));
      return;
    }),

  updateProfileIntro: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await db
        .update(profiles)
        .set({
          aboutYou: input,
        })
        .where(eq(profiles.userId, ctx.user.id));
      return;
    }),
  updateUserFieldConfig: protectedProcedure
    .input(
      z.object({
        key: FieldConfigSchema,
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const field = input.key;
      await db
        .update(profiles)
        .set({
          [field]: input.description,
        })
        .where(eq(profiles.userId, ctx.user.id));
      return;
    }),
});
