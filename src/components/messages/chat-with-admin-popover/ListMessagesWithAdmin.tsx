import { useSession } from "next-auth/react";
import { cn } from "@/utils/utils";
import { ChatMessageType } from "@/utils/store/messages";
import { useEffect, useRef } from "react";

export default function ListMessagesWithAdmin({
  messages,
  isMobile,
  tempUserId,
}: {
  messages: ChatMessageType[];
  isMobile?: boolean;
  tempUserId: string;
}) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sort messages properly with UTC conversion
  const sortedMessages = [...messages].sort(
    (a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // UTC to local time conversion function
  const formatLocalTime = (utcString: string) => {
    const date = new Date(utcString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      {sortedMessages.length > 0 ? (
        <div
          className={cn(
            "flex w-full flex-1 flex-col gap-1 overflow-auto p-3",
            !isMobile && "h-96",
          )}
        >
          {sortedMessages.map((message) => (
            <div
              className={
                message.userId === session?.user.id || message.userId === tempUserId
                  ? "m-1 flex flex-row-reverse p-1"
                  : "m-1 flex place-items-end p-1"
              }
              key={message.id}
            >
              <div className="flex flex-col">
                <p
                  className={
                    message.userId === session?.user.id || message.userId === tempUserId
                      ? "h-max max-w-[15rem] rounded-l-xl rounded-tr-xl border-none bg-[#1A84E5] px-2 py-2 text-sm text-white antialiased"
                      : "h-max max-w-[15rem] rounded-r-xl rounded-tl-xl border-none bg-[#2E2E2E] px-2 py-2 text-sm text-white antialiased"
                  }
                >
                  {message.message}
                </p>
                <span className="text-xs text-gray-400 mt-1">
                  {formatLocalTime(message.createdAt)}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center",
            !isMobile && "h-96",
          )}
        >
          <p className="text-muted-foreground">How can we help you?</p>
        </div>
      )}
    </>
  );
}