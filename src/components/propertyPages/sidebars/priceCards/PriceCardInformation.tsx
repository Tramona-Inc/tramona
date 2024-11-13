import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown, DollarSign, Shield } from "lucide-react";
import React from "react";

function PriceCardInformation() {
  return (
    <div className="mt-6 space-y-3">
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 text-left font-medium hover:bg-gray-100">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-green-600">Tramona Safety Guarantee</span>
          </div>
          <ChevronDown className="h-4 w-4 text-green-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-9 pt-2 text-muted-foreground">
          Our safety guarantee ensures your peace of mind during your stay.
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 text-left font-medium hover:bg-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-green-600">
              Lowest Fees Out of all the major Booking Platforms
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-green-600" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-9 pt-2 text-muted-foreground">
          We pride ourselves on offering the most competitive fees in the
          industry.
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default PriceCardInformation;
