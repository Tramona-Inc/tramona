import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { CheckIcon, ChevronDownIcon, UndoIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { PropertyOfferAcceptDialog } from "./PropertyOfferAcceptDialog";
import { PropertyOfferRejectDialog } from "./PropertyOfferRejectDialog";
import { PropertyOfferCounterDialog } from "./PropertyOfferCounterDialog";

export function PropertyOfferResponseDD({ offerId }: { offerId: number }) {
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);

  return (
    <>
      <PropertyOfferAcceptDialog
        offerId={offerId}
        open={acceptDialogOpen}
        setOpen={setAcceptDialogOpen}
      />
      <PropertyOfferRejectDialog
        offerId={offerId}
        open={rejectDialogOpen}
        setOpen={setRejectDialogOpen}
      />
      <PropertyOfferCounterDialog
        offerId={offerId}
        open={counterDialogOpen}
        setOpen={setCounterDialogOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            Respond
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setAcceptDialogOpen(true)}>
            <CheckIcon />
            Accept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCounterDialogOpen(true)}>
            <UndoIcon />
            Counter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRejectDialogOpen(true)} red>
            <XIcon />
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
