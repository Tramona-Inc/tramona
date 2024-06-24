/* eslint-disable no-console */
/* eslint-disable @next/next/no-img-element */
import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextRequest) {
  // Define protocol and host based on the request
  const protocol = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("host");

  const { searchParams } = new URL(req.url);
  //we are not using the title and description inside the pic so we dont need this, but keeping it in case we change our mind.
  //   const title = searchParams.get("title") ?? "No title";
  //   const description = searchParams.get("description") ?? "No description";

  const cover = searchParams.get("cover");
  const coverUrl = cover
    ? `${protocol}://${host}/_next/image?url=${encodeURIComponent(cover)}&w=1200&q=75`
    : "http://localhost:3000/_next/image?url=https%3A%2F%2Fa0.muscache.com%2Fim%2Fpictures%2Fprohost-api%2FHosting-1162477721754661798%2Foriginal%2F0c00ec02-540d-4d24-ba50-638ccd676340.jpeg%3Fim_w%3D720&w=3840&q=75";

  console.log("coverUrl", coverUrl);
  console.log("cover:", cover);

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
