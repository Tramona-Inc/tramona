import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HostDashboardRequest } from "@/components/requests/RequestCard";
import { formatCurrency } from "@/utils/utils";
import { unwrapHostOfferAmountFromTravelerRequest } from "@/utils/payment-utils/paymentBreakdown";
import type { MyPartialProperty } from "@/utils/payment-utils/payment-utils";

function OfferPriceBreakdown({
  request,
  property,
  hostInputOfferAmount,
}: {
  request: HostDashboardRequest;
  property: MyPartialProperty;
  hostInputOfferAmount?: number;
}) {
  console.log(hostInputOfferAmount);

  const unwrappedBreakdown = unwrapHostOfferAmountFromTravelerRequest({
    request,
    property: property,
    hostInputOfferAmount,
  });

  return (
    <Accordion type="single" collapsible className="border-none">
      <AccordionItem value="price-breakdown" className="border-none">
        <AccordionTrigger className="flex items-center justify-start p-0 text-sm text-muted-foreground transition-colors">
          Price Breakdown
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Traveler amount (Excluding taxes)</span>
              <span>
                {formatCurrency(unwrappedBreakdown.baseOfferedAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Additonal Fees (Cleaning, Pet and Additional Guests)</span>
              <span>
                {formatCurrency(
                  unwrappedBreakdown.additionalFees.totalAdditionalFees,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Host service fee (2.5%)</span>
              <span>{formatCurrency(unwrappedBreakdown.hostServiceFee)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Your payout</span>
              <span>{formatCurrency(unwrappedBreakdown.hostTotalPayout)}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default OfferPriceBreakdown;
