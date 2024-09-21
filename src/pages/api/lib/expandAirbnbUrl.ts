import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query;

  try {
    console.log(url);
    if (typeof url == "string") {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
      });
      const expandedUrl = response.url;
      res.status(200).json({ expandedUrl: expandedUrl });
    }
  } catch (error) {
    console.error("Error fetching URL:", error);
    res.status(500).json({ error: "Failed to expand URL" });
  }
}
