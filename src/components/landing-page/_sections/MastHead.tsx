import FeedLanding from "../FeedLanding";
// import DesktopSearchBar from '../../search-bar/desktop-search-bar';
// import MobileSearchBar from '@/common/components/search-bar/mobile-search-bar';
// import { useToast } from "../ui/use-toast";
// import type { NewRequest } from '/common/lib/new-request-utils';
// import { getSuccessfulRequestToast, makeRequest } from '/common/lib/new-request-utils';
// import { useUserInfo } from '@/hooks/useUserInfo';
// import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import DesktopSearchBar from "../SearchBar/DesktopSearchBar";
import Image from "next/image";

const LandingVideo = dynamic(
  () => import("@/components/landing-page/LandingVideo"),
  { ssr: false },
);

export default function MastHead() {
  return (
    <>
      <section className="relative flex min-h-screen-minus-header flex-col justify-center">
        <div className="absolute inset-0 bg-black" />
        <LandingVideo />
        <div className="z-10 flex flex-col justify-center gap-4 p-4">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-center text-3xl font-bold text-white md:text-6xl">
              Tramona is a name your own price tool
            </h1>
            <p className="text-center text-xl text-white md:text-3xl">
              We match you with vacant dates from top performing Airbnb hosts, so you get better travel deals
            </p>
          </div>
          {/* <LandingVideo /> */}
          <div className="z-10 flex flex-col justify-center gap-4 p-4">
            <div className="mx-auto max-w-3xl space-y-4">
              <h1 className="text-center text-3xl font-bold text-black md:text-6xl">
                Tramona is a name your own price tool
              </h1>
              <p className=" text-center text-xl text-black md:text-3xl">
                We match you with vacant dates from top performing Airbnb hosts, so you get better travel deals
              </p>
            </div>
            <div className="mx-auto w-full max-w-5xl">
              <DesktopSearchBar />
            </div>
          </div>
        </div>
      </section>
      {/* <section className="h-[45vh] bg-blue-800 xl:hidden">
        <FeedLanding />
      </section> */}
    </>
  );
}
