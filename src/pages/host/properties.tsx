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

export default function Properties() {
  return (
    <DashboadLayout type="host">
      <h1 className="text-h1">Properties</h1>
      <Dialog>
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
          <HostPropertyForm />
        </DialogContent>
      </Dialog>
    </DashboadLayout>
  );
}
