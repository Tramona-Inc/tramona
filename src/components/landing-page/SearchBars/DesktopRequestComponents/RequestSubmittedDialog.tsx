import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CircleCheckBig, Sparkles } from "lucide-react";
import Confetti from "react-confetti";
import Link from "next/link";
import RequestEmailInvitation from "./RequestEmaiInvitation";
import type { CityRequestForm } from "@/components/landing-page/SearchBars/useCityRequestForm";
import type { LinkRequestForm } from "@/components/landing-page/SearchBars/useLinkRequestForm";

export type FormValues = {
  data: {
    location?: string;
    date?: {
      from: Date;
      to: Date;
    };
    numGuests?: number;
    maxNightlyPriceUSD?: number;
    airbnbLink?: string;
    minNumBathrooms?: number;
    note?: string;
    minNumBeds?: number;
    minNumBedrooms?: number;
  }[];
};

interface RequestSubmittedDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: CityRequestForm | LinkRequestForm;
  curTab: number;
  showConfetti: boolean;
  inviteLink: string | null;
  handleInvite: (emails: string[]) => void;
  isLoading: boolean;
}

function isCityRequestForm(
  form: CityRequestForm | LinkRequestForm,
): form is CityRequestForm {
  return "citySpecificProperty" in form; // Example property unique to CityRequestForm
}

const RequestSubmittedDialog: React.FC<RequestSubmittedDialogProps> = ({
  open,
  setOpen,
  form,
  curTab,
  showConfetti,
  inviteLink,
  handleInvite,
  isLoading,
}) => {
  // Watch the specific data entry for the current tab
  const formData = form.watch(`data.${curTab}`);
  const isCityForm = isCityRequestForm(form);
  // Now we can directly access location or use a fallback
  const location = isCityForm && formData ? formData.location : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="mb-4 flex flex-row items-center text-center text-2xl font-bold">
          <CircleCheckBig color="#528456" className="mr-2" /> Request sent!
        </div>
        <p className="mb-4 ml-8">
          {isCityForm ? (
            <p>
              We sent your request out to every host in <b>{location}</b>. In
              the next 24 hours, hosts will send you properties that match your
              requirements. To check out matches
            </p>
          ) : (
            "Your link has been submitted, either we will get you that property or one just like it. Over the next 24 hours, hosts will reach out with properties that meet your criteria. To view your matches"
          )}
          <Link
            href="/requests"
            className="font-semibold text-neutral-900 underline"
          >
            click here
          </Link>
          .
        </p>
        <hr className="my-4 bg-[#D9D6D1]" />
        <h1 className="text-xl font-bold">Want $0 fees on this trip?</h1>
        <p>
          Add your friends so they can see the matches and stay informed with
          the trip details.
        </p>

        <RequestEmailInvitation
          inviteLink={inviteLink}
          handleInvite={handleInvite}
          isLoading={isLoading}
        />

        <p className="mb-16 flex flex-row items-center rounded-lg bg-[#F1F5F5] p-4 text-sm text-black md:mb-2">
          <Sparkles className="mr-2" />
          Once everyone is added to the trip, Tramona removes all fees.
        </p>

        {showConfetti && (
          <div className="z-100 pointer-events-none fixed inset-0">
            <Confetti width={window.innerWidth} recycle={false} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestSubmittedDialog;
