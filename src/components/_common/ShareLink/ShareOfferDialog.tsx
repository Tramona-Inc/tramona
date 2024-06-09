import { Button } from "../../ui/button";
import { DialogContent, Dialog, DialogTrigger } from "../../ui/dialog";
import { useState } from "react";
import { CopyIcon, ShareIcon } from "lucide-react";
import ShareDialogContent from "./ShareDialogContent";
function ShareOfferDialog({
  id,
  isRequest,
  linkImage,
  propertyName,
}: {
  id: number;
  isRequest: boolean;
  linkImage: string;
  propertyName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `https://tramona.com/public-offer/${id}`;
    navigator.clipboard.writeText(link).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 3 seconds
      },
      (err) => {
        console.error("Failed to copy: ", err);
      },
    );
  };
  return (
    <Dialog>
      <DialogTrigger className="">
        <ShareIcon />
      </DialogTrigger>
      <DialogContent className="text-xl font-semibold">
        <ShareDialogContent
          id={id}
          isRequest={isRequest}
          linkImage={linkImage}
          propertyName={propertyName}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ShareOfferDialog;
