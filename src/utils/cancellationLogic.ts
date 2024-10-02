import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";

// Function to convert Date object to "yyyy-MM-dd" string
function dateToString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function checkCancellation({
  cancellationPolicy,
  checkIn,
  checkOut,
}: {
  cancellationPolicy: string;
  checkIn: Date;
  checkOut: Date;
}) {
  // Convert checkIn and checkOut dates to strings in "yyyy-MM-dd" format
  const checkInStr = dateToString(checkIn);
  const checkOutStr = dateToString(checkOut);

  switch (cancellationPolicy) {
    case "Flexible":
      return flexibleCancel(checkInStr, checkOutStr); // Pass the original Date object to flexibleCancel

    // case "Firm":
    //   return firmCancel(checkInStr, checkOutStr);

    // case "Moderate":
    //   return moderateCancel(checkInStr, checkOutStr);

    // case "Strict":
    //   return strictCancel(checkInStr, checkOutStr);

    // case "Super Strict 30 Days":
    //   return superStrict30DaysCancel(checkInStr, checkOutStr);

    // case "Super Strict 60 Days":
    //   return superStrict60DaysCancel(checkInStr, checkOutStr);

    // case "Long Term":
    //   return longTermCancel(checkInStr, checkOutStr);

    // case "Vacasa":
    //   return vacasaCancel(checkInStr, checkOutStr);

    // case "CB Island Vacations":
    //   return cbIslandVacationsCancel(checkInStr, checkOutStr);

    // case "Evolve":
    //   return evolveCancel(checkInStr, checkOutStr);

    // case "Integrity Arizona":
    //   return integrityArizonaCancel(checkInStr, checkOutStr);

    // case "RedAwning 7 Days":
    //   return redAwning7DaysCancel(checkInStr, checkOutStr);

    // case "RedAwning 14 Days":
    //   return redAwning14DaysCancel(checkInStr, checkOutStr);

    // case "Non-refundable":
    //   return "No refund is provided after booking.";

    default:
      return {
        canCancel: false,
        partialRefund: false,
        numOfRefundableNights: 0,
      };
  }
}

function flexibleCancel(
  checkInStr: string,
  checkOutStr: string,
): {
  canCancel: boolean;
  partialRefund: boolean;
  numOfRefundableNights: number;
} {
  const currentDateStr = dateToString(new Date()); // Get current date as string

  // Calculate days difference using strings (for canCancel and partialRefund)
  const [year1, month1, day1] = currentDateStr.split("-").map(Number);
  const [year2, month2, day2] = checkInStr.split("-").map(Number);

  const date1 = new Date(year1!, month1! - 1, day1); // Month is 0-indexed
  const date2 = new Date(year2!, month2! - 1, day2);
  const timeDifference = date2.getTime() - date1.getTime();
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  const canCancel = daysDifference >= 1; // At least 24 hours before check-in
  const partialRefund = daysDifference < 1 && daysDifference >= 0; // Less than 24 hours before check-in

  // Calculate refundable nights (if applicable)
  let numOfRefundableNights = 0;
  if (currentDateStr >= checkInStr) {
    // Calculate days difference between checkOut and current date
    const [year3, month3, day3] = checkOutStr.split("-").map(Number);
    const date3 = new Date(year3!, month3! - 1, day3);
    const timeDifference2 = date3.getTime() - date1.getTime();
    numOfRefundableNights = Math.floor(timeDifference2 / (1000 * 60 * 60 * 24));
  }
  console.log(canCancel, partialRefund, numOfRefundableNights);

  return { canCancel, partialRefund, numOfRefundableNights };
}

// ... other cancellation policy functions ...

// Example usage:
const checkInDate = new Date("2024-12-01"); // Specify the check-in date
const checkOutDate = new Date("2024-12-10"); // Specify the check-out date
