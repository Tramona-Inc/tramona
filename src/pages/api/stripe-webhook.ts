import { BookingConfirmationEmail } from "@/components/email-templates/BookingConfirmationEmail";
import { env } from "@/env";
import {
  createConversationWithAdmin,
  fetchConversationWithAdmin,
} from "@/server/api/routers/messagesRouter";
import { stripe } from "@/server/api/routers/stripeRouter";
import { db } from "@/server/db";
import {
  offers,
  properties,
  referralCodes,
  referralEarnings,
  requests,
  users,
} from "@/server/db/schema";
import { sendEmail } from "@/server/server-utils";
import { api } from "@/utils/api";
import { getNumNights, getTramonaFeeTotal } from "@/utils/utils";
import { formatDate } from "date-fns";
import { eq, sql } from "drizzle-orm";
import { buffer } from "micro";
import { type NextApiRequest, type NextApiResponse } from "next";

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
    console.log("atleast we got a request");
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

    // * You can add other event types to catch
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        await db
          .update(offers)
          .set({
            acceptedAt: new Date(paymentIntentSucceeded.metadata.confirmed_at!),
            paymentIntentId: paymentIntentSucceeded.id,
          })
          .where(
            eq(
              offers.id,
              parseInt(paymentIntentSucceeded.metadata.listing_id!),
            ),
          );

        await db
          .update(requests)
          .set({
            resolvedAt: new Date(paymentIntentSucceeded.metadata.confirmed_at!),
          })
          .where(
            eq(
              requests.id,
              parseInt(paymentIntentSucceeded.metadata.request_id!),
            ),
          );

        const user = await db.query.users.findFirst({
          where: eq(users.id, paymentIntentSucceeded.metadata.user_id!),
        });

        const propertyID = parseInt(
          paymentIntentSucceeded.metadata.property_id!,
          10,
        );
        const property = await db.query.properties.findFirst({
          where: eq(properties.id, propertyID),
        });
        const requestID = parseInt(paymentIntentSucceeded.metadata.request_id!);
        const request = await db.query.requests.findFirst({
          where: eq(requests.id, requestID),
        });
        const offer = await db.query.offers.findFirst({
          where: eq(offers.requestId, requestID),
        });

        //send BookingConfirmationEmail
        //Send user confirmation email
        //getting num of nights
        const checkInDate = request?.checkIn ?? new Date(); // Use current date as default
        const checkOutDate = request?.checkOut ?? new Date(); // Use current date as default
        const numOfNights = getNumNights(checkInDate, checkOutDate);
        const originalPrice = property?.originalNightlyPrice ?? 0 * numOfNights;
        const savings =
          (property?.originalNightlyPrice ?? 0) - (offer?.totalPrice ?? 0);
        const tramonaServiceFee = getTramonaFeeTotal(savings);
        const offerIdString = await sendEmail({
          to: user!.email,
          subject: `Tramona Booking Confirmation ${property?.name}`,
          content: BookingConfirmationEmail({
            userName: user?.name ?? "",
            placeName: property?.name ?? "",
            hostName: property?.hostName ?? "",
            hostImageUrl: "https://via.placeholder.com/150",
            startDate: formatDate(request!.checkIn, "MM/dd/yyyy") ?? "",
            endDate: formatDate(request!.checkOut, "MM/dd/yyyy") ?? "",
            address: property!.address ?? "",
            propertyImageLink: property!.imageUrls?.[0] ?? "",
            tripDetailLink: `https://www.tramona.com/offers/${offers.id.name}`,
            originalPrice: originalPrice,
            tramonaPrice: offer?.totalPrice ?? 0,
            offerLink: `https://www.tramona.com/offers/${offer?.id.toString()}`,
            numOfNights: numOfNights,
            tramonaServiceFee: tramonaServiceFee ?? 0,
          }),
        });
        const twilioMutation = api.twilio.sendSMS.useMutation();
        const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();

        if (user?.isWhatsApp) {
          await twilioWhatsAppMutation.mutateAsync({
            templateId: "HXb0989d91e9e67396e9a508519e19a46c",
            to: paymentIntentSucceeded.metadata.phoneNumber!,
          });
        } else {
          await twilioMutation.mutateAsync({
            to: paymentIntentSucceeded.metadata.phoneNumber!,
            msg: "Your Tramona booking is confirmed! Please see the My Trips page to access your trip information!",
          });
        }

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

        if (checkoutSessionCompleted.metadata?.user_id) {
          // * Insert Stripe Customer Id after session is completed
          const stripeCustomerId = await db.query.users
            .findFirst({
              columns: {
                stripeCustomerId: true,
              },
              where: eq(users.id, checkoutSessionCompleted.metadata.user_id),
            })
            .then((res) => res?.stripeCustomerId);

          if (!stripeCustomerId) {
            await db
              .update(users)
              .set({
                stripeCustomerId: checkoutSessionCompleted.customer as string,
              })
              .where(eq(users.id, checkoutSessionCompleted.metadata.user_id));
          }
        }

        // * Make sure to check listing_id isnt' null
        if (
          checkoutSessionCompleted.metadata &&
          checkoutSessionCompleted.metadata.listing_id !== null
        ) {
          const listing_id = parseInt(
            checkoutSessionCompleted.metadata.listing_id!,
          );

          await db
            .update(offers)
            .set({
              checkoutSessionId: checkoutSessionCompleted.id,
            })
            .where(eq(offers.id, listing_id));

          // console.log("Checkout session was successful!");
        } else {
          // console.error("Metadata or listing_id is null or undefined");
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
            console.log("This is last verification report id");
            console.log(verificationSession.last_verification_report);

            //verification report has all of the data on the user such DOB/Adress and documents
            const verificationReport =
              await stripe.identity.verificationReports.retrieve(
                verificationSession.last_verification_report.toString(),
                {
                  expand: ["document.dob"],
                },
              );
            console.log("This is last verification report object");
            console.log(verificationReport.document);
            if (verificationReport.document?.dob) {
              const dob = verificationReport.document?.dob;
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

      default:
      // console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
