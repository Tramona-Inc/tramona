import { useSession } from "next-auth/react";
import { cn } from "@/utils/utils";
import { ChatMessageType } from "@/utils/store/messages";

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

  return (
    <>
      {messages.length > 0 ? (
        <div
          className={cn(
            "flex w-full flex-1 flex-col-reverse gap-1 overflow-auto p-3",
            !isMobile && "h-96",
          )}
        >
          {messages.map((message) =>
            message.userId === session?.user.id ||
            message.userId === tempUserId ? (
              <div className="m-1 flex flex-row-reverse p-1" key={message.id}>
                <p className="h-max max-w-[15rem] rounded-l-xl rounded-tr-xl border-none bg-[#1A84E5] px-2 py-2 text-sm text-white antialiased">
                  {message.message}
                </p>
              </div>
            ) : (
              <div className="m-1 flex place-items-end p-1" key={message.id}>
                <p className="h-max max-w-[15rem] rounded-r-xl rounded-tl-xl border-none bg-[#2E2E2E] px-2 py-2 text-sm text-background text-white antialiased">
                  {message.message}
                </p>
              </div>
            ),
          )}
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
