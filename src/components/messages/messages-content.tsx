import Link from "next/link";
import { type FormEvent, useState } from "react";

import { type IncomingMessage } from "@/pages/messages";
import UserAvatar from "../_common/UserAvatar";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/utils/utils";

export type ContentProps = {
  selectedRecipient: IncomingMessage | null;
  setSelected: (arg0: IncomingMessage | null) => void;
};

export type MessageProps = {
  id: string;
  sender: IncomingMessage;
  createdAt: string;
  content: string;
};

export function Message(message: MessageProps) {
  return (
    <div className="flex items-start gap-3">
      <UserAvatar
        email={undefined}
        image={undefined}
        name={message.sender.name}
        size="lg"
      />

      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{message.sender.name}</p>
          <p className="text-sm text-muted-foreground">{message.createdAt}</p>
        </div>

        <p className="mt-2">{message.content}</p>
      </div>
    </div>
  );
}

export default function MessagesContent({
  selectedRecipient,
  setSelected,
}: ContentProps) {
  const [newMessage, setNewMessage] = useState("");

  const messages: MessageProps[] = [
    {
      id: "1",
      createdAt: "3:20 pm",
      sender: { id: "1", name: "Anna", recentMessage: "" },
      content:
        "Hey there! I'm very much looking forward to having you!!!! I'll send check-in instructions at check-in at 2PM the day of your stay (it is self check in anytime after 2PM). Don't worry - it's automatic, so you will get the message at that time. If you have any questions in the meantime, just let me know! I'm easy to reach and happy to help! ***Please note we have a ZERO TOLERANCE for parties or unregistered guests and too many cars - this will result in police escort removal and reservation cancellation, and have a strict no pets policy.***",
    },
    {
      id: "2",
      createdAt: "3:30 pm",
      sender: { id: "2", name: "Derick", recentMessage: "" },
      content: "No problem!",
    },
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNewMessage("");
  };

  return (
    <div
      className={cn(
        "col-span-5 flex items-center justify-center md:col-span-4 xl:col-span-5",
        !selectedRecipient && "hidden md:flex",
      )}
    >
      {!selectedRecipient ? (
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
                email={undefined}
                image={undefined}
                name={selectedRecipient.name}
                size="lg"
              />

              <div className="flex flex-col">
                <p className="text-3xl font-bold">{selectedRecipient.name}</p>
                <p className="text-muted-foreground">Active 19m ago</p>
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
            <div className="mb-5 flex flex-col gap-8">
              {messages.map((message) => (
                <Message key={message.id} {...message} />
              ))}
            </div>

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
