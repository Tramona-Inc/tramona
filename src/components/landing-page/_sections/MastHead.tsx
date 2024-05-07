import Image from "next/image";
import SearchBar, { DesktopSearchLayout, MobileSearchLayout } from "../SearchBar/SearchBar";
import { useMediaQuery } from "@/components/_utils/useMediaQuery";

export default function MastHead() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <section className="relative flex flex-col bg-white">
      <div className="w-full">
        <Image
          src="/assets/images/landing-page/main.png"
          alt="Main Background"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="h-[370px] md:h-[450px] w-full object-cover md:w-full"
        />
      </div>

      <div className="absolute mx-auto max-w-4xl left-0 right-0 z-10 px-5 md:px-8 pt-24 -top-12 md:top-10">
        <h1 className="mx-auto max-w-2xl text-center text-3xl font-extrabold text-gray-900 md:text-5xl md:leading-tight">
          The first perfectly efficient travel marketplace
        </h1>
        <p className="mt-8 text-center text-base md:text-lg text-gray-900 font-semibold">
          Shop the same properties you see on Airbnb, without the fees and
          Airbnb markup price
        </p>
        {isMobile && (
          <div className="mt-10 mx-auto w-full">
            <MobileSearchLayout />
          </div>
        )}
      </div>

      <div className="mt-0 w-full px-8 mb-10 md:mb-20 md:absolute md:top-60 md:z-10 md:mt-40">
        {!isMobile && <DesktopSearchLayout />}
        {/* <hr className="block md:hidden h-px bg-gray-200 border-0"></hr> */}
        <p className="mt-14 mx-auto max-w-3xl text-center text-sm md:text-xl md:leading-8 text-gray-800">
          See a property you like? Make an offer and Tramona will create the deal for you.
          <br></br>Don&apos;t see a property you like? Request a deal.
        </p>
      </div>
    </section>
  );
}
