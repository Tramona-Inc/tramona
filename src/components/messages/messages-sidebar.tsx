import { type IncomingMessage } from "@/pages/messages";
import UserAvatar from "../_common/UserAvatar";

import { cn } from "@/utils/utils";

export function MessageRecipient({
  recipient,
  isSelected,
  setSelected,
}: {
  recipient: IncomingMessage;
  isSelected: boolean;
  setSelected: (arg0: IncomingMessage) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-start border-b-2 border-zinc-100 px-4 py-6 hover:cursor-pointer hover:bg-zinc-200 lg:p-8",
        isSelected && "bg-zinc-100",
      )}
      onClick={() => setSelected(recipient)}
    >
      <UserAvatar email={undefined} image={undefined} name={recipient.name} />

      <div className="ml-4 md:ml-2">
        <h2 className="text-xl font-bold">{recipient.name}</h2>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {recipient.recentMessage}
        </p>
      </div>
    </div>
  );
}

export type SidebarProps = {
  recipients: IncomingMessage[];
  selectedRecipient: IncomingMessage | null;
  setSelected: (arg0: IncomingMessage) => void;
};

export default function MessagesSidebar({
  recipients,
  selectedRecipient,
  setSelected,
}: SidebarProps) {
  return (
    <div
      className={cn(
        "col-span-1 block md:col-span-2 md:border-r-2 xl:col-span-1",
        selectedRecipient && "hidden md:block",
      )}
    >
      <h1 className="flex h-[100px] w-full items-center border-b-2 p-4 text-4xl font-bold md:text-2xl md:font-semibold lg:p-8">
        Messages
      </h1>

      {recipients.length > 0 ? (
        recipients.map((recipient) => (
          <MessageRecipient
            key={recipient.id}
            recipient={recipient}
            isSelected={selectedRecipient?.id === recipient.id}
            setSelected={setSelected}
          />
        ))
      ) : (
        <p className="p-4 text-muted-foreground lg:p-8">No messages to show!</p>
      )}
    </div>
  );
}
