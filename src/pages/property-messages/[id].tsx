import { api, RouterOutputs } from "@/utils/api";
import { useRouter } from "next/router";
import { MessagesLayout } from ".";
import Spinner from "@/components/_common/Spinner";
import { cn, formatRelativeDateShort, plural, toReversed } from "@/utils/utils";
import UserAvatar from "@/components/_common/UserAvatar";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { errorToast } from "@/utils/toasts";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

function ConversationDetails({
  conversation,
}: {
  conversation: RouterOutputs["propertyMessages"]["getConversationDetails"];
}) {
  return (
    <pre className="overflow-auto text-xs">
      {JSON.stringify(conversation, null, 2)}
    </pre>
  );
}

function ConversationMessage({
  message,
  isSending = false,
  curUserId,
}: {
  message: RouterOutputs["propertyMessages"]["getMessages"][number];
  isSending?: boolean;
  curUserId: string;
}) {
  const isCurUser = message.authorId === curUserId;

  return (
    <div
      className={cn(
        "flex gap-4",
        isCurUser && "flex-row-reverse",
        isSending && "opacity-50",
      )}
    >
      <UserAvatar
        name={`${message.author.firstName} ${message.author.lastName}`}
        image={message.author.image}
      />
      <div
        className={cn(
          "flex flex-1 flex-col",
          isCurUser ? "items-end" : "items-start",
        )}
      >
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-medium text-zinc-600">
            {message.author.firstName}
          </p>
          <p className="text-xs text-zinc-500">
            {formatRelativeDateShort(message.createdAt, {
              withSuffix: true,
            })}
            {message.readAt && <> · Read</>}
          </p>
        </div>
        <div
          className={cn(
            "max-w-md rounded-2xl px-4 py-2 text-sm/relaxed font-medium",
            isCurUser
              ? "bg-primaryGreen text-white"
              : "bg-white text-zinc-700 shadow",
          )}
        >
          {message.message}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const conversationId = router.query.id as string;
  const [message, setMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);
  const [lastSeenMessageId, setLastSeenMessageId] = useState<string | null>(
    null,
  );

  const utils = api.useUtils();

  const { data: messages } = api.propertyMessages.getMessages.useQuery(
    { conversationId },
    { refetchInterval: 5000, enabled: router.isReady },
  );

  const { data: conversation } =
    api.propertyMessages.getConversationDetails.useQuery(
      { conversationId },
      { enabled: router.isReady },
    );

  const { data: session } = useSession({ required: true });

  const sendMessage = api.propertyMessages.sendMessage.useMutation({
    onMutate: async (newMessage) => {
      // Cancel outgoing refetches
      await utils.propertyMessages.getMessages.cancel({ conversationId });

      // Get the current messages
      const prevMessages = utils.propertyMessages.getMessages.getData({
        conversationId,
      });

      // Optimistically update the messages
      utils.propertyMessages.getMessages.setData({ conversationId }, (old) => {
        if (!old || !session) return old;
        return [
          {
            id: `temp-${Date.now()}`,
            message: newMessage.message,
            createdAt: new Date(),
            authorId: session.user.id,
            readAt: null,
            editedAt: null,
            author: session.user,
            conversationId,
          },
          ...old,
        ];
      });

      return { prevMessages };
    },
    onError: (err, newMessage, context) => {
      // Revert the optimistic update
      utils.propertyMessages.getMessages.setData(
        { conversationId },
        context?.prevMessages,
      );
    },
  });

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
    });
    setUnreadCount(0);
  };

  const checkIfAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  useEffect(() => {
    if (!messages?.[0]) return;

    if (wasAtBottomRef.current) {
      scrollToBottom();
      setLastSeenMessageId(messages[0].id);
      setUnreadCount(0);
    } else {
      const lastSeenIndex = messages.findIndex(
        (m) => m.id === lastSeenMessageId,
      );
      if (lastSeenIndex === -1) {
        setUnreadCount(messages.length);
      } else {
        setUnreadCount(lastSeenIndex);
      }
    }
  }, [messages, lastSeenMessageId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom = checkIfAtBottom();
      wasAtBottomRef.current = isAtBottom;
      setShowScrollButton(!isAtBottom);

      if (isAtBottom && messages?.[0]) {
        setLastSeenMessageId(messages[0].id);
        setUnreadCount(0);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  if (!session) return null;
  if (!conversation) return <Spinner />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const trimmedMessage = message.trim();
    setMessage("");

    wasAtBottomRef.current = checkIfAtBottom();

    await sendMessage
      .mutateAsync({
        conversationId,
        message: trimmedMessage,
      })
      .catch(() => errorToast());

    if (wasAtBottomRef.current && messages?.[0]) {
      setLastSeenMessageId(messages[0].id);
      scrollToBottom();
    }
  };

  return (
    <MessagesLayout>
      <div className="flex h-full">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div
            className="relative flex-1 space-y-4 overflow-auto p-4"
            ref={messagesContainerRef}
          >
            {messages
              ? toReversed(messages).map((message) => (
                  <ConversationMessage
                    key={message.id}
                    message={message}
                    curUserId={session.user.id}
                    isSending={message.id.startsWith("temp-")}
                  />
                ))
              : null}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="relative p-2 pt-0">
            {showScrollButton && unreadCount > 0 && (
              <button
                type="button"
                onClick={scrollToBottom}
                className="absolute inset-x-0 bottom-full flex h-8 items-center justify-center gap-1 rounded-t-md bg-primaryGreen text-xs text-white"
              >
                {plural(unreadCount, "new message")}
                <ChevronDown className="h-4 w-4" />
              </button>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primaryGreen focus:outline-none"
              />
              <Button className="h-11 w-24" disabled={!message.trim()}>
                Send
              </Button>
            </div>
          </form>
        </div>

        <div className="w-96">
          <ConversationDetails conversation={conversation} />
        </div>
      </div>
    </MessagesLayout>
  );
}
