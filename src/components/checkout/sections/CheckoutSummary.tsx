import { Star } from "lucide-react";
import { UnifiedCheckoutData } from "../types";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { plural } from "@/utils/utils";
import { UnifiedPriceDetails } from "./UnifiedPriceDetails";
import PriceCardInformation from "../../propertyPages/sidebars/priceCards/PriceCardInformation";
import { useState } from "react";
import { Shield } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// New TramonaProtectionModal component for mobile
function TramonaProtectionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-4">
            <Shield className="h-5 w-5 text-[#004236]" />
            <h3 className="text-lg font-semibold text-[#004236]">
              Tramona Protection
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              All payments are held by Tramona until 24 hours after check-in to
              ensure your money is safe.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Why Tramona?</p>
              <ul className="space-y-2">
                <li>• Lowest fees out of all major booking platforms</li>
                <li>
                  • Best customer support on the market – 24/7 assistance and
                  rebooking or instant money back guarantee
                </li>
                <li>• Money back guarantee and urgent rebooking assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CheckoutSummary({
  unifiedCheckoutData,
}: {
  unifiedCheckoutData: UnifiedCheckoutData;
}) {
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  return (
    <div>
      <div className="md:rounded-t-xl md:border md:border-b-0 md:p-3">
        <h2 className="mb-4 text-lg font-semibold md:hidden">Price Details</h2>
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <div className="overflow-hidden rounded-xl">
              <Image
                src={unifiedCheckoutData.property.imageUrls[0]!}
                width={100}
                height={100}
                alt=""
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold">
                {unifiedCheckoutData.property.name}
              </h3>
              <p className="text-xs">
                {unifiedCheckoutData.property.propertyType}
              </p>
              <div className="flex items-center gap-1">
                <Star size={10} />
                <p className="text-xs">
                  {unifiedCheckoutData.property.avgRating} (
                  {plural(unifiedCheckoutData.property.numRatings, "review")})
                </p>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <h3 className="font-bold">Included with Tramona</h3>
            <div className="space-y-1 text-muted-foreground">
              <p>Lowest fees on the market</p>
              <p>24/7 concierge support</p>
              <p>Lowest price on the market</p>
              <p>No worries or hassles</p>
            </div>
          </div>
          <Separator className="my-4" />
        </div>
        <UnifiedPriceDetails unifiedCheckoutData={unifiedCheckoutData} />

        {/* Tramona Protection - Mobile Only */}
        <div className="md:hidden">
          <button
            onClick={() => setShowProtectionModal(true)}
            className="flex items-center justify-start gap-1 p-0 text-sm text-[#004236] underline"
          >
            <Shield className="h-4 w-4" />
            Tramona Protection
          </button>
        </div>
        <div className="hidden md:block">
          <PriceCardInformation />
        </div>
      </div>
      <div className="rounded-md bg-teal-900 md:rounded-b-xl md:rounded-t-none">
        {unifiedCheckoutData.pricing.discount > 0 && (
          <h2 className="py-1 text-center text-lg font-semibold text-white md:py-2">
            {unifiedCheckoutData.pricing.discount}% Off
          </h2>
        )}
      </div>
      <TramonaProtectionModal
        isOpen={showProtectionModal}
        onClose={() => setShowProtectionModal(false)}
      />
    </div>
  );
}
