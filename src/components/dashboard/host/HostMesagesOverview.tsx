import MessagesSidebar from "@/components/messages/MessagesSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type Conversation,
  useConversation,
} from "@/utils/store/conversations";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function HostMessagesOverview({
  className,
}: {
  className?: string;
}) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const selectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  // * Allows us to open message from url query
  const [isViewed, setIsViewd] = useState(false);
  const conversations = useConversation((state) => state.conversationList);
  const { query } = useRouter();

  useEffect(() => {
    if (query.conversationId && conversations.length > 0 && !isViewed) {
      const conversationIdToSelect = query.conversationId as string;
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Messages</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <Link href="/messages">
          <MessagesSidebar
            selectedConversation={selectedConversation}
            setSelected={selectConversation}
            isOverview
          />
        </Link>
      </CardContent>
    </Card>
  );
}
