import DialogCancelSave from "./DialogCancelSave";
import { Textarea } from "@/components/ui/textarea";

export default function DirectionsDialog() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Directions</h1>
        <p className="text-muted-foreground">Add details</p>
      </div>
      <div>
        <h2 className="font-semibold">Directions to property</h2>
        <Textarea placeholder="Provide detailed directions to help guests find your property..." />
      </div>
      <p className="text-muted-foreground">
        Typically provided close to check-in
      </p>
      <DialogCancelSave />
    </div>
  );
}
