
import { NextApiResponse } from "next";

import { NextApiRequest } from "next";
import { proxyAgent } from "@/server/server-utils";
import axios, { AxiosResponse } from "axios";



function getDatesArray(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0] ?? "");
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

interface CalendarResponse {
  content: {
    days: Record<string, number>;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Scrape request received");

  const { offerId, checkIn, checkOut } = req.body as {
    offerId: string;
    checkIn: Date;
    checkOut: Date;
  };

  if (!offerId || !checkIn || !checkOut) {
    return res.status(400).json({ error: "Missing offerId, checkIn, or checkOut parameter" });
  }

  const url = `https://www.casamundo.com/api/v2/calendar/${offerId}`;

  let currentYear: number = checkIn.getFullYear();
  let currentMonth: number = checkIn.getMonth() + 1;

  const days: Record<string, number> = {};

  const maxRetries = 3;

  while (
    currentYear < checkOut.getFullYear() ||
    (currentYear === checkOut.getFullYear() &&
      currentMonth <= checkOut.getMonth() + 1)
  ) {
    let success = false;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response: AxiosResponse<CalendarResponse> = await axios.get(url, {
          params: {
            year: currentYear,
            month: currentMonth,
          },
          httpsAgent: proxyAgent,
          headers: {
            accept: "application/json",
            "accept-language": "en-US,en;q=0.9",
          },
        });

        Object.assign(days, response.data.content.days);
        success = true;
        break; // Success, exit retry loop
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`Axios error for ${currentYear}-${currentMonth}:`, error.message);
          if (error.response?.status === 522) {
            console.error("Connection timeout error (522). Retrying...");
          }
        } else {
          console.error(`Non-Axios error for ${currentYear}-${currentMonth}:`, error);
        }
        // No delay here, it will immediately retry
      }
    }

    if (!success) {
      console.error(`Failed to fetch data for ${currentYear}-${currentMonth} after ${maxRetries} attempts`);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  const stayDates = getDatesArray(checkIn, checkOut);
  const isAvailable = stayDates.every((date) => days[date] === 2);

  return res.status(200).json({ isAvailable });
}
