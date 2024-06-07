import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "@/env";
import { api } from "@/utils/api";
import "@/styles/globals.css";

import TailwindIndicator from "@/components/_common/TailwindIndicator";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Head from "next/head";
import SEO from "../../next-seo.config";
import { Mulish } from "next/font/google";
import { DefaultSeo } from "next-seo";
export const mulish = Mulish({
  subsets: ["latin"],
  display: "swap",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    // <HydrationOverlay>
    <TooltipProvider delayDuration={50} disableHoverableContent>
      <DefaultSeo {...SEO} />
      <APIProvider
        apiKey={env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <SessionProvider session={session}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
          </Head>
          <Component {...pageProps} />

          {/* Helps display screen size (Only in developer mode) */}
          <TailwindIndicator />
          <Toaster />
        </SessionProvider>
      </APIProvider>
    </TooltipProvider>
    // </HydrationOverlay>
  );
};

export default api.withTRPC(MyApp);
