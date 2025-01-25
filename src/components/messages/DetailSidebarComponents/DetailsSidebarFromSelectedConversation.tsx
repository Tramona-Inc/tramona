import React from "react";
import { type Conversation } from "@/utils/store/conversations";
import TravelerDetailsSidebar from "./TravelerDetailsSidebar";
import HostDetailsSidebar from "./HostDetailsSidebar";

interface DetailsSidebarFromSelectedConversationProps {
  conversation: Conversation;
  isHost: boolean;
}

const DetailsSidebarFromSelectedConversation: React.FC<
  DetailsSidebarFromSelectedConversationProps
> = ({ conversation, isHost }) => {
  return (
    <div className="h-full min-h-[calc(75vh)] overflow-x-hidden overflow-y-scroll bg-white">
      {isHost ? (
        <HostDetailsSidebar conversation={conversation} />
      ) : (
        <TravelerDetailsSidebar conversation={conversation} />
      )}
    </div>
  );
};

export default DetailsSidebarFromSelectedConversation;
