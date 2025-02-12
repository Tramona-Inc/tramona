import { ImageResponse } from "@vercel/og";
import { type RouterOutputs } from "@/utils/api";
import { CalendarIcon } from "lucide-react";
import TramonaIcon from "@/components/_icons/TramonaIcon";
export const runtime = "edge";

type RequestPreview = RouterOutputs["requests"]["getByIdForPreview"];

/* eslint-disable @next/next/no-img-element */
import { type NextRequest } from "next/server";
// import { ImageResponse } from "@vercel/og";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils"; // Import utility functions
import { formatDistanceToNowStrict } from "date-fns";

async function fetchRequestData(requestId: string, baseUrl: string) {
  try {
    const res = await fetch(
      `${baseUrl}/api/requests/preview-og?id=${requestId}`,
    ); // Create a new API endpoint for OG data
    if (!res.ok) {
      console.error(
        `Failed to fetch request data: ${res.status} ${res.statusText}`,
      );
      return null;
    }
    const data = (await res.json()) as RequestPreview; // Type as needed, or use `any` for quick setup
    return data;
  } catch (error) {
    console.error("Error fetching request data:", error);
    return null;
  }
}

export default async function handler(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("host");
  const baseUrl = `${protocol}://${host}`;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const cover = searchParams.get("cover");
  const requestId = searchParams.get("requestId");

  if (type === "requestPreview") {
    if (!requestId) {
      return new ImageResponse(
        (
          <div
            style={{
              background: "white",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            Missing Request ID
          </div>
        ),
        { width: 1200, height: 630 },
      );
    }

    const requestData = await fetchRequestData(requestId, baseUrl);

    if (!requestData) {
      return new ImageResponse(
        (
          <div
            style={{
              background: "white",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            Failed to Load Request
          </div>
        ),
        { width: 1200, height: 630 },
      );
    }

    const pricePerNight =
      requestData.maxTotalPrice /
      getNumNights(requestData.checkIn, requestData.checkOut);
    const fmtdPrice = formatCurrency(pricePerNight);
    const fmtdDateRange = formatDateRange(
      requestData.checkIn,
      requestData.checkOut,
    );
    const fmtdNumGuests = plural(requestData.numGuests, "guest");

    return new ImageResponse(
      (
        <div tw="h-full w-full flex items-center justify-center bg-gray-50">
          <div tw="flex flex-col h-[80%] w-[60%] items-center justify-center bg-[#f8fdf8] rounded-b-xl shadow-md overflow-hidden">
            <div tw="text-3xl font-extrabold mb-3">Booking Request</div>
            <div tw="flex flex-col bg-white rounded-xl w-[90%] max-w-[600px] shadow-md overflow-hidden">
              {/* Main Card */}
              <div tw="p-6 flex flex-col border-b border-gray-200">
                {/* Header with user info */}
                <div tw="flex items-center justify-between mb-4">
                  <div tw="flex items-center">
                    <img
                      src={requestData.traveler?.image ?? "/placeholder.svg"}
                      tw="w-10 h-10 rounded-full mr-3"
                      style={{ objectFit: "cover" }}
                      alt="neals face"
                    />
                    <div tw="flex flex-col">
                      <div tw="flex items-center gap-2">
                        <span tw="text-base font-medium text-gray-800 pr-2">
                          {requestData.traveler?.firstName}
                        </span>
                        <span tw="text-xs text-teal-900 bg-green-100 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                      <span tw="text-sm text-gray-500">
                        {formatDistanceToNowStrict(requestData.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div tw="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Booking Details */}
                <div tw="flex flex-col">
                  <div tw="text-md font-bold mb-1">{requestData.location}</div>
                  <div tw="flex flex-row mb-4 items-center">
                    <h3 tw="text-sm text-gray-600 pr-4">Requested</h3>
                    <div tw="flex items-baseline justify-between">
                      <span tw="text-xl font-bold text-gray-800">
                        {fmtdPrice}
                      </span>
                      <span tw="text-sm text-gray-600">/night</span>
                    </div>
                  </div>
                </div>

                {/* Date and Guests */}
                <div tw="flex items-center gap-[6px] text-gray-600 text-sm mb-[16px]">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span tw="pl-2">
                    {fmtdDateRange} • {fmtdNumGuests}
                  </span>
                </div>

                {/* Action Button */}
                <button tw="w-full bg-teal-900 hover:bg-teal-800 text-white py-[12px] rounded-md text-center text-sm shadow-md justify-center font-bold">
                  Accept the Booking
                </button>
              </div>
            </div>
            {/* Footer */}
            <div tw="p-[20px] flex flex-col items-center justify-center">
              <span tw="text-sm text-gray-500 mb-[8px]">with</span>
              <div tw="flex justify-center pb-2">
                <div tw="flex items-center gap-2 text-2xl font-bold text-teal-900 2xl:text-3xl">
                  <TramonaIcon />
                  <span tw="pl-2">Tramona</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } else if (type === "property") {
    const coverUrl = cover
      ? `${protocol}://${host}/_next/image?url=${encodeURIComponent(cover)}&w=1200&q=75`
      : "http://localhost:3000/_next/image?url=https%3A%2F%2Fa0.muscache.com%2Fim%2Fpictures%2Fprohost-api%2FHosting-1162477721754661798%2Foriginal%2F0c00ec02-540d-4d24-ba50-638ccd676340.jpeg%3Fim_w%3D720&w=3840&q=75";

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            fontSize: "40px",
            color: "#fff",
            backgroundColor: "#000",
          }}
        >
          <img
            src={coverUrl}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              zIndex: 1,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
