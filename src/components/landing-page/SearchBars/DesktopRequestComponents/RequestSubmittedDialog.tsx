import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowRightIcon, CircleCheckBig, Sparkles } from "lucide-react";
import Confetti from "react-confetti";
import Link from "next/link";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
interface RequestSubmittedDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  showConfetti: boolean;
  madeByGroupId: number | undefined;
  location?: string;
  isRequestsPage?: boolean;
}

const RequestSubmittedDialog: React.FC<RequestSubmittedDialogProps> = ({
  open,
  setOpen,
  showConfetti,
  madeByGroupId,
  location,
  isRequestsPage = false,
}) => {
  // Watch the specific data entry for the current tab
  // Now we can directly access location or use a fallback
  const [groupId, setGroupId] = useState<number | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const inviteLinkQuery = api.groups.generateInviteLink.useQuery(
    { groupId: groupId! },
    { enabled: groupId !== null },
  );

  useEffect(() => {
    if (inviteLinkQuery.data) {
      setInviteLink(inviteLinkQuery.data.link);
    }
  }, [inviteLinkQuery.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="mb-4 flex flex-row items-center text-center text-2xl font-bold">
          <CircleCheckBig color="#528456" className="mr-2" /> Success! Your
          Request Has Been Sent!
        </div>
        <p className="mb-4 ml-8">
          {location ? (
            <>
              Your request has been sent to every host in <b>{location}</b>.
              Over the next 24 hours, hosts will send you exclusive deals for
              their properties. Keep an eye out for a text message notifying you
              of these one-of-a-kind offers!
            </>
          ) : (
            <>
              Your link has been submitted! Either we will get you that property
              or one just like it. Over the next 24 hours, hosts will send you
              exclusive deals for their properties. Keep an eye out for a text
              message notifying you of these one-of-a-kind offers!
            </>
          )}
        </p>
        {/* <hr className="my-4 bg-[#D9D6D1]" />
        <h1 className="text-xl font-bold">Want $0 fees on this trip?</h1>
        <p>
          Add your friends so they can see the matches and stay informed with
          the trip details.
        </p>

        {madeByGroupId && (
          <RequestEmailInvitation
            inviteLink={inviteLink}
            madeByGroupId={madeByGroupId}
          />
        )} */}

        {showConfetti && (
          <div className="z-100 pointer-events-none fixed inset-0">
            <Confetti width={window.innerWidth} recycle={false} />
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Done</Button>
          </DialogClose>
          {!isRequestsPage && (
            <Button asChild>
              <Link href="/requests">
                View all requests <ArrowRightIcon />
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestSubmittedDialog;
