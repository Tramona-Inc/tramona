import { api } from "@/utils/api";
import { Button } from "../ui/button";
import React, { useState, useEffect } from 'react';
import { Stripe } from "@stripe/stripe-js";


const IdentityModal = ({ stripePromise } : {stripePromise: Promise<Stripe | null>}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    const fetchStripe = async () => {
      setStripe(await stripePromise);
    };
    fetchStripe();
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
    }
  };

  return (
    <Button role="link" disabled={!stripe} onClick={handleClick}>
      Get Verified
    </Button>
  );
};

export default IdentityModal;