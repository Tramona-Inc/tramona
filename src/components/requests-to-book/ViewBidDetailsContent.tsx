import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { GuestDashboardRequestToBook } from "./RequestToBookCardBadge";

function ViewBidDetailsContent({
  requestToBook,
  openMoreDetails,
  onOpenChangeMoreDetails,
}: {
  requestToBook: GuestDashboardRequestToBook;
  openMoreDetails: boolean;
  onOpenChangeMoreDetails: (open: boolean) => void;
}) {
  return (
    <Dialog open={openMoreDetails} onOpenChange={onOpenChangeMoreDetails}>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <div>confirmation details here</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewBidDetailsContent;
