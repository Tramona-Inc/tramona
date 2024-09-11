import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface RequestSubmittedDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;

}

const RequestWaitlistDialog: React.FC<RequestSubmittedDialogProps> = ({
  open,
  setOpen,

}) => {
  // Watch the specific data entry for the current tab
  // Now we can directly access location or use a fallback


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-6 max-w-md bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Added to Waitlist
        </h2>
        <p className="mb-4 text-gray-600">
          Thank you for your request. We are currently experiencing a{" "}
          <span className="font-bold underline text-black">high volume of traffic</span>.
          Your request is important to us, and we are working to process it as
          quickly as possible.
        </p>
        <p className="mb-4 text-gray-600">
          You can expect an{" "}
          <span className="font-bold underline text-black">email from us within 48 hours</span>.
          We apologize for the delay and appreciate your patience.
        </p>
        <p className="text-gray-600">
          If you have any questions, feel free to reach out to us at{" "}
          <a
            href="mailto:info@tramona.com"
            className="text-blue-500 hover:underline"
          >
            info@tramona.com
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default RequestWaitlistDialog;
