import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TestimonialCarousel } from "@/components/landing-page/_sections/testimonials/TestimonialCarousel";
import { MobileTestimonialCarousel } from "@/components/landing-page/_sections/testimonials/MobileTestimonialCarousel";
import { whyListTestimonals } from "@/components/landing-page/_sections/testimonials/testimonials-data";
import { useIsSm } from "@/utils/utils";
import React from "react";
import HostCalculator from "@/components/host/HostCalculator";
import { StickyTopBar } from "@/pages/for-hosts";
import { MobileStickyBar } from "@/pages/for-hosts";
import HeyHosts from "@/components/landing-page/_sections/hey-hosts/HeyHosts";
import { getFeed } from "@/server/api/routers/feedRouter";
import { type InferGetStaticPropsType } from "next";
import { Banner } from "@/components/why-list/Banner";
import { SignUpNow } from "@/components/why-list/SignUpNow";
import { HowItWorks } from "@/components/why-list/HowItWorks";
import { AutoManual } from "@/components/why-list/AutoManual";
import { Features2 } from "@/components/why-list/Features2";
import { KeyFeatures } from "@/components/why-list/KeyFeatures";
import { Features } from "@/components/why-list/Features";
import { FAQ } from "@/components/why-list/FAQ";
import { Questions } from "@/components/why-list/Questions";
import { ListInAMinute } from "@/components/why-list/ListInAMinute";

export async function getStaticProps() {
  const requestFeed = await getFeed({ maxNumEntries: 10 }).then((r) =>
    r.filter((r) => r.type === "request"),
  );
  return {
    props: { requestFeed },
    revalidate: 60 * 5, // 5 minutes
  };
}

const ForHostsPage = ({
  requestFeed,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="relative overflow-x-hidden bg-white md:pb-0">
      <Head>
        <title>For Hosts | Tramona</title>
      </Head>
      <div>
        <div className="bg-white pb-10">
          <Banner />
          <div className="md:hidden">
            <MobileStickyBar />
          </div>
          <div className="hidden md:block">
            <StickyTopBar />
          </div>
          <SignUpNow requestFeed={requestFeed} />
        </div>
        <div className="bg-[#FAF9F6] p-10">
          <h1 className="mt-12 text-center text-3xl font-semibold">
            How Tramona Works for Hosts
          </h1>
          <p className="mb-12 mt-1 text-center text-lg font-normal text-gray-500">
            Say goodbye to empty nights
          </p>
          <HowItWorks />
        </div>
        <div>
          <h1 className="mt-12 text-center text-3xl font-semibold">
            Automation vs Manual
          </h1>
          <p className="mb-12 mt-1 text-center text-lg font-normal text-gray-500">
            Tramoma can be as hands on or hands off as you want.
          </p>
          <AutoManual />
          <p className="text-med mb-12 mt-8 text-center font-normal text-gray-500">
            Tramona makes switching between automation and manual controls
            effortless, so you can adapt your approach as your hosting needs
            change.
          </p>
        </div>
        <div className="bg-[#FAF9F6]">
          <Features2 />
        </div>
        <div className="mt-12 bg-white">
          <KeyFeatures />
        </div>
        <hr className="mx-8 border-t border-gray-300" />
        <Features />
        <HostCalculator />
        <div className="mx-0 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:mb-16 lg:mt-16 lg:flex lg:space-y-8">
          {useIsSm() ? (
            <MobileTestimonialCarousel testimonials={whyListTestimonals} />
          ) : (
            <TestimonialCarousel testimonials={whyListTestimonals} />
          )}
        </div>
        <div className="bg-[#FAF9F6] p-8">
          <ListInAMinute />
        </div>
        <div>
          <h2 className="mx-4 mb-16 mt-12 text-center text-3xl font-semibold">
            Anything we can answer? Book a call with <br />
            our onboarding team
          </h2>
          <Questions />
        </div>
        <div className="flex justify-center pb-4 md:pb-20">
          <HeyHosts />
        </div>
        <div className="bg-[#FAF9F6] p-20 pb-4 md:pb-8">
          <FAQ />
        </div>
      </div>
      <div className="mt-0 bg-primaryGreen py-8">
        <div className="text-center text-white">
          <h2 className="text-2xl font-semibold">
            Turn hard-to-book dates into profitable stays
          </h2>
          <div className="mt-6 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-6 md:space-y-0">
            <Link href="/why-list">
              <Button
                size="lg"
                className="bg-primaryGreen bg-white text-primaryGreen"
              >
                Become a host
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForHostsPage;
