import { AdminConversation, type Conversation } from "@/utils/store/conversations";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import UserAvatar from "../_common/UserAvatar";
import { Button, buttonVariants } from "../ui/button";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export type ContentProps = {
  selectedConversation: Conversation & AdminConversation;
  setSelected: (arg0: Conversation & AdminConversation | null) => void;
};

export default function ChatHeader({
  selectedConversation,
  setSelected,
}: ContentProps) {

  const {data: session} = useSession();

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="block md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
            {<ChevronLeft size="2em" />}
          </Button>
        </div>
        {!selectedConversation.guest_messages ? 
        <UserAvatar
          email={selectedConversation.participants[0]?.email ?? ""}
          image={selectedConversation.participants[0]?.image ?? ""}
          name={selectedConversation.participants[0]?.name ?? ""}
        /> :
        <Avatar>
          <AvatarFallback />
        </Avatar>
      }

        <div className="flex flex-col">
          <p className="text-2xl font-bold">
            {!selectedConversation.guest_messages ? selectedConversation.participants[0]?.name : selectedConversation.guest_participants[0]?.userToken}
          </p>
          {/* <p className="text-muted-foreground">Active 19m ago</p> */}
        </div>
      </div>
      {selectedConversation.offerId && (
        <Link
          href={`/offers/${selectedConversation.offerId}`}
          className={buttonVariants({ variant: "darkOutline" })}
        >
          View trip details
        </Link>
      )}
    </div>
  );
}
