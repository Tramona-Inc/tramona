import { ImageResponse } from "@vercel/og";
import { type RouterOutputs } from "@/utils/api";

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
        <div tw="h-full w-full flex flex-col items-center justify-center bg-gray-50">
          <div tw="flex flex-col bg-white rounded-xl w-full h-full overflow-hidden">
            {/* Main Card */}
            <div tw="p-6 flex flex-col">
              {/* Header with user info */}
              <div tw="flex items-center justify-between mb-5">
                <div tw="flex items-center">
                  {/* <div tw="w-10 h-10 rounded-full bg-gray-200 mr-3" /> */}
                  <img
                    src={requestData.traveler?.image ?? "/placeholder.svg"}
                    tw="w-10 h-10 rounded-full mr-3"
                    style={{ objectFit: "cover" }}
                    alt="neals face"
                  />
                  <div tw="flex flex-col">
                    <div tw="flex items-center gap-2">
                      <span tw="text-base font-medium pr-1">
                        {requestData.traveler?.firstName}
                      </span>
                      <span tw="text-emerald-500 text-sm bg-emerald-50 px-3 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                    <span tw="text-gray-500 text-sm">
                      {formatDistanceToNowStrict(requestData.createdAt)}
                    </span>
                  </div>
                </div>
                <div tw="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Location */}
              <div tw="mb-4 flex flex-col">
                <h2 tw="text-xl font-semibold mb-1">{requestData.location}</h2>
                <div tw="flex flex-row justify-between">
                  <span tw="text-gray-600">Requested</span>
                  <div tw="mb-4 flex gap-2" style={{ alignItems: "baseline" }}>
                    <span tw="text-2xl font-bold">{fmtdPrice}</span>
                    <span tw="text-gray-600">/night</span>
                  </div>
                </div>
              </div>

              {/* Date and Guests */}
              <div tw="flex items-center gap-2 text-gray-600 mb-6">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M12 2h-1V1h-2v1H7V1H5v1H4C2.9 2 2 2.9 2 4v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 10H4V6h8v6z" />
                </svg>
                <span tw="pl-2">
                  {fmtdDateRange} • {fmtdNumGuests}
                </span>
              </div>

              {/* Action Button */}
              <button tw="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-md text-center justify-center font-bold">
                Accept the Booking
              </button>
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
