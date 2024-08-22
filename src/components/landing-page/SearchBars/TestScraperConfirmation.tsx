import { LINK_REQUEST_DISCOUNT_PERCENTAGE } from "@/utils/constants";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RequestSubmittedDialog from "./DesktopRequestComponents/RequestSubmittedDialog";
import { type LinkInputProperty } from "@/server/db/schema/tables/linkInputProperties";
import { type Request } from "@/server/db/schema";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import {
  CalendarIcon,
  DollarSignIcon,
  MapPinIcon,
  Users2Icon,
} from "lucide-react";
import { LinkInputPropertyCard } from "@/components/_common/LinkInputPropertyCard";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";

export interface LinkConfirmationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  availableDates: string[];
}

const TestScraperConfirmation: React.FC<LinkConfirmationProps> = ({
  open,
  setOpen,
  availableDates,
}) => {

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="@container">
          <DialogHeader>
            <DialogTitle>Here are the dates</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {availableDates.map((date, index) => (
              <div key={index} className="flex gap-4 items-center">
                <CalendarIcon className="h-5 w-5" />
                <span>{date}</span>
              </div>
            ))}
          </div>

          
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default TestScraperConfirmation;
