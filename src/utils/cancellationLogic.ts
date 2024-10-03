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
  console.log(date1.getTime());
  console.log(date2.getTime());
  const timeDifference = date2.getTime() - date1.getTime();
  return timeDifference / (1000 * 60 * 60 * 24);
}

export function checkCancellation({
  cancellationPolicy,
  checkInDate,
  checkOutDate,
  checkInTime,
  checkOutTime,
  bookingDate,
}: {
  cancellationPolicy: string;
  checkInDate: Date;
  checkOutDate: Date;
  checkInTime: string;
  checkOutTime: string;
  bookingDate: Date;
}): {
  canCancel: boolean;
  partialRefund: boolean;
  numOfRefundableNights: number;
  partialRefundPercentage: number;
  description?: string;
} {
  // Convert checkInDate and checkOutDate dates to strings in "yyyy-MM-dd" format
  const checkInStr = dateToString(checkInDate);
  const checkOutStr = dateToString(checkOutDate);
  console.log(checkInStr);
  console.log(checkOutStr);
  const bookingDateString = dateToString(bookingDate);

  const daysDifference = getDaysDifference(
    dateToString(new Date()), // Current date first
    checkInStr, //check-in date second
  );
  const daysSinceBooking = getDaysDifference(
    dateToString(new Date()),
    bookingDateString,
  );

  switch (cancellationPolicy) {
    case "Flexible":
      return flexibleCancel(
        daysDifference,
        checkInStr,
        checkOutStr,
        checkInTime,
      );

    case "Firm":
      return firmCancel(daysDifference);

    case "Moderate":
      let isStrict = false;
      return moderateOrStrictCancel(daysDifference, daysSinceBooking, isStrict);
    case "Strict": // Same logic as "Moderate" for these conditions
      isStrict = true;
      return moderateOrStrictCancel(daysDifference, daysSinceBooking, isStrict);

    case "Super Strict 30 Days":
      return superStrictCancel(daysDifference, daysSinceBooking, 30);

    case "Super Strict 60 Days":
      return superStrictCancel(daysDifference, daysSinceBooking, 60);

    case "Long Term":
      return longTermCancel(daysDifference, checkInStr);

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

function moderateOrStrictCancel(
  daysDifference: number,
  daysSinceBooking: number,
  isStrict: boolean,
) {
  const partialRefundPercentage = 1;
  const canCancel = daysSinceBooking <= 2 && daysDifference >= 14;
  const partialRefund = isStrict
    ? daysDifference >= 7 && daysDifference < 14
    : daysDifference >= 7;
  const numOfRefundableNights = 0;
  const description = "";
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

// Example usage:
const checkInDate = new Date("2024-12-01"); // Specify the check-in date
const checkOutDate = new Date("2024-12-10"); // Specify the check-out date
