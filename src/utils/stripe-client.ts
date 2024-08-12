import { env } from "@/env";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useMemo } from "react";

export const useStripe = () => {
  const stripe = useMemo<Promise<Stripe | null>>(
    () => loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    [],
  );

  return stripe;
};

//Stripe frontend function helpers
export function descripeStripeDeclineCode({
  declineCode,
}: {
  declineCode: string;
}): string {
  switch (declineCode) {
    case "authentication_required":
      return "The card was declined because the transaction requires authentication such as 3D Secure. Please try again and authenticate your card, or contact your card issuer for more information." as string;

    case "approve_with_id":
      return "The payment can’t be authorized. Attempt the payment again. If it still can’t be processed, contact your card issuer.";

    case "call_issuer":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "card_not_supported":
      return "The card does not support this type of purchase. Please contact your card issuer to confirm whether your card can be used for this type of purchase.";

    case "card_velocity_exceeded":
      return "The customer has exceeded the balance, credit limit, or transaction amount limit on their card. Please contact your card issuer for more information.";

    case "currency_not_supported":
      return "The card does not support the specified currency. Please check with your card issuer whether the card can be used for the specified currency.";

    case "do_not_honor":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "do_not_try_again":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "duplicate_transaction":
      return "A transaction with identical amount and credit card information was submitted recently. Please check to see if a recent payment already exists.";

    case "expired_card":
      return "The card has expired. Please use another card.";

    case "fraudulent":
      return "The payment was declined because Stripe suspects that it’s fraudulent. Please try again or use another payment method.";

    case "generic_decline":
      return "The card was declined for an unknown reason or Stripe Radar blocked the payment. Please contact your card issuer for more information.";

    case "incorrect_number":
      return "The card number is incorrect. Please try again using the correct card number.";

    case "incorrect_cvc":
      return "The CVC number is incorrect. Please try again using the correct CVC.";

    case "incorrect_pin":
      return "The PIN entered is incorrect. Please try again using the correct PIN.";

    case "incorrect_zip":
      return "The postal code is incorrect. Please try again using the correct billing postal code.";

    case "insufficient_funds":
      return "The card has insufficient funds to complete the purchase. Please use an alternative payment method.";

    case "invalid_account":
      return "The card, or account the card is connected to, is invalid. Please contact your card issuer to check that the card is working correctly.";

    case "invalid_amount":
      return "The payment amount is invalid or exceeds the allowed amount. Please check the amount and try again, or contact your card issuer.";

    case "invalid_cvc":
      return "The CVC number is incorrect. Please try again using the correct CVC.";

    case "invalid_expiry_month":
      return "The expiration month is invalid. Please try again using the correct expiration date.";

    case "invalid_expiry_year":
      return "The expiration year is invalid. Please try again using the correct expiration date.";

    case "invalid_number":
      return "The card number is incorrect. Please try again using the correct card number.";

    case "invalid_pin":
      return "The PIN entered is incorrect. Please try again using the correct PIN.";

    case "issuer_not_available":
      return "The card issuer couldn’t be reached, so the payment couldn’t be authorized. Please try the payment again. If it still can’t be processed, contact your card issuer.";

    case "lost_card":
      return "The payment was declined because the card is reported lost. Please use another card.";

    case "merchant_blacklist":
      return "The payment was declined because it matches a value on the Stripe user's block list. Please try again with another payment method.";

    case "new_account_information_available":
      return "The card, or account the card is connected to, is invalid. Please contact your card issuer for more information.";

    case "no_action_taken":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "not_permitted":
      return "The payment isn’t permitted. Please contact your card issuer for more information.";

    case "offline_pin_required":
      return "The card was declined because it requires a PIN. Please try again by inserting your card and entering the PIN.";

    case "online_or_offline_pin_required":
      return "The card was declined because it requires a PIN. If possible, try the transaction again by inserting your card and entering the PIN.";

    case "pickup_card":
      return "The card can’t be used for this payment (it might be reported lost or stolen). Please contact your card issuer for more information.";

    case "pin_try_exceeded":
      return "The allowable number of PIN tries was exceeded. Please use another card or payment method.";

    case "processing_error":
      return "An error occurred while processing the card. Please try the payment again. If it still can’t be processed, try again later.";

    case "reenter_transaction":
      return "The payment couldn’t be processed by the issuer for an unknown reason. Please try the payment again.";

    case "restricted_card":
      return "The card can’t be used for this payment (it might be reported lost or stolen). Please contact your card issuer for more information.";

    case "revocation_of_all_authorizations":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "revocation_of_authorization":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "security_violation":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "service_not_allowed":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "stolen_card":
      return "The payment was declined because the card is reported stolen. Please use another card.";

    case "stop_payment_order":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "testmode_decline":
      return "A Stripe test card number was used. A genuine card must be used to make a payment.";

    case "transaction_not_allowed":
      return "The card was declined for an unknown reason. Please contact your card issuer for more information.";

    case "try_again_later":
      return "The card was declined for an unknown reason. Please try the payment again later.";

    case "withdrawal_count_limit_exceeded":
      return "The customer has exceeded the balance or credit limit available on their card. Please use another payment method.";

    default:
      return "An unknown error occurred. Please contact your card issuer for more information.";
  }
}
