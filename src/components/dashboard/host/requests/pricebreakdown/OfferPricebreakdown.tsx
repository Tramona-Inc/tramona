import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatCurrency } from "@/utils/utils";
import type { UnwrapHostOfferAmountFromTravelerRequestOutput } from "@/components/checkout/types";
import { InfoIcon } from "lucide-react";

function OfferPriceBreakdown({
  unwrappedOfferBreakdown,
}: {
  unwrappedOfferBreakdown: UnwrapHostOfferAmountFromTravelerRequestOutput;
}) {
  return (
    <Accordion type="single" collapsible className="border-none">
      <AccordionItem value="price-breakdown" className="border-none">
        <AccordionTrigger className="flex items-center justify-start p-0 text-xs text-muted-foreground transition-colors">
          Price Breakdown
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Traveler&apos;s Total Offer (Excluding taxes)</span>
              <span>
                {formatCurrency(unwrappedOfferBreakdown.baseOfferedAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex flex-row items-center gap-x-1">
                    {" "}
                    Host&apos;s Additional Fees <InfoIcon className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cleaning, Pet, Extra Guests - Host Keeps 100%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <span>
                {formatCurrency(
                  unwrappedOfferBreakdown.additionalFees.totalAdditionalFees,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform Service Fee (2.5%)</span>
              <span>
                {formatCurrency(unwrappedOfferBreakdown.hostServiceFee)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-black">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex flex-row items-center gap-x-1">
                    {" "}
                    Your Payout (Before Taxes) <InfoIcon className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      This is your earnings, excluding any applicable taxes. Tax
                      amounts are collected and handled separately.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span>
                {formatCurrency(unwrappedOfferBreakdown.hostTotalPayout)}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default OfferPriceBreakdown;
