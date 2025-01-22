// import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
// import MessagesContent from "@/components/messages/MessagesContent";
// import MessagesSidebar from "@/components/messages/MessagesSidebar";
// import {
//   useConversation,
//   type Conversation,
// } from "@/utils/store/conversations";
// import Head from "next/head";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { api } from "@/utils/api";
// import { cn } from "@/utils/utils";
// import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
// import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
// import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
// import { useHostTeamStore } from "@/utils/store/hostTeamStore";
// import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";
// import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
// import SelectedConversationSidebar from "@/components/messages/SelectedConversationSidebar";

// function MessageDisplay() {
//   const [selectedConversation, setSelectedConversation] =
//     useState<Conversation | null>(null);

//   const selectConversation = (conversation: Conversation | null) => {
//     setSelectedConversation(conversation);
//   };

//   // * Allows us to open message from url query
//   const [isViewed, setIsViewed] = useState(false);
//   const conversations = useConversation((state) => state.conversationList);
//   const { query } = useRouter();
//   const { currentHostTeamId } = useHostTeamStore();
//   const {
//     data: fetchedConversations,
//     isLoading: isSidebarLoading,
//     refetch,
//   } = api.messages.getConversations.useQuery({
//     hostTeamId: currentHostTeamId,
//   }); // 假设有获取对话的 API

//   useEffect(() => {
//     if (query.conversationId && conversations.length > 0 && !isViewed) {
//       const conversationIdToSelect = query.conversationId as string;
//       const conversationToSelect = conversations.find(
//         (conversation) => conversation.id === conversationIdToSelect,
//       );

//       if (
//         conversationToSelect &&
//         selectedConversation?.id !== conversationToSelect.id
//       ) {
//         setSelectedConversation(conversationToSelect);
//       }

//       setIsViewed(true);
//     }
//   }, [conversations, isViewed, query.conversationId, selectedConversation?.id]);

//   return (
//     <div className="flex h-[calc(100vh-12rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
//       <div
//         className={cn(
//           "w-full bg-white md:w-96",
//           selectedConversation && "hidden md:block",
//         )}
//       >
//         {isSidebarLoading ? (
//           <div className="space-y-4 p-4">
//             <SkeletonText className="w-full" />
//             <SkeletonText className="w-2/3" />
//             <SkeletonText className="w-1/2" />
//           </div>
//         ) : (
//           <MessagesSidebar
//             selectedConversation={selectedConversation}
//             setSelected={selectConversation}
//             fetchedConversations={fetchedConversations}
//             isLoading={isSidebarLoading}
//             refetch={refetch}
//           />
//         )}
//       </div>
//       <div
//         className={cn(
//           "flex h-full flex-1 items-center justify-center",
//           !selectedConversation && "hidden md:flex",
//         )}
//       >
//         {selectedConversation ? (
//           <MessagesContent
//             selectedConversation={selectedConversation}
//             setSelected={selectConversation}
//           />
//         ) : (
//           <EmptyStateValue description="You have no conversations yet">
//             <ConversationsEmptySvg />
//           </EmptyStateValue>
//         )}
//       </div>
//       {selectedConversation &&
//         (selectedConversation.propertyId ?? selectedConversation.requestId) && (
//           <div className="w-1/4 border-l">
//             <SelectedConversationSidebar
//               conversation={selectedConversation}
//               isHost={true}
//             />
//           </div>
//         )}
//     </div>
//   );
// }

// export default function MessagePage() {
//   // const { data: session } = useSession({ required: true });
//   useSetInitialHostTeamId();
//   const { currentHostTeamId } = useHostTeamStore(); // use this to get the correct messages depending on the team

//   const { data: totalUnreadMessages, isLoading: isUnreadLoading } =
//     api.messages.getNumUnreadMessages.useQuery();

//   useEffect(() => {
//     if ("Notification" in window && Notification.permission === "default") {
//       void Notification.requestPermission();
//     }
//   }, []);

//   return (
//     <>
//       <Head>
//         <title>
//           {isUnreadLoading
//             ? "Loading..."
//             : totalUnreadMessages && totalUnreadMessages > 0
//               ? `(${totalUnreadMessages})`
//               : ""}{" "}
//           Messages | Tramona
//         </title>
//       </Head>
//       <DashboardLayout>
//         <MessageDisplay />
//       </DashboardLayout>
//     </>
//   );
// }

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import SelectedConversationSidebar from "@/components/messages/SelectedConversationSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function MessageDisplay() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileSelectedSidebar, setShowMobileSelectedSidebar] =
    useState(false);
  const [showSelectedSidebar, setShowSelectedSidebar] = useState(false);

  const selectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
    setShowMobileSidebar(false);
    setShowMobileSelectedSidebar(false);
    setShowSelectedSidebar(false);
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar((prev) => !prev);
    setShowMobileSelectedSidebar(false);
  };

  const toggleMobileSelectedSidebar = () => {
    setShowMobileSelectedSidebar((prev) => !prev);
    setShowMobileSidebar(false);
  };

  const toggleSelectedSidebar = () => {
    setShowSelectedSidebar((prev) => !prev);
  };

  const conversations = useConversation((state) => state.conversationList);
  const { query } = useRouter();
  const { currentHostTeamId } = useHostTeamStore();
  const {
    data: fetchedConversations,
    isLoading: isSidebarLoading,
    refetch,
  } = api.messages.getConversations.useQuery({
    hostTeamId: currentHostTeamId,
  });

  useEffect(() => {
    if (query.conversationId && conversations.length > 0) {
      const conversationIdToSelect = query.conversationId as string;
      const conversationToSelect = conversations.find(
        (conversation) => conversation.id === conversationIdToSelect,
      );

      if (
        conversationToSelect &&
        conversationToSelect !== selectedConversation
      ) {
        setSelectedConversation(conversationToSelect);
      }
    }
  }, [query.conversationId, conversations, selectedConversation]);

  return (
    <div className="flex h-[calc(100vh-12rem)] divide-x border-b lg:h-[calc(100vh-8rem)]">
      {/* Messages Sidebar */}
      <div
        className={cn(
          "w-full bg-white transition-transform duration-300 md:w-96",
          !showSelectedSidebar && "md:block",
          showMobileSidebar ? "sm:block" : "hidden sm:hidden",
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

      {/* Messages Content */}
      <div
        className={cn(
          "flex h-full flex-1 items-center justify-center transition-transform duration-300",
          !showMobileSidebar && !showMobileSelectedSidebar && "sm:flex",
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
            setSelected={selectConversation}
          />
        )}
      </div>

      {/* Selected Conversation Sidebar */}
      {selectedConversation &&
        (selectedConversation.propertyId ?? selectedConversation.requestId) && (
          <div
            className={cn(
              "w-1/4 border-l transition-transform duration-300",
              showSelectedSidebar ? "md:block" : "hidden", // Visible on medium and larger screens when toggled
              showMobileSelectedSidebar ? "sm:block" : "hidden sm:hidden", // Visible on small screens when toggled
            )}
          >
            <SelectedConversationSidebar
              conversation={selectedConversation}
              isHost={true}
            />
          </div>
        )}

      {/* Mobile Buttons */}
      <div className="absolute right-2 top-2 z-50 space-x-2 sm:flex md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileSidebar}
          disabled={showMobileSidebar}
        >
          Messages
        </Button>
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
          Messages | Tramona
        </title>
      </Head>
      <DashboardLayout>
        <MessageDisplay />
      </DashboardLayout>
    </>
  );
}
