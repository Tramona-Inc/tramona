import Link from "next/link";
import { useState, type FormEvent } from "react";

// import { type IncomingMessage } from "@/pages/messages";
import { ChevronLeft } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";

import { type Conversation } from "@/pages/messages";
import { cn } from "@/utils/utils";
import UserAvatar from "../_common/UserAvatar";

// export type MessageProps = {
//   id: string;
//   sender: IncomingMessage;
//   createdAt: string;
//   content: string;
// };

// export function Message(message: MessageProps) {
//   return (
//     <div className="flex items-start gap-3">
//       <UserAvatar
//         email={undefined}
//         image={undefined}
//         name={message.sender.name}
//         size="lg"
//       />

//       <div>
//         <div className="flex items-baseline gap-2">
//           <p className="text-2xl font-bold">{message.sender.name}</p>
//           <p className="text-sm text-muted-foreground">{message.createdAt}</p>
//         </div>

//         <p className="mt-2">{message.content}</p>
//       </div>
//     </div>
//   );
// }

export type ContentProps = {
  conversation: Conversation;
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation | null) => void;
};

export default function MessagesContent({
  selectedConversation,
  setSelected,
}: ContentProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNewMessage("");
  };

  return (
    <div
      className={cn(
        "col-span-5 flex items-center justify-center md:col-span-4 xl:col-span-5",
        !selectedConversation && "hidden md:flex",
      )}
    >
      {!selectedConversation ? (
        <>
          <p className="font-semibold text-muted-foreground">
            Select a conversation to read more
          </p>
        </>
      ) : (
        <div className="h-full w-full">
          <div className="flex h-[100px] items-center justify-between border-b-2 px-4 lg:px-8">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="block md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelected(null)}
                >
                  {<ChevronLeft size="2em" />}
                </Button>
              </div>

              <UserAvatar
                email={selectedConversation.participants[0]?.email ?? ""}
                image={selectedConversation.participants[0]?.image ?? ""}
                name={selectedConversation.participants[0]?.name ?? ""}
              />

              <div className="flex flex-col">
                <p className="text-3xl font-bold">
                  {selectedConversation.participants[0]?.name}
                </p>
                {/* <p className="text-muted-foreground">Active 19m ago</p> */}
              </div>
            </div>

            <Link
              href="/my-trips"
              className={buttonVariants({ variant: "darkOutline" })}
            >
              View trip details
            </Link>
          </div>

          <div className="flex h-[calc(100vh-10.5rem)] flex-col justify-between p-4 lg:p-8">
            {/* <div className="mb-5 flex flex-col gap-8">
              {messages.map((message) => (
                <Message key={message.id} {...message} />
              ))}
            </div> */}

            <form onSubmit={handleSubmit}>
              <Input
                id="newMessage"
                name="newMessage"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="rounded-full"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
