import { Textarea } from "@/components/ui/textarea";
import DialogCancelSave from "./DialogCancelSave";

export default function HouseManualDialog() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">House Manual</h1>
        <p className="text-muted-foreground">Add details</p>
      </div>
      <div>
        <h2 className="font-semibold">House manual</h2>
        <Textarea placeholder="Add details about your house, including how to use appliances, emergency contacts, and local recommendations..." />
      </div>
      <p className="text-muted-foreground">
        Shared 24 to 48 hours before check-in
      </p>
      <DialogCancelSave />
    </div>
  );
}
