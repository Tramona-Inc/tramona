import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { useState } from "react";
  import CreateRequestForm from "./RequestForm";
import {type RequestCardDataType} from "@/components/activity-feed/ActivityFeed";
import { toast } from '@/components/ui/use-toast';
import { api } from "@/utils/api";
import { errorToast } from '@/utils/toasts';
import { Button } from "@/components/ui/button";
  
  export default function CreateRequestDialog({
    children,
    request,
  }: React.PropsWithChildren<{request?: RequestCardDataType}>) {
    const [isOpen, setIsOpen] = useState(false);
  const deleteFillerRequest = api.feed.deleteFillerRequest.useMutation();

    async function deleteRequest() {
      if (!request) return;
      await deleteFillerRequest
        .mutateAsync({ id: request?.id })
        .then(() => toast({ title: "Sucessfully deleted request" }))
        .catch(() => errorToast());
      setIsOpen(false);
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogClose className="hidden" />
        <DialogTrigger asChild>{children}</DialogTrigger>
  
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{request? "Update" : "Create"} a filler request</DialogTitle>
            <DialogDescription>
              {request? "Update" : "Create"} a filler request with user name, travel time, location, request creation time, and nightly price
            </DialogDescription>
            <div className="flex flex-row justify-end">
            {request && 
              <Button
                onClick={() => deleteRequest()}
                className="rounded-full"
                variant={"outline"}
              >
                Delete
              </Button>
            }
            </div>
          </DialogHeader>
          <CreateRequestForm
            afterSubmit={() => setIsOpen(false)}
            request={request}
          />
          
        </DialogContent>
      </Dialog>
    );
  }
  