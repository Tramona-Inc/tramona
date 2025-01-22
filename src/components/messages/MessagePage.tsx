// components/messages/MessagesPage.tsx
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "@/utils/api";
import { cn, useIsMd } from "@/utils/utils";
import SelectedConversationSidebar from "@/components/messages/SelectedConversationSidebar";
import { SkeletonText } from "@/components/ui/skeleton";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import { Button } from "@/components/ui/button";

interface MessagesPageProps {
  isHost: boolean;
  basePath: string;
  fetchConversationsQuery: object;
  showMobileSidebarFeatures?: boolean;
  isIndex: boolean;
  EmptyStateComponent?: React.ReactNode;
  memoizeMessagesContent?: boolean;
  useViewedStateLogic?: boolean;
  pageTitlePrefix?: string;
}
function MessageDisplay({
  isHost,
  basePath,
  fetchConversationsQuery,
  showMobileSidebarFeatures = false,
  EmptyStateComponent = null,
  memoizeMessagesContent = false,
  useViewedStateLogic = false,
}: MessagesPageProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [previousSelectedConversation, setPreviousSelectedConversation] = // **NEW STATE**
    useState<Conversation | null>(null);
  const [showMobileSelectedSidebar, setShowMobileSelectedSidebar] =
    useState(true);
  const [showSelectedSidebar, setShowSelectedSidebar] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);

  const { push, query } = useRouter();

  const selectConversation = useCallback(
    (conversation: Conversation | null) => {
      setIsContentLoading(true);
      setPreviousSelectedConversation(selectedConversation); // **Store previous conversation**
      setSelectedConversation(conversation);

      if (showMobileSidebarFeatures) {
        setShowMobileSelectedSidebar(false);
        setShowSelectedSidebar(false);
      }

      if (conversation) {
        void push({
          pathname: `${basePath}/${conversation.id}`,
        });
      } else {
        void push(
          basePath,
          undefined,
          useViewedStateLogic ? { shallow: true } : undefined,
        );
      }
    },
    [
      push,
      basePath,
      showMobileSidebarFeatures,
      useViewedStateLogic,
      selectedConversation, // Dependency for storing previous conversation
    ],
  );

  const toggleMobileSelectedSidebar = () => {
    setShowMobileSelectedSidebar((prev) => !prev);
  };

  const toggleSelectedSidebar = () => {
    setShowSelectedSidebar((prev) => !prev);
  };

  const conversations = useConversation((state) => state.conversationList);
  const {
    data: fetchedConversations,
    isLoading: isSidebarLoading,
    refetch,
  } = api.messages.getConversations.useQuery(fetchConversationsQuery, {
    refetchOnWindowFocus: false,
  });
  const isMd = useIsMd();
  const [isViewed, setIsViewed] = useState(useViewedStateLogic ? false : true);

  useEffect(() => {
    const conversationIdFromUrl = (query.conversationId || query.id) as
      | string
      | undefined;

    if (conversationIdFromUrl) {
      if (conversations.length > 0) {
        const conversationToSelect = conversations.find(
          (conversation) => conversation.id === conversationIdFromUrl,
        );

        if (
          conversationToSelect &&
          selectedConversation?.id !== conversationToSelect.id
        ) {
          setSelectedConversation(conversationToSelect);
        } else if (!conversationToSelect) {
          if (selectedConversation?.id === conversationIdFromUrl) {
            setSelectedConversation(null);
          }
          void push(basePath);
        }
      } else {
        if (selectedConversation?.id === conversationIdFromUrl) {
          setSelectedConversation(null);
        }
      }
    } else if (!conversationIdFromUrl) {
      if (selectedConversation) {
        setSelectedConversation(null);
      }
    }
  }, [
    conversations,
    query.conversationId,
    query.id,
    selectedConversation?.id,
    push,
    basePath,
  ]);

  const MemoizedMessagesContent = useMemo(
    () => {
      return (
        <MessagesContent
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
          onMessagesLoadEnd={() => setIsContentLoading(false)}
        />
      );
    },
    memoizeMessagesContent ? [selectedConversation, selectConversation] : [],
  );

  const messagesContent = memoizeMessagesContent ? (
    MemoizedMessagesContent
  ) : (
    <MessagesContent
      selectedConversation={selectedConversation}
      setSelected={selectConversation}
      onMessagesLoadEnd={() => setIsContentLoading(false)}
    />
  );

  const previousMessagesContent = useMemo(
    // **Memoized Previous Messages Content**
    () => {
      return (
        <MessagesContent
          selectedConversation={previousSelectedConversation} // **Use previousSelectedConversation**
          setSelected={selectConversation} // Keep the same setSelected
        />
      );
    },
    memoizeMessagesContent
      ? [previousSelectedConversation, selectConversation]
      : [],
  );

  const renderPreviousMessages = memoizeMessagesContent ? ( // **Conditional rendering logic**
    previousMessagesContent
  ) : (
    <MessagesContent
      selectedConversation={previousSelectedConversation} // **Use previousSelectedConversation**
      setSelected={selectConversation} // Keep the same setSelected
    />
  );

  return (
    <div className="flex h-[calc(100vh-12rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
      {/* Messages Sidebar */}
      <div
        className={cn(
          "w-full bg-white md:w-1/3 xl:w-96",
          showMobileSidebarFeatures && !showSelectedSidebar && "md:block",
          !showMobileSidebarFeatures &&
            selectedConversation &&
            "hidden md:block",
          !showMobileSidebarFeatures && !selectedConversation && "md:block",
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

      {/* Messages Content - **Conditional Rendering with Previous Conversation** */}
      {isMd && (
        <div
          className={cn(
            "flex h-full flex-1 items-center justify-center transition-transform duration-300",
          )}
        >
          {isContentLoading ? (
            previousSelectedConversation ? ( // **Show previous content if available while loading**
              renderPreviousMessages
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <p>Loading Conversation...</p>{" "}
                {/* Fallback to loading message */}
              </div>
            )
          ) : selectedConversation ? (
            messagesContent
          ) : (
            <EmptyStateValue description="Select a conversation to read more">
              {EmptyStateComponent}
            </EmptyStateValue>
          )}
        </div>
      )}

      {/* Selected Conversation Sidebar */}
      {selectedConversation &&
        (selectedConversation.propertyId ?? selectedConversation.requestId) && (
          <div
            className={cn("w-1/4 border-l transition-transform duration-300")}
          >
            <SelectedConversationSidebar
              conversation={selectedConversation}
              isHost={isHost}
            />
          </div>
        )}

      {/* Mobile Buttons - Conditional rendering */}
      {showMobileSidebarFeatures && (
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
      )}
    </div>
  );
}

const MessagesPage: React.FC<MessagesPageProps> = (props) => {
  const { pageTitlePrefix = "" } = props;
  const { data: totalUnreadMessages, isLoading: isUnreadLoading } =
    api.messages.getNumUnreadMessages.useQuery();

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  const fullPageTitle = `${
    isUnreadLoading
      ? "Loading..."
      : totalUnreadMessages && totalUnreadMessages > 0
        ? `(${totalUnreadMessages})`
        : ""
  } ${pageTitlePrefix}Messages | Tramona`;

  return (
    <>
      <Head>
        <title>{fullPageTitle}</title>
      </Head>
      <DashboardLayout>
        <MessageDisplay {...props} />
      </DashboardLayout>
    </>
  );
};

export default MessagesPage;
