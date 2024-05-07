import React, { useState, useEffect } from "react";
import { Stripe } from "@stripe/stripe-js";
import { Button } from "../ui/button";
import { useVerification, VerificationProvider } from "./VerificationContext";
import { api } from "@/utils/api";
import { ZodUndefined } from "zod";

const IdentityModal = ({
  stripePromise,
}: {
  stripePromise: Promise<Stripe | null>;
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { setVerificationStatus, setShowVerificationBanner } =
    useVerification();
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  const { data: users } = api.users.myVerificationStatus.useQuery();

  useEffect(() => {
    const fetchStripe = async () => {
      try {
        const stripe = await stripePromise;
        setStripe(stripe);
      } catch (error) {
        console.error("Error fetching Stripe:", error);
      }
    };
    fetchStripe();
  }, [stripePromise]);

  useEffect(() => {
    if (
      verificationAttempted &&
      users &&
      users?.isIdentityVerified !== undefined
    ) {
      console.log("Fetched verification status:", users?.isIdentityVerified);
      setVerificationStatus(users?.isIdentityVerified);
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
      setVerificationAttempted(true);
    }
  };

  return (
    <VerificationProvider>
      <Button role="link" disabled={!stripe} onClick={handleClick}>
        Get Verified
      </Button>
    </VerificationProvider>
  );
};

export default IdentityModal;
