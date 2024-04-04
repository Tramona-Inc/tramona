import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import RequestRefreshForm from "./RequestRefreshForm"; 
import { RequestRefreshButton } from "./RequestRefreshButton";
import { type Request } from "@/server/db/schema";

interface RequestRefreshDialogProps {
  request: Request;
}

const RequestRefreshDialog: React.FC<RequestRefreshDialogProps> = ({ request }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <RequestRefreshButton onClick={() => setIsOpen(true)} />
      </DialogTrigger>

      <DialogContent>
        <RequestRefreshForm
          afterSubmit={() => setIsOpen(false)} request={request}    />
      </DialogContent>
    </Dialog>
  );
};

export default RequestRefreshDialog;
