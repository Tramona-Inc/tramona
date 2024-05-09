import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import { Button } from "../ui/button";

export default function AcceptForm({
  offerId,
  setOpen,
  counterNightlyPrice,
}: {
  offerId: number;
  setOpen: (open: boolean) => void;
  counterNightlyPrice: number;
}) {
  const { mutateAsync } = api.biddings.accept.useMutation();

  async function onSubmit() {
    void mutateAsync({ bidId: offerId });

    setOpen(false);

    console.log("pressed");
  }

  return (
    <>
      <div>
        <h1>Current Counter Offer</h1>
        <p>{formatCurrency(counterNightlyPrice)} /night</p>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button type="submit">Accept Offer</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You are agreeing to accepting the current bid price.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSubmit}>
                Accept Offer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
