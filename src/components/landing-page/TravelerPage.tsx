import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";
import Head from "next/head";
import Banner from "./Banner";
import MastHead from "./_sections/MastHead";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";

const TravelerPage = ({
  requestFeed,
}: {
  requestFeed: FeedRequestItem[];
}) => {
  return (
    <VerificationProvider>
      <Head>
        <title>Tramona</title>
      </Head>
      <VerificationBanner />
      <MastHead requestFeed={requestFeed} />
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

export default TravelerPage;