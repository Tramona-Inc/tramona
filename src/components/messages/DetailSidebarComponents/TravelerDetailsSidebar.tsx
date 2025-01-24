import React, { useState } from "react";
import { type Conversation } from "@/utils/store/conversations";
import { api } from "@/utils/api";
import { generateBookingUrl } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import WithdrawRequestToBookDialog from "../../requests-to-book/WithdrawRequestToBookDialog";
import ConversationHeader from "./ConversationHeader";
import PropertyOnlyImage from "./PropertyOnlyImage";
import { PropertySkeletons } from "./SIdeBarSkeletons";
import GetSupportAnytime from "./GetSupportAnytime";
import Link from "next/link";
import TravelerBidOrRequestSection from "./TravelerBidOrRequestSection";

interface TravelerDetailsSidebarProps {
  conversation: Conversation;
}

const TravelerDetailsSidebar: React.FC<TravelerDetailsSidebarProps> = ({
  conversation,
}) => {
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

        <div className="mx-auto my-3 flex w-11/12 flex-col gap-y-6">
          {property ? (
            <div className="">
              <PropertyOnlyImage property={property} />

              {propertyInfo && <>{/* AddRequest stuff here  */}</>}
            </div>
          ) : (
            <PropertySkeletons />
          )}
          {(bid ?? request) ? (
            <TravelerBidOrRequestSection
              bid={bid}
              request={request}
              setWithdrawOpen={setWithdrawOpen}
            />
          ) : (
            <div>
              {property && (
                <Link href={generateBookingUrl(property.id)}>
                  <Button className="w-full">Request To Book</Button>
                </Link>
              )}
            </div>
          )}
          <GetSupportAnytime />
        </div>
      </div>
    </>
  );
};

export default TravelerDetailsSidebar;
