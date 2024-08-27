import { InfoIcon } from "lucide-react";
import { VerificationProvider } from "../_utils/VerificationContext";
import IdentityModal from "../_utils/IdentityModal";

export default function StripeVerificationCard() {
  return (
    <section className="flex flex-col justify-center gap-x-2 rounded-lg border border-red-200 p-4">
      <div className="flex flex-row gap-x-1 font-bold">
        <InfoIcon size={24} className="text-red-400" /> Verify your Identity
      </div>
      <p className="ml-2">
        Hosts are more likely to accept your bid when they know who you are.
      </p>
      <div className="mt-3 flex w-1/4">
        <VerificationProvider>
          <IdentityModal />
        </VerificationProvider>
      </div>
    </section>
  );
}
