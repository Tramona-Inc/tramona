import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import { type Conversation } from "@/utils/store/conversations";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

function MessageDisplay() {

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const selectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  // TODO: Allows us to open message from url query

  // const [isViewed, setIsViewd] = useState(false);
  // const conversations = useConversation((state) => state.conversationList);
  // const { query } = useRouter();

  // useEffect(() => {
  //   if (query.conversationId && conversations.length > 0 && !isViewed) {
  //     const conversationIdToSelect = query.conversationId as string;
  //     const conversationToSelect = conversations.find(
  //       (conversation) => conversation.id === conversationIdToSelect,
  //     );

  //     if (
  //       conversationToSelect &&
  //       selectedConversation?.id !== conversationToSelect.id
  //     ) {
  //       setSelectedConversation(conversationToSelect);
  //     }

  //     setIsViewd(true);
  //   }
  // }, [conversations, isViewed, query.conversationId, selectedConversation?.id]);

  return (
    <div className="flex min-h-screen-minus-header">
      <MessagesSidebar
        selectedConversation={selectedConversation}
        setSelected={selectConversation}
      />
      <div className="flex-1">
        <MessagesContent
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
        />
      </div>
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
      <DashboardLayout type={session?.user.role ?? "guest"}>
        <MessageDisplay />
      </DashboardLayout>
    </>
  );
}
