// pages/host/messages/index.tsx
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import { SkeletonText } from "@/components/ui/skeleton";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import SelectedConversationSidebar from "@/components/messages/SelectedConversationSidebar";
import { Button } from "@/components/ui/button";
import { useIsMd } from "@/utils/utils";
import { useSession } from "next-auth/react"; // Import useSession

function MessageDisplay() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [showMobileSelectedSidebar, setShowMobileSelectedSidebar] =
    useState(false);
  const [showSelectedSidebar, setShowSelectedSidebar] = useState(false);

  const { push, query } = useRouter(); // Get push from useRouter
  const { data: session } = useSession(); // Get session

  const selectConversation = useCallback(
    // Use useCallback
    (conversation: Conversation | null) => {
      setSelectedConversation(conversation);
      setShowMobileSelectedSidebar(false);
      setShowSelectedSidebar(false);
      if (conversation) {
        void push(`/messages/${conversation.id}`); // **Updated Route to Host Message Detail Page!**
      } else {
        void push("/messages"); // **Updated Route to Host Message Index Page!**
      }
    },
    [push],
  );

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
  const { setConversationList } = useConversation();

  const { currentHostTeamId } = useHostTeamStore();
  const {
    data: fetchedConversations,
    isLoading: isSidebarLoading,
    refetch,
  } = api.messages.getConversations.useQuery({
    hostTeamId: null, // **Keep hostTeamId for host conversations**
  });

  useEffect(() => {
    console.log("hi");
    if (fetchedConversations) {
      setConversationList(fetchedConversations);
    }
  }, [fetchedConversations, setConversationList]);

  useEffect(() => {
    const conversationIdFromUrl = query.id as string | undefined; // Changed query.conversationId to query.id

    if (conversationIdFromUrl) {
      // Check if conversations is not null or undefined
      if (conversations.length > 0) {
        const conversationToSelect = conversations.find(
          (conversation) => conversation.id === conversationIdFromUrl,
        );

        if (conversationToSelect) {
          setSelectedConversation(conversationToSelect);
        } else {
          if (selectedConversation?.id === conversationIdFromUrl) {
            setSelectedConversation(null);
          }
          void push("/host/messages");
        }
      } else {
        if (selectedConversation?.id === conversationIdFromUrl) {
          setSelectedConversation(null); // Clear selected conversation if conversations are empty initially
        }
      }
    } else if (!conversationIdFromUrl) {
      if (selectedConversation) {
        setSelectedConversation(null);
      }
    }
  }, [query.id, conversations, push, selectedConversation]);

  const isMd = useIsMd();

  return (
    <div className="flex h-[calc(100vh-12rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
      {/* Messages Sidebar */}
      {isMd && (
        <div
          className={cn(
            "w-full bg-white transition-transform duration-300 md:w-96",
            !showSelectedSidebar && "md:block",
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
      )}
      {/* Messages Content */}
      <div
        className={cn(
          "flex h-full flex-1 items-center justify-center transition-transform duration-300",
          !showMobileSelectedSidebar && "sm:flex",
          !selectedConversation && "hidden md:flex",
        )}
      >
        {selectedConversation && (
          <MessagesContent
            selectedConversation={selectedConversation}
            setSelected={selectConversation}
          />
        )}
      </div>

      {/* Selected Conversation Sidebar */}
      {selectedConversation &&
        (selectedConversation.propertyId ?? selectedConversation.requestId) && (
          <div className="w-1/4 border-l transition-transform duration-300">
            <SelectedConversationSidebar
              conversation={selectedConversation}
              isHost={true} // **isHost is true for host messages**
            />
          </div>
        )}

      {/* Mobile Buttons */}
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
  useSession(); // Use useSession for auth
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
