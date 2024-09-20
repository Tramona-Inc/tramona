import { type CancellationPolicyWithInternals } from "@/server/db/schema";
import dayjs from "dayjs";

// note that whitespace matters in template literals, make sure not to indent newlines, or else the spaces will be included in the string

export function getCancellationPolicyDescription(
  policy: CancellationPolicyWithInternals,
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

    case "Vacasa":
      return "For new trips, you can cancel within 24 hours of booking and receive a full refund. If you cancel 30 or more days before check-in, you can receive a refund of any rental payments you’ve made, minus the booking fee and associated taxes. The 24-hour refund option doesn't apply if you book your stay the day before check-in. Reservations cannot be cancelled for a full refund on the day of check-in.";

    case "CB Island Vacations":
      return `Cancellation Policy: A service fee of $300 will be charged for all cancellations. If the cancellation is received
      prior to 60 days of your scheduled check in date, a refund of the deposit minus the
      $300 shall be returned. Cancellations made 60 days or less in advance of the scheduled
      date will receive a refund if the accommodation is re-rented by another party for all of
      the same dates and at the same rate, and pro-rata refunds for partial replacement
      reservations will be provided. However, if we cannot rent the unit then no refund will be
      returned for cancellations made within 60 days of the scheduled stay. There are no
      refunds for late cancellations or early checkouts.`;

    case "Evolve":
      return `Full Refund: Guests can get a full refund if they cancel within 48 hours of booking and at least 14 days before check-in. The 48-hour refund option doesn't apply if you book your stay the day before check-in. Reservations cannot be cancelled for a full refund on the day of check-in.`;

    case "Casamundo":
      return "Hello World";

    case "Non-refundable":
      return "No refund is provided after booking.";
  }
}

export function getFreeCancellationUntil(
  date: Date,
  policy: CancellationPolicyWithInternals,
) {
  const formattedDate = dayjs(date); // Convert Date object to dayjs object

  switch (policy) {
    case "Flexible":
      return formattedDate.subtract(1, "day").format("MMM Do");

    case "Firm":
      return formattedDate.subtract(30, "day").format("MMM Do");

    case "Moderate":
      return formattedDate.subtract(14, "day").format("MMM Do");

    case "Strict":
      return formattedDate.subtract(14, "day").format("MMM Do");

    case "Super Strict 30 Days":
      return formattedDate.subtract(30, "day").format("MMM Do");

    case "Super Strict 60 Days":
      return formattedDate.subtract(60, "day").format("MMM Do");

    case "Long Term":
      return formattedDate.subtract(30, "day").format("MMM Do");

    case "Vacasa":
      return formattedDate.subtract(1, "day").format("MMM Do");

    case "CB Island Vacations":
      return formattedDate.subtract(60, "day").format("MMM Do");
  }
}
