import Head from "next/head";
import { useState } from "react";

import MessagesContent from "@/components/messages/messages-content";
import MessagesSidebar from "@/components/messages/messages-sidebar";
import { api } from "@/utils/api";

export type IncomingMessage = {
  id: string;
  name: string;
  recentMessage: string;
};

export default function MessagePage() {
  const [selectedRecipient, setSelectedRecipient] =
    useState<IncomingMessage | null>(null);

  const selectRecipient = (recipient: IncomingMessage | null) => {
    setSelectedRecipient(recipient);
  };

  const recipients: IncomingMessage[] = [
    {
      id: "1",
      name: "Anna",
      recentMessage: "[shows most recent message, this is the recent message]",
    },
    {
      id: "2",
      name: "Derick",
      recentMessage: "[shows most recent message]",
    },
  ];

  const { data: participants } = api.messages.getParticipants.useQuery();

  console.log(participants);

  return (
    <>
      <Head>
        <title>Messages | Tramona</title>
      </Head>

      <div className="grid min-h-[calc(100vh-4.25rem)] grid-cols-1 bg-white md:grid-cols-6">
        <MessagesSidebar
          recipients={recipients}
          selectedRecipient={selectedRecipient}
          setSelected={selectRecipient}
        />
        <MessagesContent
          selectedRecipient={selectedRecipient}
          setSelected={selectRecipient}
        />
      </div>
    </>
  );
}
