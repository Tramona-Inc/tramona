import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

export default function DialogCancelSave() {
  return (
    <div className="flex items-center justify-end gap-2">
      <DialogClose>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Save</Button>
    </div>
  );
}
