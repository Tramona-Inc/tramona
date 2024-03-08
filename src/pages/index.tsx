import { useSession } from "next-auth/react";

import LandingPage from "@/components/landing-page/LandingPage";
import Spinner from "@/components/_common/Spinner";
import DashboardPage from "@/components/dashboard/DashboardPage";

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
