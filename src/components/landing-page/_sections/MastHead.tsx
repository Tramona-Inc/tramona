import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/utils/utils";
import {
  CircleDollarSign,
  Handshake,
  Home,
  MapPin,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { MobileSearchTab } from "../SearchBars/MobileSearchTab";
import { MobileRequestDealTab } from "../SearchBars/MobileRequestDealTab";
import { DesktopRequestDealTab } from "../SearchBars/DesktopRequestDealTab";
import { WelcomeBanner } from "../WelcomeBanner";
import Typewriter from "typewriter-effect";

const infoCards = [
  {
    icon: MapPin,
    title: "City Requests",
    description:
      "Send your travel details to all hosts in your destination city. They'll respond by offering you properties within your budget.",
  },
  {
    icon: Home,
    title: "Property Offers",
    description:
      "Browse through 10,000+ properties and send an offer. Hosts will respond in 24 hours and a deal will be created.",
  },
  {
    icon: Handshake,
    title: "Negotiation",
    description:
      "Hosts either accept, deny, or counter offer your request, to make a unique deal every time.",
  },
  {
    icon: CircleDollarSign,
    title: "Lowest Fees",
    description:
      "Lowest fees on the market, 80% lower fees than any other booking platform.",
  },
];

export default function MastHead() {
  return (
    <section className="relative m-8 min-h-screen-minus-header-n-footer bg-white ">
      <div className="absolute inset-x-0 top-0">
        <WelcomeBanner />
      </div>
      <div className="rounded-3xl border">
        <div className="grid grid-cols-1 p-8 lg:grid-cols-2">
          <div className="flex flex-col justify-end">
            <div className="space-y-2 lg:space-y-6 lg:text-balance">
              <p className="text-xs font-bold uppercase tracking-wide text-black/50 sm:text-sm">
                $250,000+ saved so far
              </p>
              <h1 className="text-3xl font-extrabold lg:text-6xl">
                Book the same properties you see on Airbnb for less
              </h1>
              <p className="text-xs lg:text-base">
                With Airbnb hosts averaging 60% vacancy rates year-round,
                Tramona matches you with hosts who are willing to meet your
                price.
              </p>
            </div>
          </div>
          <div className="ps-16">
            <div className="hidden flex-1 rounded-2xl border bg-white p-4 lg:block">
              <DesktopSearchLayout />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex-1 rounded-2xl border bg-secondary p-4 lg:hidden">
        <DesktopSearchLayout />
      </div>
      <div className="mt-8 space-y-4 lg:mt-14 lg:space-y-8">
        <h1 className="text-center text-2xl font-extrabold lg:text-4xl">
          How Tramona Works
        </h1>
        <div className="relative h-56">
          <div className="absolute inset-0 overflow-x-auto">
            <div className="flex gap-4">
              {infoCards.map((card, index) => (
                <div
                  key={index}
                  className="min-w-64 space-y-2 rounded-3xl bg-zinc-100 p-4 md:flex-1"
                >
                  <card.icon />
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="text-sm">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ORIGINAL LANDING PAGE

{
  /* <section className="relative bg-white">
  <div className="absolute inset-x-0 top-0">
    <WelcomeBanner />
  </div>
  <div className="w-full">
    <Image
      src="/assets/images/landing-page.png"
      alt=""
      width={0}
      height={0}
      sizes="100vw"
      priority
      className="pointer-events-none h-[900px] w-full select-none object-cover md:w-full lg:h-[750px]"
    />
  </div>
  <div className="absolute inset-x-0 top-0 z-10 mx-auto max-w-6xl px-4">
    <div className="flex flex-col gap-4 pt-6 lg:flex-row lg:gap-20 lg:pt-11">
      <div className="w-96 flex-none">
        <p className="text-xs font-bold uppercase tracking-wide text-black/50 sm:text-sm">
          $250,000+ saved so far
        </p>
        <h1 className="text-balance text-2xl font-bold leading-tight lg:text-[40px] lg:leading-tight">
          Book the same properties you see on Airbnb for less
        </h1>
        <p className="text-balance pt-4 text-sm leading-tight lg:pt-8 lg:text-xl">
          Hosts average 60% vacancy year round. Submit requests and{" "}
          <b>let hosts send you matches.</b>
        </p>
      </div>
      <div className="flex-1">
        <DesktopSearchLayout />
      </div>
    </div>
  </div>
  <div className="relative h-64 -translate-y-20">
    <div className="absolute inset-0 overflow-x-auto">
      <div className="flex gap-4 px-4">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className="min-w-64 space-y-2 rounded-lg border bg-white p-4 md:flex-1"
          >
            <card.icon />
            <h3 className="text-xl font-bold">{card.title}</h3>
            <p className="text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>; */
}

export function DesktopSearchLayout() {
  return (
    <div className="space-y-2">
      <p className="hidden text-sm font-semibold lg:block">
        Send a request to every host in{" "}
        <span className="text-teal-700">
          <Typewriter
            component={"span"}
            options={{
              strings: ["LOS ANGELES", "PARIS", "MIAMI", "ANY CITY"],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </p>

      <DesktopRequestDealTab />
    </div>

    // ORIGINAL LANDING PAGE

    // <Tabs
    //   defaultValue={"search"}
    //   className="mx-auto max-w-6xl rounded-2xl bg-white px-4 pb-4 shadow-md"
    // >
    //   <TabsList noBorder className="flex items-center justify-center">
    //     <TabsTrigger
    //       value="search"
    //       className="border-b-2 font-bold data-[state=active]:border-[#004236] data-[state=active]:text-[#004236]"
    //     >
    //       <span className="text-sm">Search Properties</span>
    //     </TabsTrigger>
    //     <TabsTrigger
    //       value="request"
    //       className="border-b-2 font-bold data-[state=active]:border-[#004236] data-[state=active]:text-[#004236]"
    //     >
    //       <span className="text-sm">Request Deal</span>
    //     </TabsTrigger>
    //   </TabsList>
    //   <div className="mb-5 mt-[-2px] w-full border-b-2 border-border" />
    //   <TabsContent value={"search"}>
    //     <DesktopSearchTab />
    //   </TabsContent>
    //   <TabsContent value={"request"}>
    //     <DesktopRequestDealTab />
    //   </TabsContent>
    // </Tabs>
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
