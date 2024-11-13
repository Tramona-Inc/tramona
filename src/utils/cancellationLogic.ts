import { Property, Trip } from "@/server/db/schema";

// Function to convert Date object to "yyyy-MM-dd" string
function dateToString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Helper function to calculate days difference
function getDaysDifference(dateStr1: string, dateStr2: string): number {
  console.log(dateStr1);
  console.log(dateStr2);

  const [year1, month1, day1] = dateStr1.split("-").map(Number);
  const [year2, month2, day2] = dateStr2.split("-").map(Number);
  const date1 = new Date(year1!, month1! - 1, day1);
  const date2 = new Date(year2!, month2! - 1, day2);

  const timeDifference = date2.getTime() - date1.getTime();
  return timeDifference / (1000 * 60 * 60 * 24);
}

export function checkCancellation(
  trip: Pick<Trip, "checkIn" | "checkOut" | "createdAt"> & {
    property: Pick<Property, "cancellationPolicy" | "checkInTime">;
  },
): {
  canCancel: boolean;
  partialRefund: boolean;
  numOfRefundableNights: number;
  partialRefundPercentage: number;
  description?: string;
  cancellationFee?: number;
} {
  // Convert checkInDate and checkOutDate dates to strings in "yyyy-MM-dd" format
  const checkInStr = dateToString(trip.checkIn);
  const checkOutStr = dateToString(trip.checkOut);
  console.log(checkInStr);
  console.log(checkOutStr);
  const bookingDateString = dateToString(trip.createdAt);

  const daysDifference = getDaysDifference(
    dateToString(new Date()), // Current date first
    checkInStr, //check-in date second
  );
  const daysSinceBooking = getDaysDifference(
    dateToString(new Date()),
    bookingDateString,
  );

  switch (trip.property.cancellationPolicy) {
    case "Flexible":
      return flexibleCancel(
        daysDifference,
        checkInStr,
        checkOutStr,
        trip.property.checkInTime,
      );

    case "Firm":
      return firmCancel(daysDifference);

    case "Moderate":
      return moderateCancel(daysDifference, daysSinceBooking);
    case "Strict": // Same logic as "Moderate" for these conditions
      return strictCancel(daysDifference, daysSinceBooking);

    case "Super Strict 30 Days":
      return superStrictCancel(daysDifference, daysSinceBooking, 30);

    case "Super Strict 60 Days":
      return superStrictCancel(daysDifference, daysSinceBooking, 60);

    case "Long Term":
      return longTermCancel(daysDifference, checkInStr);

    case "Non-refundable":
      return nonRefundable();

    //scrapers
    case "Vacasa":
      return vacasaCancel(daysDifference, daysSinceBooking);

    case "Integrity Arizona":
      return integrityArizonaCancel(daysDifference);

    case "Evolve":
      return evolveCancel(daysDifference, daysSinceBooking);

    case "CB Island Vacations":
      return cbIslandVacationsCancel(daysDifference);

    case "RedAwning 7 Days":
      return redAwning7DaysCancel(daysDifference);

    case "RedAwning 14 Days":
      return redAwning14DaysCancel(daysDifference);

    default:
      return {
        canCancel: false,
        partialRefund: false,
        numOfRefundableNights: 0,
        partialRefundPercentage: 1,
      };
  }
}

function flexibleCancel(
  daysDifference: number,
  checkInStr: string,
  checkOutStr: string,
  checkInTime: string, // Add checkInTime parameter
) {
  console.log(checkInTime);
  console.log(daysDifference);
  const canCancel = daysDifference >= 1;
  const partialRefund = daysDifference < 1 && daysDifference >= 0;
  const partialRefundPercentage = 1;
  let numOfRefundableNights = 0;
  const currentDate = dateToString(new Date());

  if (currentDate > checkInStr) {
    numOfRefundableNights = Math.floor(
      getDaysDifference(checkOutStr, currentDate),
    );
  } else if (currentDate === checkInStr) {
    // Check if current time is past check-in time
    const [hours, minutes, seconds] = checkInTime.split(":").map(Number);
    const checkInDateTime = new Date(
      new Date().setHours(hours!, minutes, seconds),
    );
    if (new Date() >= checkInDateTime) {
      numOfRefundableNights = Math.floor(
        getDaysDifference(checkOutStr, currentDate),
      );
    }
  }
  const description = "";

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function firmCancel(daysDifference: number) {
  console.log(daysDifference);
  const canCancel = daysDifference >= 30;
  const partialRefund = daysDifference >= 7 && daysDifference < 30;
  const partialRefundPercentage = 0.5;
  const numOfRefundableNights = 0;

  console.log(
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
  );

  const description = `Unfortunately, your trip falls within the 30-day cancellation window. As per our policy, this means you're eligible for a 50% refund of the total trip cost. We understand this may not be ideal, and we apologize for any inconvenience.`;

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function moderateCancel(daysDifference: number, daysSinceBooking: number) {
  let canCancel = false;
  let partialRefund = false;
  let partialRefundPercentage = 0; // Default to no refund

  // Full refund: Cancel within 48 hours of booking and at least 14 days before check-in
  if (daysSinceBooking <= 2 && daysDifference >= 14) {
    canCancel = true;
    partialRefundPercentage = 1; // Full refund
  }
  // Partial refund: Cancel between 7 to 14 days before check-in
  else if (daysDifference >= 7 && daysDifference < 14) {
    partialRefund = true;
    partialRefundPercentage = 0.5; // 50% refund
  }
  // No refund: Cancel less than 7 days before check-in
  else if (daysDifference < 7) {
    partialRefund = false;
    partialRefundPercentage = 0; // No refund
  }

  const numOfRefundableNights = 0; // No refunds for remaining nights during stay
  const description = `Full Refund: Guests can get a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.
Partial Refund: If they cancel at least 7 days before check-in, they get a 50% refund of the booking cost.
No Refund: If they cancel less than 7 days before check-in, they will not receive a refund.
During Stay: If guests decide to leave early, they will not get a refund for the remaining nights.`;

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function strictCancel(daysDifference: number, daysSinceBooking: number) {
  let partialRefundPercentage = 1;
  let canCancel = daysSinceBooking <= 2 && daysDifference >= 14;
  let partialRefund = false;
  if (daysDifference >= 14) {
    // Full refund if canceled within 48 hours and at least 14 days before check-in
    canCancel = daysSinceBooking <= 2 && daysDifference >= 14;
    partialRefund = false;
    partialRefundPercentage = 1;
  } else if (daysDifference >= 7 && daysDifference < 14) {
    // Partial refund (50%) if canceled 7-14 days before check-in
    partialRefund = true;
    partialRefundPercentage = 0.5;
  } else {
    // No refund if less than 7 days before check-in
    partialRefund = false;
    partialRefundPercentage = 0;
  }
  const numOfRefundableNights = 0;
  const description = `Full Refund: Guests receive a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.
Partial Refund: If they cancel at least 7 days before check-in, they receive a 50% refund of the booking cost.
No Refund: If they cancel less than 7 days before check-in, no refund is provided.`;

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function superStrictCancel(
  daysDifference: number,
  daysSinceBooking: number,
  daysBeforeCheckIn: number,
) {
  const partialRefundPercentage = 1;
  const canCancel =
    daysSinceBooking <= 2 && daysDifference >= daysBeforeCheckIn;
  const partialRefund = daysDifference >= daysBeforeCheckIn;
  const numOfRefundableNights = 0;
  const description = " ";
  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function longTermCancel(daysDifference: number, checkInStr: string) {
  const partialRefundPercentage = 1;
  const canCancel = daysDifference >= 30;
  const partialRefund = daysDifference < 30 && daysDifference >= 0;
  const numOfRefundableNights =
    dateToString(new Date()) >= checkInStr ? -30 : 0;

  const description = " ";
  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function nonRefundable() {
  const canCancel = false;
  const partialRefund = false;
  const numOfRefundableNights = 0;
  const partialRefundPercentage = 0;
  const description = "This property is not refundable";

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function integrityArizonaCancel(daysDifference: number) {
  const canCancel = daysDifference >= 30;
  const partialRefund = daysDifference >= 14 && daysDifference < 30;
  const partialRefundPercentage = partialRefund ? 0.5 : canCancel ? 1 : 0;
  const numOfRefundableNights = 0;
  const description = `Bookings canceled at least 30 days before the start of the stay will receive a full refund. Cancellations made between 14 to 30 days before the start of the stay will receive a 50% refund.`;

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function cbIslandVacationsCancel(daysDifference: number) {
  let canCancel = false;
  let partialRefund = false;
  let partialRefundPercentage = 0;
  let description = `A service fee of $300 will be charged for all cancellations.`;
  const cancellationFee = 30000;
  // Cancellation 60+ days before check-in: Full refund minus $300 service fee
  if (daysDifference > 60) {
    canCancel = true;
    partialRefundPercentage = 1; // Full refund
    description += ` Since your cancellation was made 60+ days before the scheduled check-in date, you will receive a refund of the deposit minus the $300 service fee.`;
  }
  // Cancellation within 60 days of check-in: Refund only if re-rented
  else if (daysDifference <= 60) {
    // if (isReRented) {
    //   canCancel = true;
    //   partialRefund = true;
    //   partialRefundPercentage = proRataRefund || 1; // Either full or pro-rata refund
    //   description += ` Since the unit was re-rented, you will receive a refund ${
    //     proRataRefund
    //       ? `for the re-rented portion of the stay (pro-rata refund).`
    //       : `for the full reservation minus the $300 service fee.`
    //   }`;
    // } else {
    // No refund if the unit is not re-rented
    canCancel = false;
    partialRefund = false;
    partialRefundPercentage = 0;
    description += ` Since the unit was not re-rented, no refund will be provided for your cancellation within 60 days of the scheduled stay.`;
  }
  return {
    canCancel,
    partialRefund,
    numOfRefundableNights: 0, // No nights refunded if not re-rented
    partialRefundPercentage,
    cancellationFee,
    description,
  };
}

function vacasaCancel(daysDifference: number, daysSinceBooking: number) {
  let canCancel = false;
  let partialRefund = false;
  let partialRefundPercentage = 0; // Default to no refund

  // Full refund if canceled within 24 hours of booking
  if (daysSinceBooking <= 1) {
    canCancel = true;
    partialRefundPercentage = 1; // Full refund within 24 hours of booking
  }
  // Full refund if canceled 30+ days before check-in
  else if (daysDifference >= 30) {
    canCancel = true;
    partialRefundPercentage = 1; // Full refund
  }
  // Partial refund if canceled between 14 to 30 days before check-in
  else if (daysDifference >= 14 && daysDifference < 30) {
    partialRefund = true;
    partialRefundPercentage = 0.5; // 50% refund
  }
  // No refund if canceled less than 14 days before check-in
  else if (daysDifference < 14) {
    partialRefund = false;
    partialRefundPercentage = 0; // No refund
  }

  const numOfRefundableNights = 0; // No refunds for remaining nights during stay
  const description = `Full refund available if canceled within 24 hours of booking or if canceled 30+ days before check-in. A 50% refund is available if canceled between 14 to 30 days before check-in. No refund is provided for cancellations made less than 14 days before check-in.`;

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function evolveCancel(daysDifference: number, daysSinceBooking: number) {
  const canCancel = daysSinceBooking <= 2 && daysDifference >= 14;
  const partialRefund = false; // No partial refunds are provided after 48 hours
  const partialRefundPercentage = canCancel ? 1 : 0;
  const numOfRefundableNights = 0;
  const description = `Full refund available within 48 hours of booking if cancellation occurs at least 14 days before check-in. No cancellations are allowed on the day of check-in.`;

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function redAwning7DaysCancel(daysDifference: number) {
  const canCancel = daysDifference >= 7;
  const partialRefund = false;
  const partialRefundPercentage = canCancel ? 1 : 0;
  const numOfRefundableNights = 0;
  const description = `This reservation may be canceled for a 100% refund at least 7 days or more before arrival date. No refund is provided after that period.`;

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}

function redAwning14DaysCancel(daysDifference: number) {
  const canCancel = daysDifference >= 14;
  const partialRefund = false; // No partial refunds are offered after 14 days
  const partialRefundPercentage = canCancel ? 1 : 0; // 100% refund if canceled 14+ days before
  const numOfRefundableNights = 0;
  const description = `This reservation may be canceled for a 100% refund at least 14 days or more before arrival date. No refund is provided after that period.`;

  return {
    canCancel,
    partialRefund,
    numOfRefundableNights,
    partialRefundPercentage,
    description,
  };
}
