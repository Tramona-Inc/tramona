import Head from "next/head";
import MainLayout from "@/components/_common/Layout/MainLayout";
import ForHosts from "@/components/landing-page/_sections/ForHosts";
import HelpEndThis from "@/components/landing-page/_sections/HelpEndThis";
import HowItWorks from "@/components/landing-page/_sections/HowItWorks";
import ReferAndEarn from "@/components/landing-page/_sections/ReferAndEarn";
import SocialFeed from "@/components/landing-page/_sections/SocialFeed";

export default function Page() {
  return (
    <MainLayout>
      <div className="relative overflow-x-hidden bg-white">
        <Head>
          <title>How It Works | Tramona</title>
        </Head>
        <div className="md:mx-12 md:space-y-20 space-y-12 mb-12 md:mb-20">
        <HowItWorks />
        <SocialFeed />
        <ReferAndEarn />
        <ForHosts />
        </div>
        <HelpEndThis />
      </div>
    </MainLayout>
  );
}
