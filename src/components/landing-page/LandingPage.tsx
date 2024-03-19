import Head from "next/head";

import MastHead from "@/components/landing-page/_sections/MastHead";
import HowItWorks from "@/components/landing-page/_sections/HowItWorks";
import SocialFeed from "@/components/landing-page/_sections/SocialFeed";
import ForHosts from "@/components/landing-page/_sections/ForHosts";
import ReferAndEarn from "@/components/landing-page/_sections/ReferAndEarn";
import HelpEndThis from "@/components/landing-page/_sections/HelpEndThis";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { useState } from "react";

export default function LandingPage() {
  useMaybeSendUnsentRequests();
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true);
  const handleBannerClick = () => {
    setIsBannerVisible(false);
  };

  return (
    <>
      <div className="relative overflow-x-hidden">
        <Head>
          <title>Tramona</title>
        </Head>
        {isBannerVisible && (
          <div className="mb-0 mt-0 w-full place-items-center overflow-x-scroll rounded-lg px-2 pt-2 lg:overflow-visible">
            <div
              role="alert"
              className="relative flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-4 text-base text-white"
              onClick={handleBannerClick}
            >
              <div className="flex-grow px-4 text-left md:px-6 md:text-center">
                <p className="text-xs text-white md:text-base md:font-semibold">
                  A platform designed solely so you can experience more of the
                  world.
                </p>
              </div>
              <button
                className="absolute right-3 top-3 h-8 max-h-[32px] w-8 max-w-[32px] rounded-lg align-middle font-sans text-xs font-medium uppercase text-white transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerClick();
                }}
              >
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}

        <MastHead />
        <HowItWorks />
        <SocialFeed />
        <ReferAndEarn />
        <ForHosts />
        <HelpEndThis />
      </div>
    </>
  );
}
