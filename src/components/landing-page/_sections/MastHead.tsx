import landingBg from "public/assets/images/landing-bg.jpg";
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
import { MobileSearchTab } from "../SearchBars/MobileSearchTab";
import { MobileRequestDealTab } from "../SearchBars/MobileRequestDealTab";
import { DesktopRequestDealTab } from "../SearchBars/DesktopRequestDealTab";
import Typewriter from "typewriter-effect";
import Image from "next/image";

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
    <section className="relative bg-white p-4">
      <div className="relative overflow-clip rounded-3xl border">
        <Image
          src={landingBg}
          alt=""
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          className="select-none"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-black"></div>
        <div className="relative grid grid-cols-1 p-4 lg:grid-cols-2">
          <div className="flex flex-col justify-end">
            <div className="relative pt-32 lg:text-balance">
              {/* <div className="relative inline-block rounded-full border-t border-white/20 bg-teal-900  px-3 font-extrabold uppercase tracking-wide text-white shadow-[1px_1px_10px] shadow-teal-100/60">
                $250k+ saved so far
              </div> */}
              <div className="relative inline-flex items-center gap-1 rounded-full border-t border-white/30 bg-teal-50 px-3 text-sm font-extrabold uppercase tracking-wide text-teal-900 sm:text-base">
                $250k+ saved so far
              </div>
              <h1 className="text-3xl font-extrabold text-white lg:text-6xl">
                Book the same properties you see on Airbnb for less
              </h1>
              <p className="text-xs text-white lg:pt-4 lg:text-base">
                With Airbnb hosts averaging 60% vacancy rates year-round, hosts
                use Tramona to fill their calendars by matching with your
                desired price
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
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          How Tramona Works
        </h2>
        <div className="relative h-56">
          <div className="absolute inset-0 overflow-x-auto">
            <div className="flex gap-4">
              {infoCards.map((card, index) => (
                <div
                  key={index}
                  className="flex min-w-64 flex-col items-start gap-2 rounded-2xl bg-teal-700/15 p-4 md:flex-1"
                >
                  <div className="rounded-lg bg-white p-2">
                    <card.icon />
                  </div>
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

export function DesktopSearchLayout() {
  return (
    <div className="space-y-2">
      <p className="hidden  font-semibold  text-muted-foreground lg:block">
        Send a request to every host in{" "}
        <span className="font-bold text-teal-900">
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
