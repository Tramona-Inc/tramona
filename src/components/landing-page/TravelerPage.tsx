import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";
import Head from "next/head";
import Banner from "./Banner";
import { useSendUnsentRequest } from "@/utils/useSendUnsentRequests";
import MastHead from "./_sections/MastHead";

export default function TravelerPage() {
  useSendUnsentRequest();

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
