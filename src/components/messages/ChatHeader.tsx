import { type Conversation } from "@/utils/store/conversations";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import UserAvatar from "../_common/UserAvatar";
import { Button, buttonVariants } from "../ui/button";
import { TooltipContent } from "../ui/tooltip";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { TooltipProvider } from "../ui/tooltip";

export type ContentProps = {
  selectedConversation: Conversation;
  setSelected: (arg0: Conversation | null) => void;
};

export default function ChatHeader({
  selectedConversation,
  setSelected,
}: ContentProps) {
  return (
    <div className="flex items-center justify-between border-b bg-white p-4">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="block md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
            {<ChevronLeft size="2em" />}
          </Button>
        </div>

        <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                {" "}
                <Button
                  variant="wrapper"
                  className="-space-x-2"
                  tooltip="See all team members"
                  tooltipOptions={{ side: "left" }}
                >
                  {selectedConversation.participants.map((participant) => (
                    <UserAvatar
                      key={participant.id}
                      size="sm"
                      name={participant.name}
                      email={participant.email}
                      image={participant.image}
                    />
                  ))}
                </Button>
              </TooltipTrigger>
              <TooltipContent>See all members</TooltipContent>
            </Tooltip>
          </TooltipProvider>

        <div className="flex flex-col">
          <p className="text-lg font-semibold">
            {selectedConversation.participants.length > 1
              ? selectedConversation.participants[0]?.name +
                " + " +
                (selectedConversation.participants.length - 1) +
                " others"
              : selectedConversation.participants[0]?.name}
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
