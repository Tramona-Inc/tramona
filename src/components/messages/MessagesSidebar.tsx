import { type MessageDbType } from "@/types/supabase.message";
import { api } from "@/utils/api";
import {
  Conversations,
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { useMessage } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { cn, useUpdateUser } from "@/utils/utils";
import { subHours } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import Spinner from "../_common/Spinner";
import UserAvatar from "../_common/UserAvatar";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarConversation } from "./SidebarConversation";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/router";

export type SidebarProps = {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation) => void;
  fetchedConversations: Conversations | [] | undefined;
  isLoading: boolean;
  isHost: boolean;
  refetch: () => void;
  isHost: boolean;
};

export default function MessagesSidebar({
  selectedConversation,
  setSelected,
  fetchedConversations,
  isLoading,
  refetch,
  isHost,
}: SidebarProps) {
  const [showAllMsgs, setShowAllMsgs] = useState(true);

  const conversations = useConversation((state) => state.conversationList);

  const setConversationList = useConversation(
    (state) => state.setConversationList,
  );

  useEffect(() => {
    if (fetchedConversations) {
      setConversationList(fetchedConversations);
    } else {
      void refetch();
    }
  }, [fetchedConversations, setConversationList, refetch]);

  const optimisticIds = useMessage((state) => state.optimisticIds);

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const { data: session } = useSession();

  const unreadConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      return (
        conversation.messages[0] &&
        !conversation.messages[0].read &&
        conversation.messages[0].userId !== session?.user.id
      );
    });
  }, [conversations, session?.user.id]);

  useEffect(() => {
    const handlePostgresChange = async (payload: { new: MessageDbType }) => {
      setConversationToTop(payload.new.conversation_id, {
        id: payload.new.id,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id,
        message: payload.new.message,
        isEdit: payload.new.is_edit,
        createdAt: payload.new.created_at,
        read: payload.new.read,
      });
    };

    const fetchConversationIds = async () => {
      if (session) {
        const channels = conversations
          .map((conversation) => conversation.id)
          .filter(
            (conversationId) => conversationId !== selectedConversation?.id,
          )
          .map((conversationId) =>
            supabase
              .channel(conversationId)
              .on(
                "postgres_changes",
                {
                  event: "INSERT",
                  schema: "public",
                  table: "messages",
                },
                (payload: { new: MessageDbType }) =>
                  void handlePostgresChange(payload),
              )
              .subscribe(),
          );

        return () => {
          channels.forEach((channel) => void channel.unsubscribe());
        };
      }
    };

    void fetchConversationIds();
  }, [
    conversations.map((c) => c.id).join(","),
    optimisticIds,
    selectedConversation?.id,
    session,
    setConversationToTop,
    conversations,
  ]);

  function MessageEmptyState({ unread = false }: { unread?: boolean }) {
    const router = useRouter();
    const session = useSession();
    const role = session.data?.user.role;

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center text-muted-foreground">
        <MessageSquare size={30} />
        <h2 className="font-semibold">
          {unread
            ? "You don't have any unread messages"
            : "You don't have any messages"}
        </h2>
        <p className="text-sm">
          {unread
            ? "When you have an unread message, it will appear here."
            : "When you receive a new message, it will appear here."}
        </p>
        {isHost ? (
          <Button
            className="rounded-full"
            onClick={() => router.push("/host/requests")}
          >
            See all incoming requests
          </Button>
        ) : (
          <div className="flex w-full flex-col gap-2 px-6">
            <Button
              className="rounded-full"
              onClick={() => router.push("/?tab=name-price")}
            >
              Make a request
            </Button>
            <Button
              className="rounded-full"
              onClick={() => router.push("/?tab=search")}
              variant="outline"
            >
              Book it now
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 overflow-y-auto border-b p-4">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <div className="flex items-center gap-1">
          <Button
            className="rounded-full"
            variant={showAllMsgs ? "primary" : "outline"}
            onClick={() => setShowAllMsgs(true)}
          >
            All
          </Button>
          <Button
            className="rounded-full"
            variant={showAllMsgs ? "outline" : "primary"}
            onClick={() => setShowAllMsgs(false)}
          >
            Unread
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(75vh-1rem)] py-2 pl-1 pr-2 md:px-1">
        {!isLoading ? (
          showAllMsgs ? (
            conversations.length > 0 ? (
              conversations.map((conversation) => (
                <SidebarConversation
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation?.id === conversation.id}
                  setSelected={setSelected}
                />
              ))
            ) : (
              <MessageEmptyState />
            )
          ) : unreadConversations.length > 0 ? (
            unreadConversations.map((conversation) => (
              <SidebarConversation
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                setSelected={setSelected}
              />
            ))
          ) : (
            <MessageEmptyState unread />
          )
        ) : (
          <div className="grid place-items-center text-muted-foreground">
            <Spinner />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
