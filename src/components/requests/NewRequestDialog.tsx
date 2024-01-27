import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewRequestForm from "./NewRequestForm";

export default function NewRequestDialog({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose className="hidden" />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a new request</DialogTitle>
          <DialogDescription>
            Choose a location and name your price
          </DialogDescription>
        </DialogHeader>
        <NewRequestForm afterSubmit={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
