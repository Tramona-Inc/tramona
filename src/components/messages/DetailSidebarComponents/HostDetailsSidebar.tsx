import React, { useState } from "react";
import { type Conversation } from "@/utils/store/conversations";
import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { Property } from "@/server/db/schema";
import HostFinishRequestDialog from "../../dashboard/host/requests/city/HostFinishRequestDialog";
import HostRequestDialog from "../../dashboard/host/requests/city/HostRequestDialog";
import HostConfirmRequestDialog from "../../dashboard/host/HostConfirmRequestDialog";
import HostPropertyInfo from "./HostPropertyInfo";
import HostRequestToBookInfo from "./HostRequestToBookInfo";
import HostRequestInfo from "./HostRequestInfo";
import { HostDashboardRequest } from "../../requests/RequestCard";
import ConversationHeader from "./ConversationHeader";
import { PropertySkeletons } from "./SIdeBarSkeletons";
import GetSupportAnytime from "./GetSupportAnytime";
interface HostDetailsSidebarProps {
  conversation: Conversation;
}

const HostDetailsSidebar: React.FC<HostDetailsSidebarProps> = ({
  conversation,
}) => {
  const currentHostTeamId = useHostTeamStore(
    (state) => state.currentHostTeamId,
  );

  const [step, setStep] = useState(0);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [propertyPrices, setPropertyPrices] = useState<Record<number, string>>(
    {},
  );

  const { data: hostTeamMembers, isLoading: isLoadingHostTeamMembers } =
    api.hostTeams.getHostTeamMembers.useQuery(
      {
        hostTeamId: currentHostTeamId!,
      },
      {
        enabled: !!currentHostTeamId,
      },
    );
  const [selectedRequest, setSelectedRequest] =
    useState<HostDashboardRequest | null>(null);

  const [properties, setProperties] = useState<
    (Property & { taxAvailable: boolean })[] | null
  >(null);

  const participantIds = conversation.participants.map(
    (participant) => participant.id,
  );
  const userId =
    !isLoadingHostTeamMembers && hostTeamMembers
      ? participantIds.find(
          (participantId) =>
            !hostTeamMembers.some((member) => member.userId === participantId),
        )
      : undefined;

  // Ensure userId exists
  const userIdToUse = userId;
  // THREE CASES

  //.1 REQUEST TO BOOK
  const { data: currentRequestsToBookForHost, isLoading: isLoadingRequests } =
    api.requestsToBook.getByPropertyIdForHost.useQuery(
      {
        propertyId: conversation.propertyId!,
        conversationParticipants: conversation.participants.map(
          (participant) => participant.id,
        ),
        userId: userIdToUse,
      },
      {
        enabled: !!conversation.propertyId && !!userIdToUse,
      },
    );

  //2. PROPERTY ONLY
  const { data: propertyInfo } = api.properties.getById.useQuery(
    {
      id: conversation.propertyId!,
    },
    {
      enabled: !!conversation.propertyId,
    },
  );

  //3. CITY REQUEST
  const { data: requestHost } = api.requests.getByIdForHost.useQuery(
    {
      id: conversation.requestId!,
      hostTeamId: currentHostTeamId!,
    },
    {
      enabled: !!conversation.requestId,
    },
  );

  const bid = currentRequestsToBookForHost?.[0];
  const request = requestHost;
  const property = propertyInfo ?? bid?.property;

  return (
    <div className="mx-auto">
      {/* Header */}
      <ConversationHeader
        conversation={conversation}
        propertyName={property?.name}
        propertyId={property?.id}
      />
      <div className="mx-auto my-4 flex w-11/12 flex-col gap-y-6">
        {/* Property Section */}
        {property ? (
          <HostPropertyInfo property={property} />
        ) : (
          <PropertySkeletons />
        )}
        <HostRequestToBookInfo bid={bid} />
        <HostRequestInfo
          request={request?.request}
          properties={request?.properties}
          setSelectedRequest={setSelectedRequest}
          setDialogOpen={setDialogOpen}
          setProperties={setProperties}
        />

        {step === 0 && properties && selectedRequest && (
          <HostRequestDialog
            propertyPrices={propertyPrices}
            setPropertyPrices={setPropertyPrices}
            open={dialogOpen}
            setOpen={setDialogOpen}
            properties={properties}
            request={selectedRequest}
            setStep={setStep}
            setSelectedProperties={setSelectedProperties}
            selectedProperties={selectedProperties}
          />
        )}
        {step === 1 && properties && selectedRequest && (
          <HostConfirmRequestDialog
            request={selectedRequest}
            properties={properties}
            setStep={setStep}
            propertyPrices={propertyPrices}
            open={dialogOpen}
            setOpen={setDialogOpen}
            setPropertyPrices={setPropertyPrices}
            selectedProperties={selectedProperties}
          />
        )}
        {step === 2 && selectedRequest && (
          <HostFinishRequestDialog
            request={selectedRequest}
            open={dialogOpen}
            setOpen={setDialogOpen}
            setStep={setStep}
          />
        )}
        <GetSupportAnytime />
      </div>
    </div>
  );
};

export default HostDetailsSidebar;
