import { type MessageDbType } from "@/types/supabase.message";
import { api } from "@/utils/api";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Spinner from "../_common/Spinner";
import UserAvatar from "../_common/UserAvatar";
import { sub } from "date-fns";

export function MessageConversation({
  conversation,
  isSelected,
  setSelected,
}: {
  conversation: Conversation;
  isSelected: boolean;
  setSelected: (arg0: Conversation) => void;
}) {
  const { participants, messages, id } = conversation;

  const displayParticipants = participants
    .map((participant) => participant.name)
    .join(", ");

  const { data: session } = useSession();

  const { mutateAsync: setMessageToReadMutate } =
    api.messages.setMessageToRead.useMutation();

    const { mutate, isLoading } = api.users.updateProfile.useMutation({});
    const utils = api.useUtils();



  const setConversationReadState = useConversation(
    (state) => state.setConversationReadState,
  );

  async function handleSelected() {
    if (session?.user.id !== messages[0]?.userId && messages[0]?.id) {
      void setMessageToReadMutate({ messageId: messages[0]?.id });
      if (session) {
        mutate({
          id: session.user.id,
          lastTextAt: sub(new Date(), {hours: 2})
        })
        await utils.messages.invalidate();
      }
    }
    // Update local state to true
    setConversationReadState(conversation.id);

    setSelected(conversation);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-start border-b px-4 py-6 hover:cursor-pointer hover:bg-zinc-200 lg:p-8",
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
        <p className="line-clamp-1 flex flex-row items-center gap-1 text-sm text-muted-foreground">
          {messages.length > 0 &&
            !messages[0]?.read &&
            messages[0]?.userId !== session?.user.id && (
              <div className="rounded-full bg-blue-500 p-1" />
            )}
          {messages[0]?.userId === session?.user.id && "You: "}
          {messages[0]?.message ?? ""}
        </p>
        {session?.user.role === "admin" && (
          <p className="line-clamp-1 text-sm uppercase text-muted-foreground">
            Conversation Id: {id}
          </p>
        )}
      </div>
    </div>
  );
}
import { ScrollArea } from "../ui/scroll-area";
import { SidebarConversation } from "./SidebarConversation";

export type SidebarProps = {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation) => void;
};

export default function MessagesSidebar({
  selectedConversation,
  setSelected,
}: SidebarProps) {
  // Fetch only once on mount
  const { data: fetchedConversations, isLoading } =
    api.messages.getConversations.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const conversations = useConversation((state) => state.conversationList);

  const setConversationList = useConversation(
    (state) => state.setConversationList,
  );

  useEffect(() => {
    // Check if data has been fetched and hasn't been processed yet
    if (fetchedConversations) {
      setConversationList(fetchedConversations);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedConversations]);

  const optimisticIds = useMessage((state) => state.optimisticIds);

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const { data: session } = useSession();

  // Map and listen to all the connects the user is part of
  useEffect(() => {
    const handlePostgresChange = async (payload: { new: MessageDbType }) => {
      if (!optimisticIds.includes(payload.new.id)) {
        const { error } = await supabase
          .from("user")
          .select("name, email, image")
          .eq("id", payload.new.user_id)
          .single();
        if (error) {
          errorToast();
        } else {
          const newMessage: ChatMessageType = {
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            userId: payload.new.user_id,
            message: payload.new.message,
            isEdit: payload.new.is_edit,
            createdAt: payload.new.created_at,
            read: payload.new.read,
          };

          setConversationToTop(payload.new.conversation_id, newMessage);
        }
      }
    };

    const fetchConversationIds = async () => {
      if (session) {
        const { data: conversationIds, error } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", session.user.id);

        if (error) {
          errorToast();
        } else {
          const channels = conversationIds
            // When channel is selected turn of here so it can listen in the child
            .filter(
              (conversationId) =>
                conversationId.conversation_id !== selectedConversation?.id,
            )
            .map((conversationId) =>
              supabase
                .channel(conversationId.conversation_id)
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
      }
    };

    void fetchConversationIds();
  }, [optimisticIds, selectedConversation?.id, session, setConversationToTop]);

  return (
    <div
      className={cn(
        "col-span-1 block h-screen-minus-header md:col-span-4 md:border-r lg:col-span-3 2xl:col-span-2",
        selectedConversation && "hidden md:block",
      )}
    >
      <h1 className="flex h-[73px] w-full items-center border-b p-4 text-4xl font-bold md:text-2xl md:font-semibold lg:p-8">
        Messages
      </h1>

      <ScrollArea className="">
        {!isLoading ? (
          conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <SidebarConversation
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                setSelected={setSelected}
              />
            ))
          ) : (
            <div className="grid h-screen-minus-header place-items-center text-muted-foreground">
              <p>No conversations yet</p>
            </div>
          )
        ) : (
          <div className="grid h-screen-minus-header place-items-center text-muted-foreground">
            <Spinner />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
