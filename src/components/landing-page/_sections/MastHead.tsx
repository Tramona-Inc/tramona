import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/utils/utils";
import { SearchIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { MobileSearchTab } from "../SearchBars/MobileSearchTab";
import { MobileRequestDealTab } from "../SearchBars/MobileRequestDealTab";
import { DesktopSearchTab } from "../SearchBars/DesktopSearchTab";
import { DesktopRequestDealTab } from "../SearchBars/DesktopRequestDealTab";
import { WelcomeBanner } from "../WelcomeBanner";

export default function MastHead() {
  return (
    <section className="relative bg-white">
      <div className="absolute inset-x-0 top-0">
        <WelcomeBanner />
      </div>
      <div className="w-full">
        <Image
          src="/assets/images/landing-page/main.png"
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="h-[370px] w-full select-none object-cover md:h-[450px] md:w-full"
        />
      </div>

      <div className="absolute -top-12 left-0 right-0 z-10 mx-auto max-w-4xl px-5 pt-24 md:top-10 md:px-8">
        <h1 className="mx-auto max-w-3xl text-center text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl md:leading-tight">
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
      <p className="px-4 pt-4 text-center text-sm font-medium md:-translate-y-6 md:text-base">
        See a property you like? Make an offer and Tramona will create the deal
        for you. Don&apos;t see a property you like? Request a deal.
      </p>
    </section>
  );
}

export function DesktopSearchLayout() {
  return (
    <Tabs
      defaultValue={"search"}
      className="mx-auto max-w-6xl rounded-2xl bg-white px-4 pb-4 shadow-md"
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
        <DesktopSearchTab />
      </TabsContent>
      <TabsContent value={"request"}>
        <DesktopRequestDealTab />
      </TabsContent>
    </Tabs>
  );
}

export function MobileSearchLayout() {
  const [mode, setMode] = useState<"search" | "request">("search");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="w-full">
        <div className="z-40 flex flex-row gap-x-3 rounded-lg bg-white px-3 py-5 text-center font-semibold text-muted-foreground shadow-lg">
          <SearchIcon />
          Name your price or submit an offer
        </div>
      </SheetTrigger>
      <SheetContent side="top" className="h-full">
        <SheetHeader>
          <div className="flex h-full w-full items-center justify-center gap-2 pb-5">
            <Button
              variant="link"
              className={cn(mode === "search" && "underline")}
              onClick={() => setMode("search")}
            >
              Search
            </Button>
            <Button
              variant="link"
              className={cn(mode === "request" && "underline")}
              onClick={() => setMode("request")}
            >
              Request deal
            </Button>
          </div>
        </SheetHeader>
        {mode === "search" && (
          <MobileSearchTab closeSheet={() => setOpen(false)} />
        )}
        {mode === "request" && (
          <MobileRequestDealTab closeSheet={() => setOpen(false)} />
        )}
      </SheetContent>
    </Sheet>
  );
}
