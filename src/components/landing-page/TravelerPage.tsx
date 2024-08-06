import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";
import Head from "next/head";
import MastHead from "./_sections/MastHead";
import Banner from "./Banner";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  return (
    <VerificationProvider>
      <Head>
        <title>Tramona</title>
      </Head>
      <VerificationBanner />
      <MastHead />
    </VerificationProvider>
  );
}

const VerificationBanner = () => {
  const { showBanner, status, setShowVerificationBanner } = useVerification();
  const handleCloseBanner = () => {
    setShowVerificationBanner(false);
  };

  if (!showBanner || (status !== "true" && status !== "pending")) return null;
  return <Banner type={status} onClose={handleCloseBanner} />;
};
