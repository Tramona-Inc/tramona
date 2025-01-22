// pages/host/messages/[id].tsx
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import SelectedConversationSidebar from "@/components/messages/SelectedConversationSidebar";
import { SkeletonText } from "@/components/ui/skeleton";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import { Button } from "@/components/ui/button";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { useSession } from "next-auth/react";
import { useIsMd } from "@/utils/utils";

function MessageDisplay() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  // **Adopt Mobile Sidebar State from Host Index Page **
  const [showMobileSelectedSidebar, setShowMobileSelectedSidebar] =
    useState(true);

  const [showSelectedSidebar, setShowSelectedSidebar] = useState(false);

  const { push, query } = useRouter();

  const selectConversation = useCallback(
    (conversation: Conversation | null) => {
      setSelectedConversation(conversation);
      // **Adopt Sidebar Toggling Logic from Host Index Page **
      setShowMobileSelectedSidebar(false);
      setShowSelectedSidebar(false);

      if (conversation) {
        void push({
          pathname: `/host/messages/${conversation.id}`, // **Updated Path for Host Messages**
          query: {
            conversationData: JSON.stringify(conversation),
          },
        });
      } else {
        void push("/host/messages"); // **Updated Path for Host Messages**
      }
    },
    [push],
  );

  // **Adopt Sidebar Toggling Functions from Host Index Page **
  const toggleMobileSelectedSidebar = () => {
    setShowMobileSelectedSidebar((prev) => !prev);
  };

  const toggleSelectedSidebar = () => {
    setShowSelectedSidebar((prev) => !prev);
  };

  const conversations = useConversation((state) => state.conversationList);
  const { currentHostTeamId } = useHostTeamStore(); // Get hostTeamId
  const {
    data: fetchedConversations,
    isLoading: isSidebarLoading,
    refetch,
  } = api.messages.getConversations.useQuery({
    hostTeamId: currentHostTeamId, // **Pass hostTeamId to fetch host conversations**
  });
  const isMd = useIsMd();

  useEffect(() => {
    if (query.conversationId && conversations.length > 0) {
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
    }
  }, [conversations, query.conversationId, selectedConversation?.id]);

  return (
    <div className="flex h-[calc(100vh-12rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
      {/* Messages Sidebar - **Layout from Host Index Page** */}
      <div
        className={cn(
          "w-full bg-white md:w-1/3 xl:w-96",
          !showSelectedSidebar && "md:block", // **Conditional Visibility from Host Index**
        )}
      >
        {isSidebarLoading ? (
          <div className="space-y-4 p-4">
            <SkeletonText className="w-full" />
            <SkeletonText className="w-2/3" />
            <SkeletonText className="w-1/2" />
          </div>
        ) : (
          <MessagesSidebar
            selectedConversation={selectedConversation}
            setSelected={selectConversation}
            fetchedConversations={fetchedConversations}
            isLoading={isSidebarLoading}
            refetch={refetch}
          />
        )}
      </div>

      {/* Messages Content - **Layout from Host Index Page** */}
      {isMd && (
        <div
          className={cn(
            "flex h-full flex-1 items-center justify-center transition-transform duration-300",
          )}
        >
          {!selectedConversation ? (
            <EmptyStateValue description="Select a conversation to read more">
              <ConversationsEmptySvg />
            </EmptyStateValue>
          ) : (
            <MessagesContent
              selectedConversation={selectedConversation}
              setSelected={selectConversation}
            />
          )}
        </div>
      )}

      {/* Selected Conversation Sidebar - **Layout from Host Index Page** */}
      {selectedConversation &&
        (selectedConversation.propertyId ?? selectedConversation.requestId) && (
          <div
            className={cn("w-1/4 border-l transition-transform duration-300")}
          >
            <SelectedConversationSidebar
              conversation={selectedConversation}
              isHost={true} // **isHost is true for host messages**
            />
          </div>
        )}

      {/* Mobile Buttons - **Layout from Host Index Page** */}
      <div className="absolute right-2 top-2 z-50 space-x-2">
        {selectedConversation && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMobileSelectedSidebar}
            disabled={showMobileSelectedSidebar}
          >
            Details
          </Button>
        )}
      </div>
    </div>
  );
}

export default function MessagePage() {
  useSession({ required: true }); // Use useSession for auth

  const { data: totalUnreadMessages, isLoading: isUnreadLoading } =
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
          {isUnreadLoading
            ? "Loading..."
            : totalUnreadMessages && totalUnreadMessages > 0
              ? `(${totalUnreadMessages})`
              : ""}{" "}
          Host Messages | Tramona
        </title>
      </Head>
      <DashboardLayout>
        <MessageDisplay />
      </DashboardLayout>
    </>
  );
}
