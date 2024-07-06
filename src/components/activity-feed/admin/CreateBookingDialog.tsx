import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { useState } from "react";
  import CreateBookingForm from "./CreateBookingForm";
  
  export default function CreateBookingDialog({
    children,
  }: React.PropsWithChildren<{}>) {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogClose className="hidden" />
        <DialogTrigger asChild>{children}</DialogTrigger>
  
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a filler booking</DialogTitle>
          </DialogHeader>
          <CreateBookingForm
            afterSubmit={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }
  