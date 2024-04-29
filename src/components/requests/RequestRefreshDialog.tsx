import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import RequestRefreshForm from "./RequestRefreshForm";
import { type Request } from "@/server/db/schema";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

interface RequestRefreshDialogProps {
  request: Request;
}

const RequestRefreshDialog: React.FC<RequestRefreshDialogProps> = ({
  request,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" onClick={() => setIsOpen(true)}>
          <ReloadIcon />I don&apos;t like my offers
        </Button>
      </DialogTrigger>

      <DialogContent>
        <RequestRefreshForm
          afterSubmit={() => setIsOpen(false)}
          request={request}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RequestRefreshDialog;
