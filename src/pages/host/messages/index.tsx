import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
// import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";

function MessageDisplay() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const selectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  // * Allows us to open message from url query
  const [isViewed, setIsViewd] = useState(false);
  const conversations = useConversation((state) => state.conversationList);
  const { query } = useRouter();

  useEffect(() => {
    if (query.conversationId && conversations.length > 0 && !isViewed) {
      const conversationIdToSelect = query.conversationId as string;
      const conversationToSelect = conversations.find(
        (conversation) => conversation.id === conversationIdToSelect,
      );

      if (
        conversationToSelect &&
        selectedConversation?.id !== conversationToSelect.id
      ) {
        setSelectedConversation(conversationToSelect);
      }

      setIsViewd(true);
    }
  }, [conversations, isViewed, query.conversationId, selectedConversation?.id]);

  return (
    <div className="flex h-screen-minus-header-n-footer divide-x">
      <div
        className={cn(
          "w-full bg-white md:w-96",
          selectedConversation && "hidden md:block",
        )}
      >
        <MessagesSidebar
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
        />
      </div>
      <div
        className={cn(
          "flex h-full flex-1 items-center justify-center",
          !selectedConversation && "hidden md:flex",
        )}
      >
        <MessagesContent
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
        />
      </div>
    </div>
  );
}

export default function MessagePage() {
  // const { data: session } = useSession({ required: true });

  const { data: totalUnreadMessages } =
    api.messages.getNumUnreadMessages.useQuery();

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          {totalUnreadMessages && totalUnreadMessages > 0
            ? `(${totalUnreadMessages})`
            : ""}{" "}
          Messages | Tramona
        </title>
      </Head>
      <HostDashboardLayout>
        <MessageDisplay />
      </HostDashboardLayout>
    </>
  );
}
