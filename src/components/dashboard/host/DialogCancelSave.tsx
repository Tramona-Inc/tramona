import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

export default function DialogCancelSave() {
  return (
    <div className="flex items-center justify-end">
      <DialogClose>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </DialogClose>
    </div>
  );
}
