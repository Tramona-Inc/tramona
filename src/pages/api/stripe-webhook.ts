import { env } from "@/env";
import {
  createConversationWithAdmin,
  fetchConversationWithAdmin,
} from "@/server/api/routers/messagesRouter";
import { stripe } from "@/server/api/routers/stripeRouter";
import { db } from "@/server/db";
import {
  hostProfiles,
  offers,
  referralCodes,
  referralEarnings,
  requests,
  trips,
  users,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { buffer } from "micro";
import { type NextApiRequest, type NextApiResponse } from "next";
import { superhogRequests } from "../../server/db/schema/tables/superhogRequests";
import { cancelTripByPaymentIntent } from "@/pages/api/utils/trips-utils";
import { createSuperhogReservation } from "@/pages/api/utils/superhog-utils";

// ! Necessary for stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      let message = "Unkown Error";

      if (error instanceof Error) message = error.message;

      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }

    //console.log("event:", event);

    // * You can add other event types to catch
    switch (event.type) {
      case "charge.succeeded": //use to be payment_intent.succeeded
        console.log("charge.succeeded");
        const paymentIntentSucceeded = event.data.object;
        paymentIntentSucceeded.metadata.offer_id === undefined
          ? undefined
          : parseInt(paymentIntentSucceeded.metadata.offer_id);

        const user = await db.query.users.findFirst({
          where: eq(users.id, paymentIntentSucceeded.metadata.user_id!),
        });

        if (!paymentIntentSucceeded.metadata.bid_id) {
          const confirmedAt = paymentIntentSucceeded.metadata.confirmed_at;

          // Check if confirmed_at exists and is a valid date string
          if (confirmedAt && Date.parse(confirmedAt)) {
            const confirmedDate = new Date(confirmedAt);

            await db
              .update(offers)
              .set({
                acceptedAt: confirmedDate,
                paymentIntentId: paymentIntentSucceeded.id,
              })
              .where(
                eq(
                  offers.id,
                  parseInt(paymentIntentSucceeded.metadata.offer_id!),
                ),
              );

            const requestId = paymentIntentSucceeded.metadata.request_id;

            if (requestId && !isNaN(parseInt(requestId))) {
              await db
                .update(requests)
                .set({ resolvedAt: confirmedDate })
                .where(eq(requests.id, parseInt(requestId)));

              //lets test with out the propertyID
              const offer = await db.query.offers.findFirst({
                with: { request: true },
                where: eq(
                  offers.id,
                  parseInt(paymentIntentSucceeded.metadata.offer_id!),
                ),
              });

              //create trip here
              if (offer?.request) {
                const currentTrip = await db
                  .insert(trips)
                  .values({
                    checkIn: offer.checkIn,
                    checkOut: offer.checkOut,
                    numGuests: offer.request.numGuests,
                    groupId: offer.request.madeByGroupId,
                    propertyId: offer.propertyId,
                    offerId: offer.id,
                    paymentIntentId:
                      paymentIntentSucceeded.payment_intent?.toString() ?? "",
                    totalPriceAfterFees: paymentIntentSucceeded.amount,
                  })
                  .returning();

                //superhog reservation

                //creating a superhog reservation only if does not exist
                const currentSuperhogReservation =
                  await db.query.trips.findFirst({
                    where: eq(trips.superhogRequestId, superhogRequests.id),
                  });
                if (!currentSuperhogReservation) {
                  void createSuperhogReservation({
                    paymentIntentId:
                      paymentIntentSucceeded.payment_intent?.toString() ?? "",
                    propertyId: offer.propertyId,
                    userId: user!.id,
                    trip: currentTrip[0]!,
                  }); //creating a superhog reservation
                } else {
                  console.log("Superhog reservation already exists");
                }
              }
            }
          }
        } else {
          // Handle case where confirmed_at is missing or invalid
          console.error("Confirmed_at is missing or invalid.");
        }

        // const propertyID = parseInt(
        //   paymentIntentSucceeded.metadata.property_id!,
        //   10,
        // );
        // const requestID = parseInt(
        //   paymentIntentSucceeded.metadata.request_id!,
        // );
        // const property = await ({
        //   where: eq(properties.id, propertyID),
        // });
        // const request = await db.query.requests.findFirst({
        //   where: eq(requests.id, requestID),
        // });
        // const offer = await db.query.offers.findFirst({
        //   where: eq(offers.requestId, requestID),
        // });

        // const bidID = parseInt(paymentIntentSucceeded.metadata.bid_id!);
        // const bid = await db.query.bids.findFirst({
        //   where: eq(bids.id, bidID),
        // });

        //send BookingConfirmationEmail
        //Send user confirmation email
        //getting num of nights
        // const checkInDate = request?.checkIn ?? new Date(); // Use current date as default
        // const checkOutDate = request?.checkOut ?? new Date(); // Use current date as default
        // const numOfNights = getNumNights(checkInDate, checkOutDate);
        // const originalPrice = property?.originalNightlyPrice ?? 0 * numOfNights;
        // const savings =
        //   (property?.originalNightlyPrice ?? 0) - (offer?.totalPrice ?? 0);
        // const tramonaServiceFee = getTramonaFeeTotal(savings);
        // const offerIdString = await sendEmail({
        //   to: user!.email,
        //   subject: `Tramona Booking Confirmation ${property?.name}`,
        //   content: BookingConfirmationEmail({
        //     userName: user?.name ?? "",
        //     placeName: property?.name ?? "",
        //     hostName: property?.hostName ?? "",
        //     hostImageUrl: "https://via.placeholder.com/150",
        //     startDate: formatDate(request!.checkIn, "MM/dd/yyyy") ?? "",
        //     endDate: formatDate(request!.checkOut, "MM/dd/yyyy") ?? "",
        //     address: property!.address ?? "",
        //     propertyImageLink: property!.imageUrls?.[0] ?? "",
        //     tripDetailLink: `https://www.tramona.com/offers/${offers.id.name}`,
        //     originalPrice: originalPrice,
        //     tramonaPrice: offer?.totalPrice ?? 0,
        //     offerLink: `https://www.tramona.com/offers/${offer?.id.toString()}`,
        //     numOfNights: numOfNights,
        //     tramonaServiceFee: tramonaServiceFee ?? 0,
        //   }),
        // });
        // const twilioMutation = api.twilio.sendSMS.useMutation();
        // const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();

        // if (user?.isWhatsApp) {
        //   await twilioWhatsAppMutation.mutateAsync({
        //     templateId: "HXb0989d91e9e67396e9a508519e19a46c",
        //     to: paymentIntentSucceeded.metadata.phoneNumber!,
        //   });
        // } else {
        //   await twilioMutation.mutateAsync({
        //     to: paymentIntentSucceeded.metadata.phoneNumber!,
        //     msg: "Your Tramona booking is confirmed! Please see the My Trips page to access your trip information!",
        //   });
        // }

        // console.log("PaymentIntent was successful!");

        const referralCode = user?.referralCodeUsed;

        if (referralCode) {
          const offerId = parseInt(paymentIntentSucceeded.metadata.listing_id!);
          const refereeId = paymentIntentSucceeded.metadata.user_id!;

          const tramonaFee =
            parseInt(paymentIntentSucceeded.metadata.total_savings!) * 0.2;
          const cashbackMultiplier =
            user.referralTier === "Ambassador" ? 0.5 : 0.3;
          const cashbackEarned = tramonaFee * cashbackMultiplier;

          await db
            .insert(referralEarnings)
            .values({ offerId, cashbackEarned, refereeId, referralCode });

          await db
            .update(referralCodes)
            .set({
              totalBookingVolume: sql`${referralCodes.totalBookingVolume} + ${cashbackEarned}`,
              numBookingsUsingCode: sql`${referralCodes.numBookingsUsingCode} + ${1}`,
            })
            .where(eq(referralCodes.referralCode, referralCode));
        }

        // TODO
        // Add two two users to conversation
        // void addTwoUserToConversation(
        //   paymentIntentSucceeded.metadata.user_id!,
        //   paymentIntentSucceeded.metadata.host_id!,
        // );

        // ! For now will add user to admin
        if (paymentIntentSucceeded.metadata.user_id) {
          const conversationId = await fetchConversationWithAdmin(
            paymentIntentSucceeded.metadata.user_id,
          );

          // Create conversation with admin if it doesn't exist
          if (!conversationId) {
            await createConversationWithAdmin(
              paymentIntentSucceeded.metadata.user_id,
            );
          }
        }

        break;

      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;

        // * Make sure to check listing_id isnt' null
        if (checkoutSessionCompleted.metadata) {
          const listing_id = parseInt(
            checkoutSessionCompleted.metadata.listing_id!,
          );

          await db
            .update(trips)
            .set({
              checkoutSessionId: checkoutSessionCompleted.id,
            })
            .where(eq(offers.id, listing_id));
        } else {
          // console.error("Metadata or listing_id is null or undefined");
        }

        break;
      case "charge.updated":
        {
          const chargeObject = event.data.object;
          //addingt the paymentIntentId to the trips table
          await db
            .update(trips)
            .set({
              paymentIntentId: chargeObject.payment_intent?.toString(),
              checkoutSessionId: chargeObject.metadata.checkout_session_id,
              totalPriceAfterFees: chargeObject.amount,
            })
            .where(
              eq(trips.offerId, parseInt(chargeObject.metadata.listing_id!)),
            ); // setting the paymentIntentId in the trips table

          //get the new trips
          const trip = await db.query.trips.findFirst({
            where: eq(
              trips.offerId,
              parseInt(chargeObject.metadata.listing_id!),
            ),
          });
          //extract metadata from the charge object
          const propertyId = parseInt(chargeObject.metadata.property_id!);
          const userId = chargeObject.metadata.user_id!;

          //creating a superhog reservation only if does not exist
          const currentSuperhogReservation = await db.query.trips.findFirst({
            where: eq(trips.superhogRequestId, superhogRequests.id),
          });
          if (!currentSuperhogReservation && trip) {
            void createSuperhogReservation({
              paymentIntentId: chargeObject.payment_intent?.toString() ?? "",
              propertyId,
              userId,
              trip,
            }); //creating a superhog reservation
          } else {
            console.log("Superhog reservation already exists");
          }
        }
        break;
      case "charge.dispute.created":
        {
          const dispute = event.data.object;
          //find the trip by paymentItentId
          const paymentIntentId = dispute.payment_intent as string;
          await cancelTripByPaymentIntent({
            paymentIntentId,
            reason: `Dispute : ${dispute.reason}`,
          });
        }

        break;
      case "identity.verification_session.processing":
        {
          const verificationSession = event.data.object;

          const userId = verificationSession.metadata.user_id;
          //updating the users to be verified
          if (userId) {
            await db
              .update(users)
              .set({
                isIdentityVerified: "pending",
              })
              .where(eq(users.id, userId));
          }
        }
        break;
      case "identity.verification_session.verified":
        const verificationSession = event.data.object;

        const userId = verificationSession.metadata.user_id;
        //updating the users to be verified
        if (userId) {
          await db
            .update(users)
            .set({
              isIdentityVerified: "true",
            })
            .where(eq(users.id, userId));
          if (verificationSession.last_verification_report) {
            await db
              .update(users)
              .set({
                verificationReportId:
                  verificationSession.last_verification_report as string,
              })
              .where(eq(users.id, userId));
          }
          console.log("is now verified");
          //adding the users.DOB to the db
          if (verificationSession.last_verification_report) {
            //verification report has all of the data on the user such DOB/Adress and documents

            const verificationReportId = JSON.parse(
              JSON.stringify(verificationSession.last_verification_report),
            ) as string;
            console.log("This is last verification report id");
            console.log(verificationReportId);
            const verificationReport =
              await stripe.identity.verificationReports.retrieve(
                verificationReportId,
                {
                  expand: ["document.dob"],
                },
              );
            console.log("This is last verification report object");
            console.log(verificationReport.document);
            if (verificationReport.document?.dob) {
              const dob = verificationReport.document.dob;
              //formatting dob object into strin
              const day = dob.day!.toString().padStart(2, "0");
              const month = dob.month!.toString().padStart(2, "0");
              const year = dob.year!.toString();

              const dobString = `${day}/${month}/${year}`;
              await db
                .update(users)
                .set({
                  dateOfBirth: dobString,
                })
                .where(eq(users.id, userId));
            }
          }
        }
        break;

      case "identity.verification_session.requires_input": {
        // At least one of the verification checks failed
        const verificationSession = event.data.object;
        const userId = verificationSession.metadata.user_id;
        //reset the user status to false
        if (userId) {
          await db
            .update(users)
            .set({
              isIdentityVerified: "false",
            })
            .where(eq(users.id, userId));
        }

        //.reason is reason why on of the checks failed
        console.log(
          "Verification check failed Reason: " +
            verificationSession.last_error!.reason,
        );
        console.log(
          "Verification check code: " + verificationSession.last_error!.code,
        );

        // Handle specific failure reasons
        switch (verificationSession.last_error!.code) {
          case "document_unverified_other": {
            // The document was invalid
            console.log("The submitted document was unverified");
            break;
          }
          case "document_expired": {
            // The document was expired
            console.log("The submitted document was expired");
            break;
          }
          case "document_type_not_supported": {
            // document type not supported
            console.log("The given document is not supported");
            break;
          }
          default: {
            // ...
            console.log(
              "There was a submission error, please check all documents are correct.",
            );
          }
        }
      }

      case "account.external_account.created":
        //"use this for when you want an event to trigger after onboarding",

        break;

      case "account.updated":
        const account = event.data.object;

        if (account.id) {
          const stripeAccount = await stripe.accounts.retrieve(account.id);
          await db
            .update(hostProfiles)
            .set({
              chargesEnabled: stripeAccount.payouts_enabled, // fix later or true
            })
            .where(eq(hostProfiles.stripeAccountId, account.id));
        }
        break;

      default:
      // console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
