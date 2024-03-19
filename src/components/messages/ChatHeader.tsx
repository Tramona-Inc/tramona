import { type Conversation } from "@/utils/store/conversations";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import UserAvatar from "../_common/UserAvatar";
import { Button, buttonVariants } from "../ui/button";

export type ContentProps = {
  selectedConversation: Conversation;
  setSelected: (arg0: Conversation | null) => void;
};

export default function ChatHeader({
  selectedConversation,
  setSelected,
}: ContentProps) {
  return (
    <div className="flex h-[100px] items-center justify-between border-b px-4 lg:px-8">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="block md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
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
  );
}
