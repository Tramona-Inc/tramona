import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HostDashboardRequest } from "@/components/requests/RequestCard";
import type { HostDashboardPropertyRequest } from "../city/HostRequestCard";
import { formatCurrency } from "@/utils/utils";
import { unwrapHostOfferAmountFromTravelerRequest } from "@/utils/payment-utils/paymentBreakdown";

function OfferPriceBreakdown({
  request,
  property,
}: {
  request: HostDashboardRequest;
  property: HostDashboardPropertyRequest;
}) {
  const unwrappedBreakdown = unwrapHostOfferAmountFromTravelerRequest({
    request,
    property: property,
  });

  return (
    <Accordion type="single" collapsible className="">
      <AccordionItem value="price-breakdown">
        <AccordionTrigger className="flex items-center justify-start p-0 text-sm text-muted-foreground transition-colors">
          View more
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>{formatCurrency(2222)}</span>
            </div>
            <div className="flex justify-between">
              <span>Host payout</span>
              <span>{formatCurrency(request.maxTotalPrice)}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default OfferPriceBreakdown;
