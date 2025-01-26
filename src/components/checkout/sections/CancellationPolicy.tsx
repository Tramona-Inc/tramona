import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { UnifiedCheckoutData } from "../types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
        <DialogContent className="pb-4">
          <div className="py-12 text-center">
            {getCancellationPolicyDescription(policy)}
          </div>
        </DialogContent>
      </Dialog>
      <div className="mt-4 border-t pb-6 pt-6">
        <h3 className="text-lg font-semibold">Write a message to the host</h3>
        <h4 className="text-sm font-semibold text-muted-foreground">
          Before you can continue, let (Host Name) know a little about your trip
          and why their place is a good fit
        </h4>
        <div className="mt-2 flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <img
              src="/placeholder-user.jpg" // Replace with actual host profile pic
              alt="Host Profile"
              className="object-cover"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
          <div>
            <p className="font-semibold">Host Name</p>{" "}
            {/* Replace with actual host name */}
            <p className="text-sm text-muted-foreground">
              Joined: 01/01/2023 {/* Replace with actual join date */}
            </p>
          </div>
        </div>
        <textarea
          className="mt-2 w-full rounded-md border border-gray-700 p-2"
          placeholder="Enter additional notes here"
          rows={3}
        />
      </div>
    </div>
  );
}
