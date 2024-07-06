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
  import CreateRequestForm from "./CreateRequestForm";
  
  export default function CreateRequestDialog({
    children,
  }: React.PropsWithChildren<{}>) {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogClose className="hidden" />
        <DialogTrigger asChild>{children}</DialogTrigger>
  
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a filler request</DialogTitle>
            <DialogDescription>
              Create a filler request with user name, travel time, location, request creation time, and nightly price
            </DialogDescription>
          </DialogHeader>
          <CreateRequestForm
            afterSubmit={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }
  