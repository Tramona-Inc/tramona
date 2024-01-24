import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import MainLayout from "@/components/_common/MainLayout";
import TailwindIndicator from "@/components/_common/TailwindIndicator";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    // <HydrationOverlay>
    <TooltipProvider delayDuration={50}>
      <SessionProvider session={session}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>

        {/* Helps display screen size (Only in developer mode) */}
        <TailwindIndicator />
        <Toaster />
      </SessionProvider>
    </TooltipProvider>
    // </HydrationOverlay>
  );
};

export default api.withTRPC(MyApp);
