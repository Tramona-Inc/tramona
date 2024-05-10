import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import MobileSearchBar from "../SearchBar/MobileSearchBar";
import DesktopSearchBar from "../SearchBar/DesktopSearchBar";

export default function MastHead() {
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
          className="h-[370px] w-full object-cover md:h-[450px] md:w-full"
        />
      </div>

      <div className="absolute -top-12 left-0 right-0 z-10 mx-auto max-w-4xl px-5 pt-24 md:top-10 md:px-8">
        <h1 className="mx-auto max-w-3xl text-center text-3xl font-extrabold text-gray-900 md:text-5xl md:leading-tight">
          Pay what you want by bidding on Airbnb stays
        </h1>
        <p className="mx-auto mt-8 max-w-lg text-center text-base font-semibold text-gray-900 md:text-lg">
          Stay at the same properties you see on Airbnb for cheaper. Say goodbye
          to outrageous fees and markups.
        </p>
        <div className="mx-auto mt-10 w-full md:hidden">
          <MobileSearchLayout />
        </div>
      </div>
      <div className="hidden -translate-y-16 px-4 md:block">
        <DesktopSearchLayout />
      </div>
      <p className="mx-auto max-w-3xl py-12 text-center text-sm text-zinc-600 md:text-lg">
        See a property you like? Make an offer and Tramona will create the deal
        for you.
        <br></br>Don&apos;t see a property you like? Request a deal.
      </p>
    </section>
  );
}

export function DesktopSearchLayout() {
  return (
    <div className="flex items-center justify-center">
      <Tabs
        defaultValue={"search"}
        className="bordre rounded-3xl bg-white px-10 shadow-md"
      >
        <TabsList noBorder className="flex items-center justify-center">
          <TabsTrigger
            value="search"
            className="border-b-2 font-bold data-[state=active]:border-[#004236] data-[state=active]:text-[#004236]"
          >
            <span className="text-sm">Search Properties</span>
          </TabsTrigger>
          <TabsTrigger
            value="request"
            className="border-b-2 font-bold data-[state=active]:border-[#004236] data-[state=active]:text-[#004236]"
          >
            <span className="text-sm">Request Deal</span>
          </TabsTrigger>
        </TabsList>
        <div className="mb-5 mt-[-2px] w-full border-b-2 border-border" />
        <TabsContent value={"search"}>
          <DesktopSearchBar mode="search" />
        </TabsContent>
        <TabsContent value={"request"}>
          <DesktopSearchBar mode="request" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function MobileSearchLayout() {
  return <MobileSearchBar />;
}
