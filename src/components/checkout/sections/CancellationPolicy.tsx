import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { UnifiedCheckoutData } from "../types";

export default function CancellationPolicy({
  unifiedCheckoutData,
}: {
  unifiedCheckoutData: UnifiedCheckoutData;
}) {
  const policy = unifiedCheckoutData.property.cancellationPolicy;

  if (!policy) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Cancellation Policy</h3>
      <p className="text-sm font-semibold leading-5 text-muted-foreground">
        {getCancellationPolicyDescription(policy)}
      </p>
    </div>
  );
}
