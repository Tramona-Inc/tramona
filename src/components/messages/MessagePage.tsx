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
import { useEffect, useState, useMemo } from "react";
import { api } from "@/utils/api";
import { SkeletonText } from "@/components/ui/skeleton";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import DetailsSidebarFromSelectedConversation from "./DetailSidebarComponents/DetailsSidebarFromSelectedConversation";
import { useIsMd, useIsSm, useIsOnlyMd, useIsLg, cn } from "@/utils/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import { motion } from "framer-motion";

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
  const isLg = useIsLg();
  const isOnlyMd = useIsOnlyMd();
  const isMd = useIsMd();
  const isSm = useIsSm();

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

  //SCREEN WIDTH LOGIC

  const detailsSidebarIsOpen = useMemo(() => {
    return query.details === "true"; // Simplified boolean check
  }, [query.details]);

  //canonly be open if the details is close on md screens

  const showSidebar = isLg || props.isIndex;

  //content
  const showMessageContent = isLg || !props.isIndex;

  //detailsSidebar

  const messagesContentWidth = useMemo(() => {
    return detailsSidebarIsOpen && isMd ? "75%" : "100%";
  }, [detailsSidebarIsOpen, isMd]);

  return (
    <div className="flex h-[calc(100vh-9rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
      {/* Messages Sidebar */}
      {showSidebar && (
        <div
          className={cn(
            "w-1/4 bg-white transition-transform duration-300 2xl:w-96",
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
        <motion.div // Wrap MessagesContent with motion.div
          className={cn(
            "flex h-full flex-1 items-center justify-center transition-transform duration-500",
            !selectedConversation && "hidden md:flex",
          )}
          style={{
            width: messagesContentWidth,
            // translateX: messagesContentTranslateX, // Keep width animation, remove translateX for shrinking effect
          }}
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
        </motion.div>
      )}

      {/* Selected Conversation Sidebar */}
      {selectedConversation &&
        detailsSidebarIsOpen &&
        (isSm ? (
          <motion.div // Use motion.div for animation
            className={cn("w-1/4 border-l transition-transform duration-300")}
            initial={{ x: "100%" }} // Start position: off-screen to the right
            animate={{ x: "0%" }} // Animate to: fully visible
            exit={{ x: "100%" }} // Exit animation: slide out to the right
            transition={{
              duration: 0.005, // Slightly reduced duration (adjust as needed)
              ease: "easeInOut",
            }}
          >
            <DetailsSidebarFromSelectedConversation
              conversation={selectedConversation}
              isHost={true}
            />
          </motion.div>
        ) : (
          <Dialog
            open={detailsSidebarIsOpen}
            onOpenChange={(open) => {
              if (!open && router.query.details === "true") {
                void router.push(
                  {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      details: "false",
                    },
                  },
                  undefined, // This is required to keep the current URL
                  { shallow: true },
                );
              }
            }}
          >
            <DialogContent>
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
