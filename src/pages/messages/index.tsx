import Head from "next/head";
import { useState } from "react";

import MessagesContent from "@/components/messages/messages-content";
import MessagesSidebar from "@/components/messages/messages-sidebar";
import { type AppRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import { type inferRouterOutputs } from "@trpc/server";

export type Conversation =
  inferRouterOutputs<AppRouter>["messages"]["getConversations"][number];

export type Conversations =
  inferRouterOutputs<AppRouter>["messages"]["getConversations"];

export default function MessagePage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const selectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  const { data: conversations } = api.messages.getConversations.useQuery();

  return (
    <>
      <Head>
        <title>Messages | Tramona</title>
      </Head>

      <div className="grid min-h-[calc(100vh-4.25rem)] grid-cols-1 bg-white md:grid-cols-6">
        <MessagesSidebar
          conversations={conversations ?? []}
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
