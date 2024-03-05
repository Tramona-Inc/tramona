import { z } from "zod";

export type Referral = {
  id: number;
  referralCode: string;
  createdAt: Date;
  referee: {
    name: string | null;
  };
  offer: {
    totalPrice: number;
  };
  earningStatus: "pending" | "paid" | "cancelled";
  cashbackEarned: number;
};

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

// export const referrals: Referral[] = [
//   {
//     date: "12/23/23",
//     name: "Zaire Donin",
//     status: "paid",
//     amount: 144,
//     cashback: "20.4",
//   },
//   {
//     date: "12/23/23",
//     name: "Makenna Bergson",
//     status: "paid",
//     amount: 101,
//     cashback: "10.8",
//   },
//   {
//     date: "12/23/23",
//     name: "Kadin Calzoni",
//     status: "pending",
//     amount: 125,
//     cashback: "16.2",
//   },
//   {
//     date: "12/23/23",
//     name: "Mira Lubin",
//     status: "pending",
//     amount: 89,
//     cashback: "13.2",
//   },
//   {
//     date: "12/23/23",
//     name: "Desirae Herwitz",
//     status: "cancelled",
//     amount: 76,
//     cashback: "12.9",
//   },
// ];
