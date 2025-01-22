// pages/messages/[conversationId].tsx
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import SelectedConversationSidebar from "@/components/messages/SelectedConversationSidebar";
import React from "react";

function MessageDisplay() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const { push } = useRouter();

  const selectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
    if (conversation) {
      void push({
        pathname: `/messages/${conversation.id}`,
        query: {
          conversationData: JSON.stringify(conversation),
        },
      });
    } else {
      void push("/messages", undefined, { shallow: true });
    }
  };

  // * Allows us to open message from url query
  const [isViewed, setIsViewed] = useState(true);
  const conversations = useConversation((state) => state.conversationList);
  const { query } = useRouter();
  const {
    data: fetchedConversations,
    isLoading,
    refetch,
  } = api.messages.getConversations.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    },
  );

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

      setIsViewed(true);
    }
  }, [conversations, isViewed, query.conversationId, selectedConversation?.id]);

  const MemoizedMessagesContent = useMemo(() => {
    return (
      <MessagesContent
        selectedConversation={selectedConversation}
        setSelected={selectConversation}
      />
    );
  }, [selectedConversation, selectConversation]);

  return (
    <div className="flex h-[calc(100vh-12rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
      <div
        className={cn(
          "w-full bg-white md:w-96",
          selectedConversation && "hidden md:block",
        )}
      >
        <MessagesSidebar
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
          fetchedConversations={fetchedConversations}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
      <div
        className={cn(
          "hidden h-full flex-1 items-center justify-center md:flex",
        )}
      >
        {MemoizedMessagesContent}
      </div>
      {selectedConversation &&
        (selectedConversation.propertyId ?? selectedConversation.requestId) && (
          <div className="w-1/4 border-l">
            <SelectedConversationSidebar
              conversation={selectedConversation}
              isHost={false}
            />
          </div>
        )}
    </div>
  );
}

export default function MessagePage() {
  useSession({ required: true });

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
      <DashboardLayout>
        <MessageDisplay />
      </DashboardLayout>
    </>
  );
}
