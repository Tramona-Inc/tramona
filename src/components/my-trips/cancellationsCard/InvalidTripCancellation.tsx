import { useState } from "react";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function InvalidTripCancellation({
  tripId,
  cancellationPolicy,
}: {
  tripId: number;
  cancellationPolicy: string;
}) {
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  return (
    <div className="flex flex-col items-end">
      <div className="self-start text-start text-xl font-bold">
        {" "}
        Request Cancellation{" "}
      </div>
      <div className="mt-4 text-sm">
        <p>
          {" "}
          The deadline to cancel this trip has passed. Please review the
          cancellation policy for more details.{" "}
        </p>
      </div>
      <Button
        variant="link"
        onClick={() => setShowCancellationPolicy(!showCancellationPolicy)}
        className="text-bold"
      >
        {showCancellationPolicy
          ? "Hide property's cancellation policy"
          : "View this property's cancellation policy"}
      </Button>
      {showCancellationPolicy && (
        <div className="text-sm text-accent-foreground">
          {getCancellationPolicyDescription(cancellationPolicy)}{" "}
        </div>
      )}
      <Separator className="mt-4" />
      <div className="my-4 flex flex-row items-center gap-x-3 text-sm">
        <p>
          If you believe there has been an error with your booking, you may
          request a refund.{" "}
        </p>
        <Button variant="outline">
          <Link href={`my-trips/requests-cancellation/${tripId}`}>
            Request Refund
          </Link>
        </Button>
      </div>
    </div>
  );
}
