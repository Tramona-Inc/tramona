// import { db } from "@/server/db";
// import { and, isNull, gt, notInArray, lt } from "drizzle-orm";
// import { requests } from "@/server/db/schema";
// import { NextApiResponse } from "next";
// import { addHours, formatDistanceToNow } from "date-fns";
// import axios from "axios";

// const processedRequestIds = [
//   1248, 1249, 1250, 1251, 1291, 1300, 902, 1307, 1308, 903, 1311, 1312, 741,
//   755, 756, 747, 797, 748, 764, 738, 732, 734, 742, 785, 779, 736, 737, 739,
//   745, 752, 760, 763, 767, 768, 770, 771, 775, 776, 777, 783, 784, 787, 788,
//   789, 790, 1317, 746, 1318, 803, 810, 811, 812, 814, 815, 816, 817, 820, 826,
//   812, 827, 829, 830, 839, 830, 840, 859, 860, 864, 865, 798, 800, 801, 860,
//   802, 804, 805, 823, 415, 416, 610,
//   //
//   1379, 1388,
//   //
//   1292, 880,
//   //
//   1325, 1345, 1352, 824, 825,
//   //
//   837, 854, 863, 1259, 1260, 1281,
//   //
//   1293, 1319, 1321, 881, 887, 891, 892, 893, 895, 896,
//   //
//   872, 873, 878, 897, 1261, 1262, 809, 813, 1282, 834, 838, 856, 901, 857, 879,
//   894, 874, 912, 917, 918,
//   //
//   919, 921, 922, 1263, 1264, 957, 960, 979, 928, 932, 933, 936, 939, 942, 945,
//   947, 952, 958, 959, 961,
//   //
//   963, 965, 973, 974, 978, 981, 1265, 987, 988, 991, 992, 998, 999, 1000, 1023,
//   983, 984, 986, 995, 996, 997, 1001, 1002, 1003, 1004, 1006, 1007, 1013, 1018,
//   1019,
//   //
//   1020, 1021, 1024, 1025, 1028, 1029, 1030, 1033, 1034, 1035, 1036, 1037, 1039,
//   1266, 1056, 1058, 1061, 1069, 1070, 1072, 1073, 1075, 1092, 1093, 1099, 1100,
//   1041, 1043, 1044, 1047,
//   //
//   1049, 1050, 1051, 1053, 1054, 1055, 1057, 1059, 1060, 1062,
// ];

// export function log(str: unknown) {
//   // appendFileSync(
//   //   "script.log",
//   //   typeof str === "string" ? str : JSON.stringify(str, null, 2),
//   // );
//   // appendFileSync("script.log", "\n");

//   console.log(str);
// }

// export default async function script(_: any, res: NextApiResponse) {
//   const requests_ = await db.query.requests
//     .findMany({
//       where: and(
//         isNull(requests.resolvedAt),
//         gt(requests.checkIn, new Date()),
//         gt(requests.createdAt, new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)),
//         lt(requests.createdAt, new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)),
//         notInArray(requests.id, processedRequestIds),
//       ),
//       with: {
//         offers: true,
//         madeByGroup: { with: { owner: true } },
//       },
//     })
//     .then(
//       (res) =>
//         res.filter((r) =>
//           r.offers.every((o) => o.createdAt < addHours(new Date(), -72)),
//         ),
//       // .slice(0, 10),
//     );

//   log(
//     requests_.map((r) => ({
//       id: r.id,
//       location: r.location,
//       checkIn: r.checkIn,
//       checkOut: r.checkOut,
//       numGuests: r.numGuests,
//       maxTotalPrice: r.maxTotalPrice,
//       numOffers: r.offers.length,
//       requestMadeAt: formatDistanceToNow(r.createdAt),
//       user: r.madeByGroup.owner.email,
//       phoneNumber: r.madeByGroup.owner.phoneNumber,
//     })),
//   );

//   console.log(requests_.map((r) => r.id));

//   const results = await Promise.allSettled(
//     requests_.map(async (request) =>
//       axios.post("https://tramona.com/api/scrape", {
//         requestId: request.id,
//       }),
//     ),
//   );

//   const failedRequests = results.filter((r) => r.status === "rejected");
//   console.log(`${failedRequests.length}/${requests_.length} requests failed`);

//   res.status(200).json({ success: true });
// }
