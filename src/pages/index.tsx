import { useSession } from "next-auth/react";

import Spinner from "@/components/_common/Spinner";
import DashboardPage from "@/components/dashboard/DashboardPage";
import LandingPage from "@/components/landing-page/LandingPage";

import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";

export default function Home() {
  const { status } = useSession();
  useMaybeSendUnsentRequests();

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "unauthenticated") return <LandingPage />;

  return <DashboardPage />;
}
