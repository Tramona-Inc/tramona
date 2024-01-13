import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import TailwindIndicator from "@/components/ui/tailwind-indicator";
import Navbar from "@/components/navbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps} />

      {/* Helps display screen size (Only in developer mode) */}
      <TailwindIndicator />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
