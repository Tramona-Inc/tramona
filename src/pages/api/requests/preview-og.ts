// pages/api/requests/preview-og.ts
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

const previewOg = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestId = req.query.id as string;
  console.log(requestId);
  if (!requestId || isNaN(Number(requestId))) {
    return res.status(400).json({ error: "Invalid request ID" }); // 400 Bad Request for invalid input
  }

  try {
    const ctx = await createTRPCContext({ req, res });
    const caller = appRouter.createCaller(ctx);
    const request = await caller.requests.getByIdForPreview({ id: parseInt(requestId) });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error: any) { // Use 'any' for error for now
    if (error instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(error);
      return res.status(httpCode).json({ error: error.message }); // Return status code from TRPCError
    }
    console.error("Error fetching request for OG image:", error);
    res.status(500).json({ error: "Failed to fetch request data" }); // Generic 500 for unexpected errors
  }
};

export default previewOg;