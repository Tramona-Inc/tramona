import { DefaultSeoProps } from "next-seo";
const isProduction = process.env.NODE_ENV === "production";

const baseUrl = isProduction
  ? "https://www.tramona.com"
  : "https://9503-104-32-193-204.ngrok-free.app"; //change to your live server

const config: DefaultSeoProps = {
  title: "Tramona",
  description:
    "Tramona is a platform that connects travelers with hosts to create unique deals for short-term stays.",
  canonical: baseUrl,
  openGraph: {
    type: "website",
    locale: "en_IE",
    title: "Tramona",
    url: baseUrl,
    description:
      "Tramona is a platform that connects travelers with hosts to create unique deals for short-term stays.",
    siteName: "Tramona",
    images: [
      {
        url: `${baseUrl}/api/og?cover=https%3A%2F%2Ftramona-images.s3.amazonaws.com%2Fhttps%253A%2F%2Fmammothrockvillas.guestybookings.com%2Fproperties%2F65e3e9dc15b9000013ee4dfc%2Fimage_0.jpg`, // Fallback photo for shared links
        width: 800,
        height: 600,
        alt: "Tramona",
      },
    ],
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};

export default config;
