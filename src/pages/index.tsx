import Header from "@/components/_common/Header";
import MainLayout from '@/components/_common/Layout/MainLayout';
import LandingPage from "@/components/landing-page/LandingPage";

import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";

export default function Home() {
  // const { status } = useSession();
  useMaybeSendUnsentRequests();

  // if (status === "loading") {
  //   return <Spinner />;
  // }

  // if (status === "unauthenticated")
  return (
    <MainLayout>
      <LandingPage />
    </MainLayout>
  );

  // return <DashboardPage />;
}
