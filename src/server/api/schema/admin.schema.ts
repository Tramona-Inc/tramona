import z from "zod";

export const createRequestInputSchema = z.object({
  max_preferred_price: z.number().min(1),
  location: z.string().min(1),
  check_in: z.date(),
  check_out: z.date(),
  num_guests: z.number().default(1),
  min_num_bed: z.number().default(1),
  min_num_bedrooms: z.number().default(1),
  property_type: z.string(),
  note: z.string(),
});

export type CreateRequestInput = z.TypeOf<typeof createRequestInputSchema>;
