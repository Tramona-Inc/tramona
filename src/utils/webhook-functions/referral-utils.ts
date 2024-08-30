import { db } from "@/server/db";
import {
  referralEarnings,
  referralCodes,
  hostReferralDiscounts,
} from "@/server/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import type { User } from "@/server/db/schema/tables/users";
import { REFERRAL_CASHBACK } from "../constants";
//we need to add a row to the referral_earnings table
//we need to check to see if the referral code has already been used by the referree and if so, skip
//to check see if the referee matches anything in the earnings table and if host_fees is null
//if so, skip
//we need to add to the numOfBookings to that refferal
export async function completeReferral({
  user,
  offerId,
}: {
  user: User;
  offerId: number;
}) {
  if (!user.referralCodeUsed) return;
  //see if the referall has been redeemed by the referree
  const previousTravelerReferralEarning =
    await db.query.referralEarnings.findFirst({
      where: and(
        isNull(referralEarnings.hostFeesSaved),
        eq(referralEarnings.refereeId, user.id),
      ),
    });

  if (previousTravelerReferralEarning) {
    console.log("Referral already redeemed");
    return;
  }
  console.log("Referral not redeemed");
  // since the referral has not been redeemed, we need to add a row to the referral_earnings table and pay out the refferer
  await db.insert(referralEarnings).values({
    referralCode: user.referralCodeUsed,
    refereeId: user.id,
    offerId: offerId,
    cashbackEarned: REFERRAL_CASHBACK,
    hostFeesSaved: null,
  });

  // update the referral code to increment the number of bookings and total earned
  await db
    .update(referralCodes)
    .set({
      numBookingsUsingCode: sql`${referralCodes.numBookingsUsingCode} + 1`,
      totalBookingVolume: sql`${referralCodes.totalBookingVolume} + ${REFERRAL_CASHBACK}`,
      curBalance: sql`${referralCodes.curBalance} + ${REFERRAL_CASHBACK}`,
    })
    .where(eq(referralCodes.referralCode, user.referralCodeUsed));
}

//complete host discount referral
export async function validateHostDiscountReferral({
  hostUserId,
}: {
  hostUserId: string;
}) {
  //we need to validate the the discount referral so the host that referrred the current hos tcan get the discount
  const curHostReferralDiscount =
    await db.query.hostReferralDiscounts.findFirst({
      where: eq(hostReferralDiscounts.refereeUserId, hostUserId),
    });
  if (!curHostReferralDiscount) return;
  //validate
  await db
    .update(hostReferralDiscounts)
    .set({
      validatedAt: new Date(),
    })
    .where(eq(hostReferralDiscounts.refereeUserId, hostUserId));

  return;
}
