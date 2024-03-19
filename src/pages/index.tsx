import MainLayout from "@/components/_common/Layout/MainLayout";
import LandingPage from "@/components/landing-page/LandingPage";

import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";

export default function Home() {
  useMaybeSendUnsentRequests();

  return (
    <MainLayout>
      <LandingPage />
    </MainLayout>
  );
}
