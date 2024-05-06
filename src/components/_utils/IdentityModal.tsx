import { api } from "@/utils/api";
import { Button } from "../ui/button";
import React, { useState, useEffect } from 'react';
import { Stripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

const IdentityModal = ({ stripePromise } : {stripePromise: Promise<Stripe | null>}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { update } = useSession();

  useEffect(() => {
    const fetchStripe = async () => {
      setStripe(await stripePromise);
    };
    fetchStripe().catch((error) => {
      // Handle any errors that occur during the fetchStripe function
      console.error('Error fetching Stripe:', error);
    });
  }, [stripePromise]);

    const {data} = api.stripe.createVerificationSession.useQuery()

  const handleClick = async () => {
    const stripe = await stripePromise;


    if (!stripe) {
      // Stripe.js hasn't loaded yet. Make sure to disable
      // the button until Stripe.js has loaded.
      return;
    }

    // Call your backend to create the VerificationSession.
    // Show the verification modal.
    const { error } = await stripe.verifyIdentity(data ?? "");

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('Verification submitted!');
      await update();
    }
  };

  return (
    <Button role="link" disabled={!stripe} onClick={handleClick}>
      Get Verified
    </Button>
  );
};

export default IdentityModal;