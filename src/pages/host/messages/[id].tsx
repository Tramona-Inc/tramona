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
import { useEffect, useState, useCallback, memo } from "react"; // Import memo
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import SelectedConversationSidebar from "@/components/messages/SelectedConversationSidebar";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import { Button } from "@/components/ui/button";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { useSession } from "next-auth/react";
import { useIsMd } from "@/utils/utils";

// Memoize child components to prevent unnecessary re-renders
const MemoizedMessagesSidebar = memo(MessagesSidebar);
const MemoizedMessagesContent = memo(MessagesContent);
const MemoizedSelectedConversationSidebar = memo(SelectedConversationSidebar);
const MemoizedSkeletonText = memo(SkeletonText); // Memoize SkeletonText as well if it's a custom component

function MessageDisplay() {
  const isMd = useIsMd();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  // **Adopt Mobile Sidebar State from Host Index Page **
  const [showMobileSelectedSidebar, setShowMobileSelectedSidebar] =
    useState(false);
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
        });
      } else {
        void push("/host/messages"); // **Updated Path for Host Messages**
      }
    },
    [push],
  );

  // **Adopt Sidebar Toggling Functions from Host Index Page **
  const toggleMobileSidebar = () => {
    setShowMobileSelectedSidebar(false);
  };

  const toggleMobileSelectedSidebar = () => {
    setShowMobileSelectedSidebar((prev) => !prev);
  };

  const toggleSelectedSidebar = () => {
    setShowSelectedSidebar((prev) => !prev);
  };

  const conversations = useConversation((state) => state.conversationList);

  const setConversationList = useConversation(
    (state) => state.setConversationList,
  );

  const { currentHostTeamId } = useHostTeamStore(); // Get hostTeamId

  const {
    data: fetchedConversations,
    isLoading: isSidebarLoading,
    refetch,
  } = api.messages.getConversations.useQuery(
    {
      hostTeamId: currentHostTeamId, // **Pass hostTeamId to fetch host conversations**
    },
    {
      refetchOnWindowFocus: false, // **Performance Optimization: Prevent refetch on window focus**
    },
  );

  useEffect(() => {
    if (fetchedConversations) {
      setConversationList(fetchedConversations);
    }
  }, [fetchedConversations, setConversationList]);

  useEffect(() => {
    const conversationIdFromUrl = query.id as string | undefined; // Changed to query.id

    if (conversationIdFromUrl) {
      if (conversations.length > 0) {
        const conversationToSelect = conversations.find(
          (conversation) => conversation.id === conversationIdFromUrl,
        );
        if (conversationToSelect) {
          setSelectedConversation(conversationToSelect);
        } else {
          // If conversation ID in URL is not found in fetched conversations
          if (selectedConversation?.id === conversationIdFromUrl) {
            setSelectedConversation(null); // Clear selected conversation if not found
          }
          void push("/host/messages"); // Go to messages without conversation ID if not found
        }
      } else {
        // If conversations are still loading or empty but there is a conversationId in url,
        // set selectedConversation to null initially, it will be updated when conversations are fetched.
        if (selectedConversation?.id === conversationIdFromUrl) {
          setSelectedConversation(null); // Clear selected conversation if conversations are empty initially
        }
      }
    } else if (!conversationIdFromUrl) {
      // If no conversationId in URL, and there was a selectedConversation, clear it.
      if (selectedConversation) {
        setSelectedConversation(null);
      }
    }
  }, [conversations, query.id, push, selectedConversation]); // Changed to query.id and added push to dependencies

  return (
    <div className="flex h-[calc(100vh-12rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
      {/* Messages Sidebar - **Layout from Host Index Page** */}
      {isMd && (
        <div
          className={cn(
            "w-full bg-white transition-transform duration-300 md:w-96",
            !showSelectedSidebar && "md:block", // **Conditional Visibility from Host Index**
          )}
        >
          {isSidebarLoading ? (
            <div className="space-y-4 p-4">
              <MemoizedSkeletonText className="w-full" />
              <MemoizedSkeletonText className="w-2/3" />
              <MemoizedSkeletonText className="w-1/2" />
            </div>
          ) : (
            <MemoizedMessagesSidebar // Use memoized version
              selectedConversation={selectedConversation}
              setSelected={selectConversation}
              fetchedConversations={fetchedConversations}
              isLoading={isSidebarLoading}
              refetch={refetch}
            />
          )}
        </div>
      )}

      {/* Messages Content - **Layout from Host Index Page** */}
      <div className="flex h-full flex-1 items-center justify-center transition-transform duration-300">
        {selectedConversation && (
          <MemoizedMessagesContent
            selectedConversation={selectedConversation}
            setSelected={selectConversation}
          />
        )}
      </div>

      {/* Selected Conversation Sidebar - **Layout from Host Index Page** */}
      {selectedConversation &&
        (selectedConversation.propertyId ?? selectedConversation.requestId) && (
          <div
            className={cn(
              "w-1/4 border-l transition-transform duration-300",
              showSelectedSidebar ? "md:block" : "hidden", // **Conditional Visibility from Host Index**
              showMobileSelectedSidebar ? "sm:block" : "hidden sm:hidden", // **Conditional Visibility from Host Index**
            )}
          >
            <MemoizedSelectedConversationSidebar // Use memoized version
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
  const { currentHostTeamId } = useHostTeamStore(); // use this to get the correct messages depending on the team

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
