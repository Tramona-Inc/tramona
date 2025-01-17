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
import { useEffect, useState } from "react";
import Spinner from "../_common/Spinner";
import UserAvatar from "../_common/UserAvatar";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarConversation } from "./SidebarConversation";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/router";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";

export function MessageConversation({
  conversation,
  isSelected,
  setSelected,
}: {
  conversation: Conversation;
  isSelected: boolean;
  setSelected: (arg0: Conversation) => void;
}) {
  const { participants, messages, id, name } = conversation;

  const displayParticipants = participants
    .map((participant) => participant.name)
    .join(", ");

  const { data: session } = useSession();

  const { mutateAsync: setMessageToReadMutate } =
    api.messages.setMessageToRead.useMutation();

  const { updateUser } = useUpdateUser();

  const setConversationReadState = useConversation(
    (state) => state.setConversationReadState,
  );

  async function handleSelected() {
    if (session?.user.id !== messages[0]?.userId && messages[0]?.id) {
      void setMessageToReadMutate({ messageId: messages[0]?.id });
      if (session) {
        await updateUser({ lastTextAt: subHours(new Date(), 2) });
      }
    }
    // Update local state to true
    setConversationReadState(conversation.id);

    setSelected(conversation);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-start px-4 py-6 hover:cursor-pointer hover:bg-zinc-200",
        isSelected && "bg-zinc-100",
      )}
      onClick={() => handleSelected()}
    >
      <UserAvatar
        email={participants[0]?.email ?? ""}
        image={participants[0]?.image ?? ""}
        name={participants[0]?.name ?? ""}
      />

      <div className="ml-4 md:ml-2">
        <h1 className="font-bold">{displayParticipants}</h1>
        <p>{name}</p>
        <div className="line-clamp-1 flex flex-row items-center gap-1 text-sm text-muted-foreground">
          {messages.length > 0 &&
            !messages[0]?.read &&
            messages[0]?.userId !== session?.user.id && (
              <p className="rounded-full bg-blue-500 p-1" />
            )}
          {messages[0]?.userId === session?.user.id && "You: "}
          {messages[0]?.message ?? ""}
        </div>
        {session?.user.role === "admin" && (
          <p className="line-clamp-1 text-sm uppercase text-muted-foreground">
            Conversation Id: {id}
          </p>
        )}
      </div>
    </div>
  );
}

export type SidebarProps = {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation) => void;
  fetchedConversations: Conversations | [] | undefined;
  isLoading: boolean;
  refetch: () => void;
};

export default function MessagesSidebar({
  selectedConversation,
  setSelected,
  fetchedConversations,
  isLoading,
  refetch,
}: SidebarProps) {
  const [showAllMsgs, setShowAllMsgs] = useState(true);
  const { currentHostTeamId } = useHostTeamStore();
  // Fetch only once on mount
  // const {
  //   data: fetchedConversations,
  //   isLoading,
  //   refetch,
  // } = api.messages.getConversations.useQuery(
  //   {
  //     hostTeamId: currentHostTeamId,
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //   },
  // );

  const conversations = useConversation((state) => state.conversationList);

  const setConversationList = useConversation(
    (state) => state.setConversationList,
  );

  useEffect(() => {
    // Check if data has been fetched and hasn't been processed yet
    if (fetchedConversations) {
      console.log("initial fetch successful");
      setConversationList(fetchedConversations);
    } else {
      //refetch if data is not available
      console.log("initial fetch unsuccessful so refetching data");
      void refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedConversations, setConversationList, refetch]);

  const optimisticIds = useMessage((state) => state.optimisticIds);

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const { data: session } = useSession();

  // Map and listen to all the connects the user is part of
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
          // When channel is selected turn of here so it can listen in the child
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
    conversations,
    optimisticIds,
    selectedConversation?.id,
    session,
    setConversationToTop,
  ]);

  const unreadConversations = conversations.filter((conversation) => {
    return (
      conversation.messages[0] &&
      !conversation.messages[0].read &&
      conversation.messages[0].userId !== session?.user.id
    );
  });

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
        {role === "guest" && (
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
      <div className="space-y-4 border-b p-4">
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
      <ScrollArea className="h-[35rem] border-b py-2">
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
