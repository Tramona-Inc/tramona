import Head from "next/head";
import { useEffect, useState } from "react";

import MessagesContent from "@/components/messages/messages-content";
import MessagesSidebar from "@/components/messages/messages-sidebar";
import supabase from "@/utils/supabase";
import { useSession } from "next-auth/react";

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

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const { data, error } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", session?.user.id);

        // .eq("user_id", session?.user.id);
        if (data) {
          // Assuming your user table structure, modify as needed
          console.log(data);
        }
        if (error) {
          console.error("Error fetching recipients:", error);
        }
      } catch (error) {
        console.error("Error fetching recipients:");
      }
    };

    void fetchRecipients();
  }, []);

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
