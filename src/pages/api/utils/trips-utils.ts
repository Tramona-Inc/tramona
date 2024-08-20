import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { trips, tripCancellations, superhogRequests } from "@/server/db/schema";
import { cancelSuperhogReservation } from "../../../utils/superhog-utils";

export async function cancelTripByPaymentIntent({
  paymentIntentId,
  reason,
}: {
  paymentIntentId: string;
  reason: string;
}) {
  const currentTrip = await db
    .update(trips)
    .set({
      tripsStatus: "Cancelled",
    })
    .where(eq(trips.paymentIntentId, paymentIntentId))
    .returning()
    .then((res) => res[0]);

  if (!currentTrip) {
    console.log("TRIP NOT FOUND");
    return;
  }
  //add the reason in the cancellation table
  console.log("ABOUT TO CREATE CANCELLATION");
  await db.insert(tripCancellations).values({
    reason,
    tripId: currentTrip.id,
  });
  console.log("cancellation created");

  if (currentTrip.superhogRequestId) {
    //find and cancel the superhog reservation
    //find verificationId
    const superhogVerificationId = await db.query.superhogRequests.findFirst({
      columns: { superhogVerificationId: true },
      where: eq(superhogRequests.id, currentTrip.superhogRequestId),
    });

    await cancelSuperhogReservation({
      verificationId: superhogVerificationId!.superhogVerificationId,
      reservationId: currentTrip.id.toString(),
    });
  }
}
