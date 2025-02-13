import { type DefaultSeoProps } from "next-seo";
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
    // images: [
    //   {
    //     url: "https://www.tramona.com/assets/images/landing-page/main.png", // Fallback photo for shared links
    //     width: 800,
    //     height: 600,
    //     alt: "Tramona",
    //   },
    // ],
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};
export default config;
