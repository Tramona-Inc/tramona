import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <HydrationOverlay>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </HydrationOverlay>
  );
};

export default api.withTRPC(MyApp);
