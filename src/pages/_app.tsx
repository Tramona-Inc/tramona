import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import TailwindIndicator from "@/components/_common/TailwindIndicator";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    // <HydrationOverlay>
    <TooltipProvider delayDuration={50} disableHoverableContent>
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
    </TooltipProvider>
    // </HydrationOverlay>
  );
};

export default api.withTRPC(MyApp);
