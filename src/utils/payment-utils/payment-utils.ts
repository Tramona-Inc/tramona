import type { Property } from "@/server/db/schema";
import type { AdditionalFeesOutput } from "@/components/checkout/types";

type MyPartialProperty = Pick<
  Property,
  | "cleaningFeePerStay"
  | "petFeePerStay"
  | "maxGuestsWithoutFee"
  | "extraGuestFeePerNight"
>;

//inputs the fees and calculates based on parameters
export const getAdditionalFees = ({
  property,
  numOfNights,
  numOfPets,
  numOfGuests,
}: {
  property: MyPartialProperty;
  numOfNights: number;
  numOfPets: number | undefined;
  numOfGuests: number;
}): AdditionalFeesOutput => {
  const cleaningFee = property.cleaningFeePerStay;
  const petFee = property.petFeePerStay * (numOfPets ?? 0);

  const maxGuestsWithoutFee = property.maxGuestsWithoutFee;
  const extraGuestFeePerExtraGuest = property.extraGuestFeePerNight;

  let extraGuestFee;
  if (maxGuestsWithoutFee === null || extraGuestFeePerExtraGuest === 0) {
    extraGuestFee = 0;
  } else if (
    typeof maxGuestsWithoutFee === "number" &&
    numOfGuests > maxGuestsWithoutFee &&
    typeof extraGuestFeePerExtraGuest === "number"
  ) {
    extraGuestFee =
      extraGuestFeePerExtraGuest *
      (numOfGuests - maxGuestsWithoutFee) *
      numOfNights;
  } else {
    extraGuestFee = undefined;
  }

  const totalAdditionalFees = cleaningFee + petFee + (extraGuestFee ?? 0);

  return {
    cleaningFee,
    petFee,
    extraGuestFee,
    totalAdditionalFees,
  };
};

export function removeTax(totalBeforeStripe: number, taxRate: number): number {
  // stripe fee must be stripped first
  if (taxRate < 0 || taxRate >= 1) {
    throw new Error("Tax rate must be between 0 and 1");
  }
  const amountWithoutTax = Math.round(totalBeforeStripe / (1 + taxRate));
  return amountWithoutTax;
}

export const getApplicableBookItNowAndRequestToBookDiscountPercentage = (
  property: Pick<Property, "bookItNowHostDiscountPercentOffInput">,
) => {
  const discountPercentage = property.bookItNowHostDiscountPercentOffInput;
  return discountPercentage;
};
