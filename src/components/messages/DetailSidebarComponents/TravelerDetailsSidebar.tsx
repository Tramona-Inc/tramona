import React, { useState } from "react";
import { type Conversation } from "@/utils/store/conversations";
import { format } from "date-fns";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import RequestToBookOrBookNowPriceCard from "../../propertyPages/sidebars/priceCards/RequestToBookOrBookNowPriceCard";
import WithdrawRequestToBookDialog from "../../requests-to-book/WithdrawRequestToBookDialog";
import ConversationHeader from "./ConversationHeader";
import { useRouter } from "next/router";
import PropertyOnlyImage from "./PropertyOnlyImage";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertySkeletons } from "./SIdeBarSkeletons";

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
      <div className="mx-auto">
        {/* Header */}
        <ConversationHeader
          conversation={conversation}
          propertyName={property?.name}
          propertyId={property?.id}
        />
        {/* Property Section */}

        <div className="mx-auto my-3 w-11/12 overflow-y-auto">
          {property ? (
            <div className="">
              <PropertyOnlyImage property={property} />

              {propertyInfo && <>{/* AddRequest stuff here  */}</>}
            </div>
          ) : (
            <PropertySkeletons />
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
        </div>
      </div>
    </>
  );
};

export default TravelerDetailsSidebar;
