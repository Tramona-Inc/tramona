import type { Property } from "@/server/db/schema";

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
}) => {
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
