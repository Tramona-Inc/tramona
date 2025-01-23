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
    <>
      {isHost ? (
        <HostDetailsSidebar conversation={conversation} />
      ) : (
        <TravelerDetailsSidebar conversation={conversation} />
      )}
    </>
  );
};

export default DetailsSidebarFromSelectedConversation;
