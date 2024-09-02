import { z } from "zod";

export const referralCashbackSchema = z.object({
  id: z.number().int(),
  referralCode: z.string(),
  createdAt: z.date(),
  referee: z.object({ name: z.string().nullable() }),
  offer: z.object({ totalPrice: z.number().int().nullable() }),
  earningStatus: z.enum(["pending", "paid", "cancelled"]),
  cashbackEarned: z.number(),
});

export type ReferralCashback = z.infer<typeof referralCashbackSchema>;
