import { Button } from "@/components/ui/button";

export default function DialogCancelSave({
  isLoading,
}: {
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
