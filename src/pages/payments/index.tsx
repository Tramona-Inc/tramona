import BookingInstructions from "@/components/payment-forms/confirm-pay";
import ConfirmPayment from "@/components/payment-forms/confirm-pay";
import Finalize from "@/components/payment-forms/finalize";
import React from "react";

export default function payment() {
  return (
    <>
      <ConfirmPayment />

      <div className="pt-10" />
      {/* <Finalize /> */}
      {/* <BookingInstructions /> */}
    </>
  );
}
