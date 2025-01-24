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
  console.log(isHost);
  return (
    <div className="min-h-[75vh] bg-white">
      {isHost ? (
        <HostDetailsSidebar conversation={conversation} />
      ) : (
        <TravelerDetailsSidebar conversation={conversation} />
      )}
    </div>
  );
};

export default DetailsSidebarFromSelectedConversation;
