// import type { NextApiRequest, NextApiResponse } from "next";
// import { emailPMFromCityRequest } from "@/utils/outreach-utils";
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed. Use POST." });
//   }

//   try {
//     const requestData = req.body; // Assuming Lambda will send JSON in the request body

//     // Log the received data (for debugging and monitoring)
//     console.log("Webhook received from Lambda:", requestData);

//     // **Here you would add your logic to process the webhook data.**
//     // For example:
//     // - Update database based on requestId
//     // - Trigger email sending function
//     // - Update UI state via websockets, etc.

//     // For now, just send a 200 OK response to Lambda to acknowledge receipt
//     res.status(200).json({
//       received: true,
//       requestId: requestData.requestId,
//       status: requestData.status,
//     });

//     await emailPMFromCityRequest({});
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res
//       .status(500)
//       .json({ message: "Webhook processing error", error: error.message });
//   }
// }
