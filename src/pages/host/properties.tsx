import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import HostPropertyForm from "@/components/host/HostPropertyForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Properties() {
  const [open, setOpen] = useState(false);

  return (
    <DashboadLayout type="host">
      <h1 className="text-h1">Properties</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add a Property</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add your Property</DialogTitle>
            <DialogDescription>
              Please input all the information necessary for travellers to start
              booking with your property.
            </DialogDescription>
          </DialogHeader>
          <HostPropertyForm setOpen={setOpen}/>
        </DialogContent>
      </Dialog>
    </DashboadLayout>
  );
}
