import Head from "next/head";
import { useState } from "react";

import MessagesSidebar from "@/components/messages/messages-sidebar";
import MessagesContent from "@/components/messages/messages-content";

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
    {
      id: "3",
      name: "Anna",
      recentMessage: "[shows most recent message]",
    },
    {
      id: "4",
      name: "Anna",
      recentMessage: "[shows most recent message]",
    },
    {
      id: "5",
      name: "Anna",
      recentMessage: "[shows most recent message]",
    },
  ];

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
