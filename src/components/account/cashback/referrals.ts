export type Referral = {
  id: number;
  referralCode: string;
  createdAt: Date;
  refereeId: string & {
    name: string | null;
  };
  offerId: number;
  earningStatus: "pending" | "paid" | "cancelled";
  cashbackEarned: number;
};

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
