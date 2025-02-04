import { env } from "@/env";
import { stripe } from "@/server/api/routers/stripeRouter";
import { db } from "@/server/db";
import {
  offers,
  requests,
  properties,
  trips,
  tripCheckouts,
  users,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { buffer } from "micro";
import { type NextApiRequest, type NextApiResponse } from "next";
import { superhogRequests } from "../../server/db/schema/tables/superhogRequests";
import {
  cancelTripByPaymentIntent,
  captureTripPaymentWithoutSuperhog,
  sendEmailAndWhatsupConfirmation,
  TripWCheckout,
  updateICalAfterBookingTrip,
} from "@/utils/webhook-functions/trips-utils";
import { createSuperhogReservation } from "@/utils/webhook-functions/superhog-utils";
import {
  completeReferral,
  validateHostDiscountReferral,
} from "@/utils/webhook-functions/referral-utils";
import {
  createSetupIntent,
  getRequestIdByOfferId,
  finalizeTrip,
  createRequestToBook,
  withdrawOverlappingOffersAndRequestsToBook,
} from "@/utils/webhook-functions/stripe-utils";
import { sendSlackMessage } from "@/server/slack";
import { formatDateMonthDay } from "@/utils/utils";
import { breakdownPaymentByOffer } from "@/utils/payment-utils/paymentBreakdown";
import { createConversationWithHostOrAdminTeam } from "@/server/api/routers/messagesRouter";

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
        console.log(event.data.object);
        const paymentIntentSucceeded = event.data.object;

        const isChargedWithSetupIntent = //check if this charge was from damages or setup intent to skip the rest of the code
          paymentIntentSucceeded.metadata.is_charged_with_setup_intent ===
          "true"
            ? true
            : false;

        const isDirectListingCharge = //check if we are using direct listing price model to skip superhog
          paymentIntentSucceeded.metadata.is_direct_listing === "true"
            ? true
            : false;

        const offerId =
          paymentIntentSucceeded.metadata.offer_id === undefined //test to make sure its actually undefined lates
            ? undefined
            : parseInt(paymentIntentSucceeded.metadata.offer_id);

        if (isChargedWithSetupIntent) return;
        console.log(
          "This is a setup intent charge, we do not need to do anything here",
        );
        const user = await db.query.users.findFirst({
          where: eq(users.id, paymentIntentSucceeded.metadata.user_id!),
        });

        const confirmedAt = paymentIntentSucceeded.metadata.confirmed_at;

        // Check if confirmed_at exists and is a valid date string
        if (confirmedAt && Date.parse(confirmedAt)) {
          const confirmedDate = new Date(confirmedAt);

          const currentProperty = await db.query.properties.findFirst({
            where: eq(
              properties.id,
              parseInt(paymentIntentSucceeded.metadata.property_id!),
            ),
            with: { hostTeam: true },
          });

          //<------- Setup Intent for future charge ---->

          await createSetupIntent({
            customerId: user!.stripeCustomerId!,
            paymentMethodId: paymentIntentSucceeded.payment_method!,
            userId: user!.id,
          });

          const paymentIntentId =
            paymentIntentSucceeded.payment_intent?.toString();

          if (!paymentIntentId) {
            throw new Error(`paymentIntentId is null for userId  ${user?.id}`);
          }
          console.log("hi");

          // --------- 3 Cases: 1. Book it now, 2.Request to book,  3. Offer  ---------------------------------------

          //1 . CASE : Book it now
          if (paymentIntentSucceeded.metadata.type === "bookItNow") {
            console.log(paymentIntentId);
            await finalizeTrip({
              paymentIntentId,
              numOfGuests: parseInt(
                paymentIntentSucceeded.metadata.num_of_guests!,
              ),
              calculatedTravelerPrice: parseInt(
                paymentIntentSucceeded.metadata.calculated_traveler_price!,
              ),
              additionalFeesFromWebhook: parseInt(
                paymentIntentSucceeded.metadata.additional_fees ?? "0",
              ),
              checkIn: new Date(paymentIntentSucceeded.metadata.check_in!),
              checkOut: new Date(paymentIntentSucceeded.metadata.check_out!),
              propertyId: parseInt(
                paymentIntentSucceeded.metadata.property_id!,
              ),
              userId: paymentIntentSucceeded.metadata.user_id!,
              isDirectListingCharge,
              source: "Book it now",
            });
            // 2.  CASE : "RequestToBook"
          } else if (paymentIntentSucceeded.metadata.type === "requestToBook") {
            //not charging user or creating a superhog
            console.log("hi");
            await createRequestToBook({
              paymentIntentId,
              numOfGuests: parseInt(
                paymentIntentSucceeded.metadata.num_of_guests!,
              ),
              calculatedTravelerPrice: parseInt(
                paymentIntentSucceeded.metadata.calculated_traveler_price!,
              ),
              additionalFeesFromWebhook: parseInt(
                paymentIntentSucceeded.metadata.additional_fees ?? "0",
              ),
              checkIn: new Date(paymentIntentSucceeded.metadata.check_in!),
              checkOut: new Date(paymentIntentSucceeded.metadata.check_out!),
              propertyId: parseInt(
                paymentIntentSucceeded.metadata.property_id!,
              ),
              userId: paymentIntentSucceeded.metadata.user_id!,
              isDirectListingCharge,
            });
          } else if (paymentIntentSucceeded.metadata.type === "offer") {
            // 3. Case: "OFFER"
            if (offerId) {
              await db
                .update(offers)
                .set({
                  acceptedAt: confirmedDate,
                  status: "Accepted",
                })
                .where(eq(offers.id, offerId));

              const requestId = await getRequestIdByOfferId(offerId); // get request by offer

              if (requestId) {
                await db
                  .update(requests)
                  .set({ resolvedAt: confirmedDate, status: "Resolved" })
                  .where(eq(requests.id, requestId));
              }

              const offer = await db.query.offers
                .findFirst({
                  with: {
                    request: { columns: { latLngPoint: false } },
                    property: {
                      columns: {
                        originalNightlyPrice: true,
                        city: true,
                        county: true,
                        stateName: true,
                        stateCode: true,
                        country: true,
                        currentSecurityDeposit: true,
                      },
                    },
                  },
                  where: eq(offers.id, offerId),
                })
                .then((res) => res!);

              const priceBreakdown = breakdownPaymentByOffer(offer);

              const tripCheckout = await db
                .insert(tripCheckouts)
                .values({
                  paymentIntentId,
                  calculatedTravelerPrice: offer.calculatedTravelerPrice,
                  totalTripAmount: priceBreakdown.totalTripAmount,
                  taxesPaid: priceBreakdown.taxesPaid,
                  superhogFee: priceBreakdown.superhogFee,
                  stripeTransactionFee: priceBreakdown.stripeTransactionFee,
                  totalSavings: priceBreakdown.totalSavings,
                  securityDeposit: offer.property.currentSecurityDeposit,
                })
                .returning()
                .then((r) => r[0]!);

              const currentTrip = await db
                .insert(trips)
                .values({
                  checkIn: offer.checkIn,
                  checkOut: offer.checkOut,
                  numGuests: offer.request?.numGuests ?? 0,
                  groupId: offer.request?.madeByGroupId ?? 0,
                  propertyId: offer.propertyId,
                  offerId: offer.id,
                  paymentIntentId,
                  totalPriceAfterFees: paymentIntentSucceeded.amount,
                  tripCheckoutId: tripCheckout.id,
                })
                .returning()
                .then((res) => res[0]!);

              const currentTripWCheckout: TripWCheckout = {
                ...currentTrip,
                tripCheckout,
              };

              // rejecting overlapping offers
              await withdrawOverlappingOffersAndRequestsToBook({
                propertyId: offer.propertyId,
                checkIn: offer.checkIn,
                checkOut: offer.checkOut,
                excludeOfferId: offerId,
              });

              //<___creating a superhog  oreservationnly if does not exist__>

              const currentSuperhogReservation = await db.query.trips.findFirst(
                {
                  where: eq(trips.superhogRequestId, superhogRequests.id),
                },
              );

              if (!currentSuperhogReservation && !isDirectListingCharge) {
                await createSuperhogReservation({
                  paymentIntentId:
                    paymentIntentSucceeded.payment_intent?.toString() ?? "",
                  propertyId: offer.propertyId,
                  userId: user!.id,
                  trip: currentTrip,
                }); //creating a superhog reservation
              } else {
                if (isDirectListingCharge) {
                  await captureTripPaymentWithoutSuperhog({
                    paymentIntentId:
                      paymentIntentSucceeded.payment_intent?.toString() ?? "",
                    propertyId: offer.propertyId,
                    trip: currentTrip,
                  });
                } else {
                  console.log("Superhog reservation already exists");
                }
              }
              // <----- ICAL ----->
              await updateICalAfterBookingTrip(currentTripWCheckout);
              //<<--------------------->>

              //send email and whatsup (whatsup is not implemented yet)
              console.log("Sending email and whatsup");
              await sendEmailAndWhatsupConfirmation({
                trip: currentTripWCheckout,
                user: user!,
                property: currentProperty!,
              });
              //redeem the traveler and host refferal code
              if (user?.referralCodeUsed) {
                await completeReferral({ user: user, offerId: offer.id });
              }
              //validate the host discount referral
              if (currentProperty?.hostTeam.ownerId) {
                await validateHostDiscountReferral({
                  hostUserId: currentProperty.hostTeam.ownerId,
                });
              }
              if (paymentIntentSucceeded.metadata.user_id) {
                await createConversationWithHostOrAdminTeam(
                  paymentIntentSucceeded.metadata.user_id,
                  currentProperty!.hostTeam.id,
                  currentProperty!.id,
                );
              }
              // ------ Send Slack When trip is booked ------
              await sendSlackMessage({
                isProductionOnly: true,
                channel: "tramona-bot",
                text: [
                  `*${user?.email} just booked a trip: ${currentProperty?.name}*`,
                  `*${currentProperty?.city}*`,
                  `through ${isDirectListingCharge ? "a different platform (direct listing)" : "Tramona"} · ${formatDateMonthDay(offer.checkIn)}-${formatDateMonthDay(offer.checkOut)}`,
                  `<https://tramona.com/admin|Go to admin dashboard>`,
                ].join("\n"),
              });
            }
          } else {
            console.log("Unhandled payment intent type or missing offerId");
            await sendSlackMessage({
              text: "UNHANDLED PAYMENT: Trip type could not be determined",
            });
            return;
          }
        }
        break;

      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;

        // // * Make sure to check listing_id isnt' null
        // if (checkoutSessionCompleted.metadata) {
        //   const listing_id = parseInt(
        //     checkoutSessionCompleted.metadata.listing_id!,
        //   );

        //   await db
        //     .update(tripCheckouts)
        //     .set({
        //       checkoutSessionId: checkoutSessionCompleted.id,
        //     })
        //     .where(eq(offers.id, listing_id));
        // } else {
        //   // console.error("Metadata or listing_id is null or undefined");
        // }

        break;
      case "charge.updated":
        {
          const chargeObject = event.data.object;
          // console.log("this is the chargeObject", chargeObject);
          // //addingt the paymentIntentId to the trips table

          // const isChargedBySetupIntent =
          //   chargeObject.metadata.is_charged_with_setup_intent === "true"
          //     ? true
          //     : false;
          // if (isChargedBySetupIntent) return;
          // const curTripWithCheckout = await db
          //   .update(trips)
          //   .set({
          //     paymentIntentId: chargeObject.payment_intent?.toString(),

          //     totalPriceAfterFees: chargeObject.amount,
          //   })
          //   .where(
          //     eq(trips.offerId, parseInt(chargeObject.metadata.listing_id!)),
          //   )
          //   .returning()
          //   .then((res) => res[0]!); // setting the paymentIntentId in the trips table

          // //update tripCheckouts table
          // await db
          //   .update(tripCheckouts)
          //   .set({
          //     checkoutSessionId: chargeObject.metadata.checkout_session_id,
          //     paymentIntentId: chargeObject.payment_intent?.toString(),
          //   })
          //   .where(eq(tripCheckouts.id, curTripWithCheckout.tripCheckoutId!));

          // //get the new trips
          // const trip = await db.query.trips.findFirst({
          //   where: eq(
          //     trips.offerId,
          //     parseInt(chargeObject.metadata.listing_id!),
          //   ),
          // });
          // //extract metadata from the charge object
          // const propertyId = parseInt(chargeObject.metadata.property_id!);
          // const userId = chargeObject.metadata.user_id!;

          // //creating a superhog reservation only if does not exist
          // const currentSuperhogReservation = await db.query.trips.findFirst({
          //   where: eq(trips.superhogRequestId, superhogRequests.id),
          // });
          // if (!currentSuperhogReservation && trip) {
          //   await createSuperhogReservation({
          //     paymentIntentId: chargeObject.payment_intent?.toString() ?? "",
          //     propertyId,
          //     userId,
          //     trip,
          //   }); //creating a superhog reservation
          // } else {
          //   console.log("Superhog reservation already exists");
          // }
        }
        break;
      case "charge.dispute.created":
        {
          console.log("dispute event", event.data.object);

          const dispute = event.data.object;
          //find the trip by paymentItentId
          const paymentIntentId = dispute.payment_intent as string;
          await cancelTripByPaymentIntent({
            paymentIntentId,
            reason: `Youdispute has been report : ${dispute.reason}`,
          });
          //now we need to send an email cancelling the trip
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
          console.log("Stripe account updated", stripeAccount);
          await db
            .update(users)
            .set({
              chargesEnabled: stripeAccount.payouts_enabled, // fix later or true
            })
            .where(eq(users.stripeConnectId, account.id));
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
