import { Star } from "lucide-react";
import { UnifiedCheckoutData } from "../types";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { plural } from "@/utils/utils";
import { UnifiedPriceDetails } from "./UnifiedPriceDetails";

export default function CheckoutSummary({
  unifiedCheckoutData,
}: {
  unifiedCheckoutData: UnifiedCheckoutData;
}) {
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
      </div>
      <div className="rounded-md bg-teal-900 md:rounded-b-xl md:rounded-t-none">
        {unifiedCheckoutData.pricing.discount > 0 ? (
          <h2 className="py-1 text-center text-lg font-semibold text-white md:py-2">
            {unifiedCheckoutData.pricing.discount}% Off
          </h2>
        ) : (
          <Separator />
        )}
      </div>
    </div>
  );
}
