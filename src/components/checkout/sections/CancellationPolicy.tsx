import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { UnifiedCheckoutData } from "../types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

export default function CancellationPolicy({
  unifiedCheckoutData,
}: {
  unifiedCheckoutData: UnifiedCheckoutData;
}) {
  const policy = unifiedCheckoutData.property.cancellationPolicy
    ? unifiedCheckoutData.property.cancellationPolicy
    : unifiedCheckoutData.property.originalListingPlatform;

  if (!policy) return null;

  return (
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">Cancellation Policy</h3>
      <p className="text-sm font-semibold leading-5 text-muted-foreground">
        {getCancellationPolicyDescription(policy)}
      </p>
      <Dialog>
        <DialogTrigger className="py-1 text-sm font-semibold underline underline-offset-2">
          Full policy
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="bg-white" />
          <DialogContent className="">
            <div className="py-12 text-center">
              {getCancellationPolicyDescription(policy)}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
