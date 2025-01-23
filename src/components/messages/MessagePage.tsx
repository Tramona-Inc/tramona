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
import { useEffect, useMemo, useState } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import { SkeletonText } from "@/components/ui/skeleton";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import DetailsSidebarFromSelectedConversation from "@/components/messages/DetailsSidebarFromSelectedConversation";
import { useIsMd } from "@/utils/utils";
import { Dialog, DialogContent } from "../ui/dialog";

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

function MessageDisplay(props: MessagesPageProps) {
  const isMd = useIsMd();
  const showSidebar = isMd || props.isIndex;
  const showMessageContent = isMd || !props.isIndex;

  const router = useRouter();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const handleSetSelectedConversation = (conversation: Conversation | null) => {
    if (!conversation) return;
    setSelectedConversation(conversation);

    void router.push(`${props.basePath}/${conversation.id}`, undefined, {
      shallow: true,
    });
  };

  const conversations = useConversation((state) => state.conversationList);
  const setConversationList = useConversation(
    (state) => state.setConversationList,
  );

  const { query } = useRouter();
  const { currentHostTeamId } = useHostTeamStore();

  const {
    data: fetchedConversations,
    isLoading: isSidebarLoading,
    refetch,
  } = api.messages.getConversations.useQuery({
    hostTeamId: currentHostTeamId,
  });

  const conversationIdFromUrl = useMemo(() => {
    return query.id as string | undefined;
  }, [query.id]);

  const detailsSidebarIsOpen: boolean = useMemo(() => {
    return query.details && query.details === "true" ? true : false;
  }, [query]);

  useEffect(() => {
    if (
      conversationIdFromUrl &&
      conversations.length > 0 &&
      !selectedConversation
    ) {
      const conversationToSelect = conversations.find(
        (conversation) => conversation.id === conversationIdFromUrl,
      );
      if (conversationToSelect) {
        setSelectedConversation(conversationToSelect);
      }
    }
  }, [conversationIdFromUrl, selectedConversation, conversations]);

  useEffect(() => {
    if (fetchedConversations) {
      setConversationList(fetchedConversations);
    } else {
      void refetch();
    }
  }, [fetchedConversations, setConversationList, refetch]);

  return (
    <div className="flex h-[calc(100vh-10rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
      {/* Messages Sidebar */}
      {showSidebar && (
        <div
          className={cn(
            "w-full bg-white transition-transform duration-300 md:w-96",
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
              setSelected={handleSetSelectedConversation}
              fetchedConversations={fetchedConversations}
              isLoading={isSidebarLoading}
              refetch={refetch}
            />
          )}
        </div>
      )}
      {/* Messages Content */}
      {showMessageContent && (
        <div
          className={cn(
            "flex h-full flex-1 items-center justify-center transition-transform duration-300",
            !selectedConversation && "hidden md:flex",
          )}
        >
          {!selectedConversation ? (
            <EmptyStateValue description="You have no conversations yet">
              <ConversationsEmptySvg />
            </EmptyStateValue>
          ) : (
            <MessagesContent
              selectedConversation={selectedConversation}
              setSelected={handleSetSelectedConversation}
            />
          )}
        </div>
      )}

      {/* Selected Conversation Sidebar */}
      {selectedConversation &&
        detailsSidebarIsOpen &&
        (isMd ? (
          <div
            className={cn("w-1/4 border-l transition-transform duration-500")}
          >
            <DetailsSidebarFromSelectedConversation
              conversation={selectedConversation}
              isHost={true}
            />
          </div>
        ) : (
          <Dialog open={detailsSidebarIsOpen}>
            <DialogContent className="">
              <DetailsSidebarFromSelectedConversation
                conversation={selectedConversation}
                isHost={true}
              />
            </DialogContent>
          </Dialog>
        ))}
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
