import Head from "next/head";
import MainLayout from "@/components/_common/Layout/MainLayout";
import ForHosts from "@/components/landing-page/_sections/ForHosts";
import HowItWorks from "@/components/landing-page/_sections/HowItWorks";
import ReferAndEarn from "@/components/landing-page/_sections/ReferAndEarn";
import SocialFeed from "@/components/landing-page/_sections/SocialFeed";
import FAQ from "@/components/landing-page/_sections/FAQ";

export default function Page() {
  return (
    <MainLayout>
      <div className="relative overflow-x-hidden bg-white">
        <Head>
          <title>How It Works | Tramona</title>
        </Head>
        <div className="mb-12 space-y-12 md:mx-12 md:mb-20 md:space-y-20">
          <HowItWorks />
          <SocialFeed />
          <hr className="border-none" />
          <div className="mx-4 space-y-10 text-center text-xl font-bold md:mx-0 md:text-2xl">
            <h2>
              We built Tramona for 1 reason. Allow people to travel more. There
              are lots of vacancies, but people always want to travel, we are
              filling that discrepancy.
            </h2>
            <h2>Stay in properties out of your budget, for your budget.</h2>
          </div>
          <hr className="border-none" />
          <ReferAndEarn />
          <ForHosts />
          <hr className="border-none" />
          <FAQ />
          <hr className="border-none" />
        </div>
      </div>
    </MainLayout>
  );
}
