import { DialogContent, Dialog, DialogTrigger } from "../../ui/dialog";
import { ShareIcon } from "lucide-react";
import ShareDialogContent from "./ShareDialogContent";
import { Button } from "@/components/ui/button";

function ShareOfferDialog({
  id,
  isRequest,
  propertyName,
}: {
  id: number;
  isRequest: boolean;
  propertyName: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="">
          <div className="flex flex-row items-center space-x-2">
            <ShareIcon /> 
            <div><u>Share</u></div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="text-xl font-semibold">
        <ShareDialogContent
          id={id}
          isRequest={isRequest}
          propertyName={propertyName}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ShareOfferDialog;
