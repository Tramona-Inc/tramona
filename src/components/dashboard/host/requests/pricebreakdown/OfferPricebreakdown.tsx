import { ChevronDown } from "lucide-react";
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
}: {
  request: HostDashboardRequest;
  property: MyPartialProperty;
}) {
  const unwrappedBreakdown = unwrapHostOfferAmountFromTravelerRequest({
    request,
    property: property,
  });

  return (
    <Accordion type="single" collapsible className="border-none">
      <AccordionItem value="price-breakdown">
        <AccordionTrigger className="flex items-center justify-start p-0 text-sm text-muted-foreground transition-colors">
          View more
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
              <span>Offer amount</span>
              <span>
                {formatCurrency(
                  unwrappedBreakdown.baseOfferedAmount -
                    unwrappedBreakdown.additionalFees.totalAdditionalFees,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Additonal Fees</span>
              <span>
                {formatCurrency(
                  unwrappedBreakdown.additionalFees.totalAdditionalFees,
                )}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total payout</span>
              <span>{formatCurrency(unwrappedBreakdown.hostPayout)}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default OfferPriceBreakdown;
