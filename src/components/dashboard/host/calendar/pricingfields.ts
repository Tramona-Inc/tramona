import { z } from "zod";

export const extraPricingFields = [
  "cleaningFeePerStay",
  "petFeePerStay",
  "extraGuestFeePerNight",
] as const;

export type ExtraPricingField = (typeof extraPricingFields)[number];

export const extraPricingFieldSchema = z.enum(extraPricingFields);
