const isProduction = process.env.NODE_ENV === "production";
import { DefaultSeoProps } from "next-seo";
import { desc } from "drizzle-orm";
const config: DefaultSeoProps = {
  openGraph: {
    type: "website",
    locale: "en_IE",
    title: "Tramona",
    url: isProduction ? "https://www.tramona.com" : "http://localhost:3000",
    description:
      "Tramona is a platform that connects travelers with hosts to create unique deals for short-term stays.",
    siteName: "Tramona",
    images: [
      {
        url: "https://www.tramona.com/assets/images/landing-page/main.png", // Fallback photo for shared links
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
