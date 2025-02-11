import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HostDashboardRequest } from "@/components/requests/RequestCard";
import { formatCurrency } from "@/utils/utils";
import {
  requestAmountToBaseOfferedAmount,
  unwrapHostOfferAmount,
} from "@/utils/payment-utils/paymentBreakdown";

function OfferPriceBreakdown({ request }: { request: HostDashboardRequest }) {
  const baseAmount = requestAmountToBaseOfferedAmount(request.maxTotalPrice);

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
              <span>{formatCurrency(request.maxTotalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>$80.00</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default OfferPriceBreakdown;
