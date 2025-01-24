"use client";

import type { Conversation } from "@/utils/store/conversations";
import { ChevronLeft } from "lucide-react";
import UserAvatar from "../_common/UserAvatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { TooltipContent } from "../ui/tooltip";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { TooltipProvider } from "../ui/tooltip";
import { useState, useMemo } from "react";
import { capitalizeFirstLetter } from "@/utils/utils";
import { useRouter } from "next/router";

export type ContentProps = {
  selectedConversation: Conversation;
  setSelected: (arg0: Conversation | null) => void;
};

export default function ChatHeader({
  selectedConversation,
  setSelected,
}: ContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const detailsSidebarIsOpen = useMemo(() => {
    return router.query.details === "true"; // Simplified boolean check
  }, [router.query.details]);

  return (
    <div className="flex h-20 items-center justify-between border-b bg-white p-4">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="block lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/messages")}
          >
            <ChevronLeft size="2em" />
          </Button>
        </div>

        <TooltipProvider>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="wrapper"
                  className="-space-x-2"
                  onClick={() => setDialogOpen(true)}
                >
                  {selectedConversation.participants.map((participant) => (
                    <UserAvatar
                      key={participant.id}
                      size="sm"
                      name={capitalizeFirstLetter(participant.firstName!)}
                      image={participant.image}
                    />
                  ))}
                </Button>
              </TooltipTrigger>
              <TooltipContent>See all members</TooltipContent>
            </Tooltip>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Conversation Members</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {selectedConversation.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-4 px-2"
                  >
                    <UserAvatar
                      size="md"
                      name={capitalizeFirstLetter(participant.firstName!)}
                      image={participant.image}
                    />
                    <div className="flex flex-col">
                      <p className="font-medium">
                        {capitalizeFirstLetter(participant.firstName!)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </TooltipProvider>

        <div className="flex flex-col">
          <p className="text-lg font-semibold">
            {selectedConversation.participants.length > 1
              ? capitalizeFirstLetter(
                  selectedConversation.participants[0]?.firstName ?? "user",
                ) +
                " + " +
                (selectedConversation.participants.length - 1) +
                " others"
              : capitalizeFirstLetter(
                  selectedConversation.participants[0]?.firstName ?? "user",
                )}
          </p>
        </div>
      </div>
      {!detailsSidebarIsOpen && (
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => {
            void router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                details: "true",
              },
            });
          }}
        >
          Details
        </Button>
      )}
    </div>
  );
}
