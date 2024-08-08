import { type CancellationPolicy } from "@/server/db/schema";

export function getCancellationPolicyDescription(
  policy: CancellationPolicy,
): string {
  switch (policy) {
    case "Flexible":
      return `Full Refund: Guests can get a full refund if they cancel at least 24 hours before check-in.
Partial Refund: If they cancel less than 24 hours before check-in, the first night is non-refundable, but the rest of the nights will be refunded.
During Stay: If guests decide to leave early, they will get a refund for the remaining nights.`;

    case "Firm":
      return `Full Refund: Guests receive a full refund if they cancel at least 30 days before check-in.
Partial Refund: If they cancel between 7 and 30 days before check-in, they receive a 50% refund of the booking cost.
No Refund: If they cancel less than 7 days before check-in, no refund is provided.
During Stay: Guests do not receive a refund for the remaining nights if they decide to leave early.`;

    case "Moderate":
      return `Full Refund: Guests can get a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.
Partial Refund: If they cancel at least 7 days before check-in, they get a 50% refund of the booking cost.
No Refund: If they cancel less than 7 days before check-in, they will not receive a refund.
During Stay: If guests decide to leave early, they will not get a refund for the remaining nights.`;

    case "Strict":
      return `Full Refund: Guests receive a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.
Partial Refund: If they cancel at least 7 days before check-in, they receive a 50% refund of the booking cost.
No Refund: If they cancel less than 7 days before check-in, no refund is provided.
During Stay: Guests do not receive a refund for the remaining nights if they decide to leave early.`;

    case "Super Strict 30 Days":
      return `Full Refund: Guests can get a full refund if they cancel within 48 hours of booking and at least 30 days before check-in.
Partial Refund: If they cancel at least 30 days before check-in, they get a 50% refund of the booking cost.
No Refund: If they cancel less than 30 days before check-in, they will not receive a refund.`;

    case "Super Strict 60 Days":
      return `Full Refund: Guests can get a full refund if they cancel within 48 hours of booking and at least 60 days before check-in.
Partial Refund: If they cancel at least 60 days before check-in, they get a 50% refund of the booking cost.
During Stay: If they cancel less than 60 days before check-in, they will not receive a refund.`;

    case "Long Term":
      return `First Month: Guests must cancel at least 30 days before check-in to get a full refund of the first month.
Partial Refund: If they cancel less than 30 days before check-in, they get a 50% refund of the first month.
After Check-In: If they cancel during their stay, the next 30 days are non-refundable.`;

    case "Non-refundable":
      return "No refund is provided after booking.";
  }
}
