import React, { useState, useEffect } from "react";
import type { Stripe } from "@stripe/stripe-js";
import { Button } from "../ui/button";
import { useVerification, VerificationProvider } from "./VerificationContext";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useStripe } from "@/utils/stripe-client";

const IdentityModal = ({ isPrimary = false }: { isPrimary?: boolean }) => {
  const stripePromise = useStripe();

  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { setVerificationStatus, setShowVerificationBanner } =
    useVerification();
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  const { data: users } = api.users.myVerificationStatus.useQuery();

  const { update } = useSession();

  useEffect(() => {
    const fetchStripe = async () => {
      try {
        const stripe = await stripePromise;
        setStripe(stripe);
      } catch (error) {
        console.error("Error fetching Stripe:", error);
      }
    };
    void fetchStripe();
  }, [stripePromise]);

  useEffect(() => {
    if (verificationAttempted && users?.isIdentityVerified !== undefined) {
      console.log("Fetched verification status:", users.isIdentityVerified);
      setVerificationStatus(users.isIdentityVerified);
      setShowVerificationBanner(true);
    }
  }, [
    verificationAttempted,
    ,
    users,
    setVerificationStatus,
    setShowVerificationBanner,
  ]);

  const { data } = api.stripe.createVerificationSession.useQuery();
  const handleClick = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error(
        "Stripe.js hasn't loaded yet. Make sure to disable the button until Stripe.js has loaded.",
      );
      return;
    }

    const { error } = await stripe.verifyIdentity(data ?? "");
    if (error) {
      console.log("[error]", error);
    } else {
      console.log("Verification submitted!");
      void update();
      setVerificationAttempted(true);
    }
  };

  return (
    <VerificationProvider>
      <Button
        role="link"
        variant={isPrimary ? "primary" : "secondary"}
        disabled={!stripe}
        onClick={handleClick}
        className="w-full font-semibold"
      >
        Confirm your identity
      </Button>
    </VerificationProvider>
  );
};

export default IdentityModal;
