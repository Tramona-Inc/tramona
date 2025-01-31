import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import BidConfirmationDialog from "@/components/propertyPages/BidConfirmationDialog";
import RequestToBookPage from "@/components/propertyPages/RequestToBookPage";
import { api } from "@/utils/api";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { RouterOutputs } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import ConfirmationImageCarousel from "./ConfirmationImageCarousel";

export type requestToBookWProperty =
  RouterOutputs["requestsToBook"]["getRequestToBookByPaymentIntentId"];

export default function Listings() {
  const router = useRouter();

  const { payment_intent, redirect_status } = router.query;
  const paymentIntent =
    (Array.isArray(payment_intent) ? payment_intent[0] : payment_intent) ?? "";

  const redirectStatus =
    (Array.isArray(redirect_status) ? redirect_status[0] : redirect_status) ??
    "requires_payment_method";

  const { data: requestToBookWProperty, refetch } =
    api.requestsToBook.getRequestToBookByPaymentIntentId.useQuery(
      { paymentIntentId: paymentIntent },
      {
        enabled: !!paymentIntent && router.isReady,
      },
    );

  console.log(paymentIntent);
  console.log(requestToBookWProperty);

  useEffect(() => {
    if (paymentIntent) {
      void refetch();
    }
  }, [paymentIntent, refetch]);

  useEffect(() => {
    if (requestToBookWProperty && redirectStatus !== "succeeded") {
      toast({
        title: "Payment Failed",
        description: "Please try again",
      });

      void router.push(`/`);
    }
  }, [requestToBookWProperty, redirectStatus, router]);

  console.log(paymentIntent);
  console.log(requestToBookWProperty);

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Request To Book | Tramona</title>
      </Head>
      <div className="p-4 pb-6">
        <div className="mx-auto max-w-7xl">
          {requestToBookWProperty ? (
            <RaahimsComponent requestToBookWProperty={requestToBookWProperty} />
          ) : (
            <Spinner />
          )}
        </div>
        {payment_intent && <BidConfirmationDialog isOpen={true} />}
      </div>
    </DashboardLayout>
  );
}

function RaahimsComponent({
  requestToBookWProperty,
}: {
  requestToBookWProperty: requestToBookWProperty;
}) {
  if (!requestToBookWProperty) return;

  // Extracting necessary information from requestToBookWProperty
  const {
    property,
    checkIn,
    checkOut,
    amountAfterTravelerMarkupAndBeforeFees,
  } = requestToBookWProperty;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Property Information Section */}
      <div className="mt-4 w-full max-w-3xl rounded-lg bg-white p-6 shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center flex items-center">
          <CheckCircle className="mr-2 text-green-600" />
          Booking Confirmation
        </h2>
        <p className="mt-4 text-lg text-green-600 text-center">
          <strong>Your Bid Has Been Accepted!</strong>
        </p>
        <p className="mt-2 text-lg text-gray-600 text-center">
          Thank you for booking! Your bid has been successfully submitted. The host has 24 hours to respond.
        </p>
        <div className="mt-4">
          {/* Use the new ConfirmationImageCarousel component */}
          {property.imageUrls.length > 0 && (
            <ConfirmationImageCarousel imageUrls={property.imageUrls} />
          )}
        </div>
        <div className="w-full text-left">
          <div className="text-left w-full">
            <p className="mt-4 text-lg text-gray-600 text-center">
              <strong>Property Name:</strong> {property.name}
            </p>
            <p className="mt-2 text-lg text-gray-600 text-center">
              <strong>Check-in Date:</strong>{" "}
              {new Date(checkIn).toLocaleDateString()}
            </p>
            <p className="mt-2 text-lg text-gray-600 text-center">
              <strong>Check-out Date:</strong>{" "}
              {new Date(checkOut).toLocaleDateString()}
            </p>
            <p className="mt-2 text-lg text-gray-600 text-center">
              <strong>Bid Price:</strong> $
              {amountAfterTravelerMarkupAndBeforeFees / 100}{" "}
              {/* Assuming the price is in cents */}
            </p>
            <p className="mt-4 text-lg text-gray-600">
              <strong>Next Steps:</strong>
            </p>
            <ul className="mt-2 list-inside list-disc text-gray-600 text-lg">
              <li>
                Place more bids to improve your chances of getting the best price.
              </li>
              <li>
                Submit requests to see exclusive prices that hosts are willing to
                offer.
              </li>
              <li>
                If one of your bids is accepted, it will be instantly booked and all
                other bids will be automatically withdrawn.
              </li>
            </ul>
            {/* <section>
              <h2 className="subheading border-t pb-2 pt-4">Meet your host</h2>
              <div className="flex flex-col gap-10 lg:flex-row">
                <Card className="lg:w-1/3">
                  <CardContent className="flex flex-col items-center gap-1">
                    <UserAvatar
                      size="huge"
                      name={hostName}
                      image={
                        property.hostProfilePic ?? property.hostTeam.owner.image
                      }
                      onClick={() =>
                        void router.push(`/profile/view/${hostTeamOwner?.id}`)
                      }
                    />
                    <p className="text-lg font-bold">{hostName}</p>
                    <p className="text-sm">Host</p>
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  <p className="text-lg font-semibold">Co-hosts</p>
                  <div className="flex items-center gap-4">
                    {hostTeamMembers
                      ?.filter((member) => member.id !== hostTeamOwner?.id)
                      .map((member, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <UserAvatar
                            size="md"
                            name={hostName}
                            image={member.image}
                            onClick={() =>
                              void router.push(`/profile/view/${member.id}`)
                            }
                          />
                          <p>{member.firstName}</p>
                        </div>
                      ))}
                  </div>
                  <Button
                    onClick={() =>
                      chatWithHostTeam({
                        hostId: property.hostTeam.ownerId,
                        hostTeamId: isHospitableUser
                          ? property.hostTeam.id
                          : undefined,
                        propertyId: property.id,
                      })
                        .then()
                        .catch((err: TRPCClientErrorLike<AppRouter>) => {
                          if (err.data?.code === "UNAUTHORIZED") {
                            console.log(err.data.code);
                            void signIn("google", {
                              callbackUrl: window.location.href,
                            });
                          }
                        })
                    }
                  >
                    <MessageCircleMore />
                    Message Host
                  </Button>
                </div>
              </div>
            </section> */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <div className="grid grid-cols-2 gap-2 sm:flex-row">
          <Link href="/?page=1">
            <Button className="w-full text-lg">Search More Properties</Button>
          </Link>
          <Link href="/requests?tab=bids">
            <Button className="w-full flex-1 text-lg">View My Bids</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
