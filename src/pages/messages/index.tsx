import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import { type Conversation } from "@/utils/store/conversations";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

export default function MessagePage() {
  useSession({ required: true });

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const selectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  return (
    <>
      <Head>
        <title>Messages | Tramona</title>
      </Head>

      <div className="grid h-[calc(100vh-5em)] grid-cols-1 bg-white md:grid-cols-6">
        <MessagesSidebar
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
        />
        <MessagesContent
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
        />
      </div>
    </>
  );
}
