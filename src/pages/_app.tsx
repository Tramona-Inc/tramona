import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import TailwindIndicator from "@/components/TailwindIndicator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layouts/MainLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <HydrationOverlay>
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
    </HydrationOverlay>
  );
};

export default api.withTRPC(MyApp);
