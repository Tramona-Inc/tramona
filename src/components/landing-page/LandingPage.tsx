import Head from "next/head";

import ForHosts from "@/components/landing-page/_sections/ForHosts";
import HelpEndThis from "@/components/landing-page/_sections/HelpEndThis";
import HowItWorks from "@/components/landing-page/_sections/HowItWorks";
import MastHead from "@/components/landing-page/_sections/MastHead";
import ReferAndEarn from "@/components/landing-page/_sections/ReferAndEarn";
import SocialFeed from "@/components/landing-page/_sections/SocialFeed";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { useState } from "react";
import { Icons } from "../_icons/icons";

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
        <div className="bg-white">
          <div className="2xl:mx-12">
            {/* {isBannerVisible && (
              <div className="mb-0 mt-0 w-full place-items-center rounded-lg px-2 pt-2 lg:overflow-visible">
                <div
                  role="alert"
                  className="relative flex hidden w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-4 text-base text-white md:flex"
                  onClick={handleBannerClick}
                >
                  <div className="flex-grow px-4 text-left md:px-6 md:text-center">
                    <p className="text-xs text-white md:text-lg md:font-semibold lg:text-xl lg:font-semibold">
                      A platform designed solely so you can experience more of
                      the world.
                    </p>
                  </div>
                  <button
                    className="rounded-lg border-2"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerClick();
                    }}
                  >
                    <Icons.close />
                  </button>
                </div>
              </div>
            )} */}
            <MastHead />
            <HowItWorks />
            <SocialFeed />
            <ReferAndEarn />
            <ForHosts />
            <HelpEndThis />
          </div>
        </div>
      </div>
    </>
  );
}
