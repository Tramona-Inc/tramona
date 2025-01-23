import React, { useState } from "react";
import { type Conversation } from "@/utils/store/conversations";
import { format } from "date-fns";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import RequestToBookOrBookNowPriceCard from "../../propertyPages/sidebars/priceCards/RequestToBookOrBookNowPriceCard";
import WithdrawRequestToBookDialog from "../../requests-to-book/WithdrawRequestToBookDialog";
import ImageCarousel from "../../_common/ImageCarousel";
import { XIcon } from "lucide-react";
import { useRouter } from "next/router";

interface TravelerDetailsSidebarProps {
  conversation: Conversation;
}

const TravelerDetailsSidebar: React.FC<TravelerDetailsSidebarProps> = ({
  conversation,
}) => {
  const router = useRouter();

  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const { data: currentRequestsToBookTraveler } =
    api.requestsToBook.getByPropertyId.useQuery(
      {
        propertyId: conversation.propertyId!,
        conversationParticipants: conversation.participants.map(
          (participant) => participant.id,
        ),
      },
      {
        enabled: !!conversation.propertyId,
      },
    );

  const { data: propertyInfo } = api.properties.getById.useQuery(
    {
      id: conversation.propertyId!,
    },
    {
      enabled:
        !!conversation.propertyId &&
        (!currentRequestsToBookTraveler ||
          currentRequestsToBookTraveler.length === 0),
    },
  );

  const { data: requestTraveler } = api.requests.getById.useQuery(
    {
      id: conversation.requestId!,
    },
    {
      enabled: !!conversation.requestId,
    },
  );

  const handleHideDetails = () => {
    void router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          details: "false",
        },
      },
      undefined, // This is required to keep the current URL
      { shallow: true }, // Op
    );
  };
  const bid = currentRequestsToBookTraveler?.[0];
  const request = requestTraveler;
  const property = propertyInfo ?? bid?.property;

  return (
    <>
      {(bid ?? request) && (
        <WithdrawRequestToBookDialog
          requestToBookId={(bid?.id ?? requestTraveler?.id)!}
          open={withdrawOpen}
          onOpenChange={setWithdrawOpen}
        />
      )}
      <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-md">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {property?.name ?? "Property Information"}
            </h2>
            <Button size="icon" onClick={handleHideDetails} variant="ghost">
              {" "}
              <XIcon />{" "}
            </Button>
          </div>
          {conversation.name && (
            <p className="mt-1 text-sm text-gray-500">
              Conversation ID: {conversation.id}
            </p>
          )}
        </div>

        {/* Property Section */}
        <div className="max-h-[500px] overflow-y-auto">
          {property && (
            <div className="rounded-lg border bg-gray-50 p-4">
              <ImageCarousel imageUrls={property.imageUrls} />

              {propertyInfo && (
                <>
                  <RequestToBookOrBookNowPriceCard property={propertyInfo} />
                </>
              )}
            </div>
          )}
          {(bid ?? request) && (
            <>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Check-in:</span>{" "}
                {bid?.checkIn.toLocaleDateString() ??
                  requestTraveler?.checkIn.toLocaleDateString() ??
                  "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Check-out:</span>{" "}
                {bid?.checkOut.toLocaleDateString() ??
                  requestTraveler?.checkOut.toLocaleDateString() ??
                  "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Amount:</span>{" "}
                {formatCurrency(
                  bid?.baseAmountBeforeFees ??
                    requestTraveler?.maxTotalPrice ??
                    0,
                )}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Guests:</span>{" "}
                {bid?.numGuests ?? requestTraveler?.numGuests ?? "N/A"}
              </p>

              <div className="flex justify-end">
                <Button onClick={() => setWithdrawOpen(true)}>Withdraw</Button>
              </div>
            </>
          )}
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Created At:</span>{" "}
              {format(new Date(conversation.createdAt), "MMMM dd, yyyy h:mm a")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelerDetailsSidebar;
