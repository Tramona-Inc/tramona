import { Button } from "../ui/button";
import { DialogContent, Dialog, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { CopyIcon, ShareIcon } from "lucide-react";
function ShareOfferDialog({
  id,
  isRequest,
}: {
  id: number;
  isRequest: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `https://tramona.com/public-offers/${id}`;
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
        <div className=" flex flex-col justify-around gap-y-3 text-xl">
          {isRequest ? (
            <h1>Share all Offers Link</h1>
          ) : (
            <h1>Share Offer Link</h1>
          )}
          <div className=" flex appearance-none flex-row items-center justify-between gap-x-2 text-base font-normal">
            <input
              type="text"
              value={
                isRequest
                  ? `https://tramona.com/request/${id}`
                  : `https://tramona.com/public-offers/${id}`
              }
              readOnly
              className="w-full appearance-none rounded-xl border px-5 py-2"
            />
            <Button size="icon" variant="outlineMinimal" onClick={handleCopy}>
              {" "}
              <CopyIcon />{" "}
            </Button>
          </div>
          {copied && (
            <span className="ml-2 text-center text-base text-green-700">
              Link copied!
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareOfferDialog;
