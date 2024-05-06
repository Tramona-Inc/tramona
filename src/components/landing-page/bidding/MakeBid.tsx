import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import BiddingConfirmation from "./BiddingConfirmation";
import BiddingStep1 from "./BiddingStep1";
import BiddingStep2 from "./BiddingStep2";
import IdentityModal from "@/components/_utils/IdentityModal";
import { env } from "@/env";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function MakeBid({ propertyId }: { propertyId: number }) {
  const { data: property, isLoading } = api.properties.getById.useQuery({
    id: propertyId,
  });

  const step = useBidding((state) => state.step);
  const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const [message, setMessage] = useState("");
  const { status, data: session } = useSession();
  const verificationStatus = session?.user.isIdentityVerified;
  
  useEffect(() => {
    switch (verificationStatus) {
      case "pending":
        setMessage(
          "Your identity verification is still pending. Please allow 2-3 minutes for processing. Contact support if this takes longer.",
        );
        break;
      case "false":
        setMessage("To start making offers, help us verify your identity.");
        break;
    }
  }, [verificationStatus]);

  if (verificationStatus === "false" || verificationStatus === "pending") {
    return (
      <>
        <div className="flex flex-col items-center">
          <h1 className="text-md font-semibold tracking-tight md:text-3xl">
            Identity Verification
          </h1>
          <div style={{ position: "relative", width: "50%", height: "200px" }}>
            <Image
              src="/assets/images/welcome/identity.png"
              alt="Identity Verification"
              layout="fill"
              quality={100}
              className="object-cover object-center"
            />
          </div>

          <div className="mx-auto max-w-md">
            <p className="my-2 break-words text-base text-black">{message}</p>
          </div>

          <hr className="mx-auto my-4 h-px w-[90%] border-0 bg-gray-300 md:my-10"></hr>
          {verificationStatus == "false" && (
            <IdentityModal stripePromise={stripePromise} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        property && (
          <div>
            {step == 0 && <BiddingStep1 property={property} />}
            {step == 1 && <BiddingStep2 property={property} />}
            {step == 2 && <BiddingConfirmation property={property} />}
          </div>
        )
      )}
    </>
  );
}

export default MakeBid;