import DashboardLayout from "@/components/_common/DashboardLayout/Guest";
import HostDashboardLayout from "@/components/_common/DashboardLayout/Host";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function MessageDisplay() {
  const [isViewed, setIsViewd] = useState(false);

  const conversations = useConversation((state) => state.conversationList);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const selectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  const { query } = useRouter();

  // Allows us to open message from url query
  useEffect(() => {
    if (query.conversationId && conversations.length > 0 && !isViewed) {
      const conversationIdToSelect = parseInt(query.conversationId as string);
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
    <div className="grid h-full grid-cols-1 md:grid-cols-6">
      <MessagesSidebar
        selectedConversation={selectedConversation}
        setSelected={selectConversation}
      />
      <MessagesContent
        selectedConversation={selectedConversation}
        setSelected={selectConversation}
      />
    </div>
  );
}

export default function MessagePage() {
  const { data: session } = useSession({ required: true });

  return (
    <>
      <Head>
        <title>Messages | Tramona</title>
      </Head>
      {session?.user.role === "host" ? (
        <HostDashboardLayout>
          <MessageDisplay />
        </HostDashboardLayout>
      ) : (
        <DashboardLayout>
          <MessageDisplay />
        </DashboardLayout>
      )}
    </>
  );
}
