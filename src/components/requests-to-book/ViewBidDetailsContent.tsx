import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { GuestDashboardRequestToBook } from "./RequestToBookCardBadge";
import {
  CheckCircle,
  MessageCircleMore,
  CalendarDaysIcon,
  DollarSign,
  Users,
  Zap,
  Check,
  DotIcon,
} from "lucide-react";
import ConfirmationImageCarousel from "@/components/_common/ConfirmationImageCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserAvatar from "../_common/UserAvatar";
import { TRPCClientErrorLike } from "@trpc/client";
import { useRouter } from "next/router";
import { useChatWithHostTeam } from "@/utils/messaging/useChatWithHost";
import { AppRouter } from "@/server/api/root";
import { signIn } from "next-auth/react";
import {
  formatCurrency,
  formatDateString,
  formatDateStringWithDayName,
} from "@/utils/utils";

function ViewBidDetailsContent({
  requestToBook,
  openMoreDetails,
  onOpenChangeMoreDetails,
}: {
  requestToBook: GuestDashboardRequestToBook;
  openMoreDetails: boolean;
  onOpenChangeMoreDetails: (open: boolean) => void;
}) {
  const chatWithHostTeam = useChatWithHostTeam();

  const router = useRouter();
  return (
    <Dialog open={openMoreDetails} onOpenChange={onOpenChangeMoreDetails}>
      <DialogContent className="flex w-full flex-col bg-white">
        <DialogTitle className="mx-auto flex w-full items-center justify-center gap-x-3 text-center text-2xl font-semibold lg:text-3xl">
          {" "}
          <CheckCircle className="size-7 text-green-700" />
          Booking Confirmation
        </DialogTitle>
        {/* Property Information Section */}
        <div className="flex w-full max-w-3xl flex-col items-center gap-y-2">
          <p className="mx-6 text-center text-sm text-gray-600 xl:mx-8">
            Thank you for booking! Your bid has been successfully submitted. The
            host has 24 hours to respond.
          </p>
          <h2 className="mt-4 text-center text-xl font-semibold">
            {requestToBook.property.name}
          </h2>
          <div className="">
            {/* Use the new ConfirmationImageCarousel component */}
            {requestToBook.property.imageUrls.length > 0 && (
              <ConfirmationImageCarousel
                imageUrls={requestToBook.property.imageUrls}
              />
            )}
          </div>
          <div className="w-full text-left">
            <div className="w-full text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Check-in
                    </p>
                    <p className="text-base font-semibold">
                      {formatDateStringWithDayName(
                        requestToBook.checkIn.toISOString(),
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Check-out
                    </p>
                    <p className="text-base font-semibold">
                      {formatDateStringWithDayName(
                        requestToBook.checkOut.toISOString(),
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Bid Price
                    </p>
                    <p className="text-base font-semibold">
                      {formatCurrency(requestToBook.calculatedTravelerPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Guests</p>
                    <p className="text-base font-semibold">
                      {requestToBook.numGuests}
                    </p>
                  </div>
                </div>
              </div>
              <Card className="my-2 w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <StepItem
                    icon={<DotIcon className="h-6 w-6 text-primaryGreen" />}
                    title="Place More Bids"
                    description="Improve your chances of getting the best price by submitting multiple bids."
                  />
                  <StepItem
                    icon={<DotIcon className="h-6 w-6 text-primaryGreen" />}
                    title="Submit Requests"
                    description="See exclusive prices that hosts are willing to offer by submitting requests."
                  />
                  <StepItem
                    icon={<DotIcon className="h-6 w-6 text-primaryGreen" />}
                    title="Instant Booking"
                    description="If one of your bids is accepted, it will be instantly booked and all other bids will be automatically withdrawn."
                  />
                </CardContent>
              </Card>
              <div className="my-6 border border-t border-zinc-300" />
              <h2 className="">Meet your host</h2>
              <div className="flex flex-col gap-10 lg:flex-row">
                <Card className="lg:w-1/3">
                  <CardContent className="flex flex-col items-center gap-1">
                    <UserAvatar
                      size="huge"
                      name={requestToBook.property.hostName}
                      image={
                        requestToBook.property.hostProfilePic ??
                        requestToBook.property.hostTeam.owner.image
                      }
                      onClick={() =>
                        void router.push(
                          `/profile/view/${requestToBook.property.hostTeam.owner.id}`,
                        )
                      }
                    />
                    <p className="text-lg font-bold">
                      {requestToBook.property.hostName}
                    </p>
                    <p className="text-sm">Host</p>
                  </CardContent>
                </Card>
                <div className="flex h-full flex-col justify-between space-y-4">
                  <p className="text-xl font-semibold">
                    {requestToBook.property.hostTeam.owner.firstName}
                  </p>
                  <Button
                    onClick={() =>
                      chatWithHostTeam({
                        hostId: requestToBook.property.hostTeam.ownerId,
                        hostTeamId: requestToBook.property.hostTeam.id,
                        propertyId: requestToBook.propertyId,
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewBidDetailsContent;

interface StepItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function StepItem({ icon, title, description }: StepItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="mt-1 flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
