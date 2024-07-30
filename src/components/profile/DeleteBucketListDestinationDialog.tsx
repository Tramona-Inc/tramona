import { type DialogState } from "@/utils/dialog"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { api } from "@/utils/api";

type Props = {
  state: DialogState;
  destinationId: number;
}

export default function DeleteBucketListDestinationDialog({
  state,
  destinationId
}: Props) {

  const { mutate: deleteDestination } = api.profile.deleteDestination.useMutation({
    onSuccess: () => {
      state.setState("closed");
    }
  })

  function onSubmit() {
    deleteDestination({ destinationId });
  }

  return (
    <Dialog open={state.state === "open" ? true : false} onOpenChange={(open) => !open && state.setState("closed")}>
      <DialogContent>
        <DialogHeader className="border-b-2 pb-4">
          <DialogTitle>
            <h2 className="text-center">Delete Destination?</h2>
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <Button
            className="w-full text-base"
            onClick={() => state.setState("closed")}
          >
            Cancel
          </Button>

          <Button
            className="w-full bg-red-800/90 hover:bg-red-800 text-base"
            onClick={onSubmit}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
