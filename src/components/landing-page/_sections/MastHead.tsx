import landingBg from "public/assets/images/landing-bg.jpg";
import priceComparison from "public/assets/images/pricecomparison.jpg";
import { Button } from "@/components/ui/button";
import UserAvatarMastHead from "@/components/_common/UserAvatarMasthead";
import { Avatar } from "@/components/ui/avatar";
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
  ShieldIcon,
  TableProperties,
} from "lucide-react";
import { MobileSearchTab } from "../SearchBars/MobileSearchTab";
import { MobileRequestDealTab } from "../SearchBars/MobileRequestDealTab";
import { DesktopRequestDealTab } from "../SearchBars/DesktopRequestDealTab";
import { TestimonialCarousel } from "./TestimonialCarousel";
import Typewriter from "typewriter-effect";
import Image from "next/image";
import CompletedRequestsSection from "./CompletedRequests";

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
    // padding for the sides? and do we want rounded corners?
    <section className="relative bg-white pb-4">
      <div className="relative overflow-hidden">
        <div className="">
          <Image
            src={landingBg}
            alt=""
            fill={true}
            objectFit="cover"
            placeholder="blur"
            className="select-none"
          />
        </div>
        {/* <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-black"></div> */}
        <div className="relative grid grid-cols-1 p-4 lg:grid-cols-1">
          <div className="flex flex-col justify-center">
            <div className="relative pt-10 text-center">
              {/* <div className="relative inline-block rounded-full border-t border-white/20 bg-teal-900  px-3 font-extrabold uppercase tracking-wide text-white shadow-[1px_1px_10px] shadow-teal-100/60">
                $250k+ saved so far
              </div> */}
              {/* <div className="relative inline-flex items-center gap-1 rounded-full border-t border-white/30 bg-teal-50 px-3 text-sm font-extrabold uppercase tracking-wide text-teal-900 sm:text-base">
                $250k+ saved so far
              </div> */}
              <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold text-gray-900 lg:text-3xl">
                Book the same properties you see on Airbnb for less
              </h1>
              <p className="mx-auto max-w-3xl text-xs font-semibold text-gray-900 pt-4 lg:pt-4 lg:text-base">
                With Airbnb hosts averaging 60% vacancy rates year-round,
                Tramona matches you with hosts who are willing to meet your
                price.
              </p>
              <div className="hidden items-center justify-center pt-4 lg:flex">
                {/* separate component, white borders? */}
                <div className="-ml-2">
                  <UserAvatarMastHead
                    size={"md"}
                    image="/assets/images/fake-reviews/shawnp.jpg"
                  />
                </div>
                <div className="-ml-2">
                  <UserAvatarMastHead
                    size={"md"}
                    image="/assets/images/fake-reviews/biancar.jpg"
                  />
                </div>
                <div className="-ml-2">
                  <UserAvatarMastHead
                    size={"md"}
                    image="/assets/images/fake-reviews/lamarf.jpg"
                  />
                </div>
                <div className="-ml-2">
                  <UserAvatarMastHead
                    size={"md"}
                    image="/assets/images/fake-reviews/susanl.jpg"
                  />
                </div>
                <div className="-ml-2">
                  <Avatar
                    size={"md"}
                    className="flex items-center justify-center border-2 border-white bg-teal-900 text-xs font-semibold text-white"
                  >
                    +450
                  </Avatar>
                </div>
                <p className="ml-2 text-xs font-semibold text-[#7E7564]">
                  Requests made in the last 2 months
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-10">
            <div className="hidden rounded-2xl border bg-white p-4 shadow-2xl lg:block lg:max-w-xl lg:flex-1">
              <DesktopSearchLayout />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center p-4">
        <div className="mt-4 flex-1 rounded-2xl border bg-white p-4 shadow-2xl lg:hidden">
          <DesktopSearchLayout />
        </div>
      </div>

      <div className="mt-8 flex justify-center space-y-4 lg:mt-16 lg:space-y-8">
        <TestimonialCarousel />
      </div>

      <div className="mt-20 space-y-4 lg:mt-24 lg:space-y-12">
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          <span className="text-teal-900">How?</span> Negotiation, No fees. No
          markups.
        </h2>
        <div className="flex justify-center">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-32">
            <div>
              <div className="hidden lg:block">
                <Image
                  src={priceComparison}
                  alt=""
                  height={250}
                  placeholder="blur"
                  className="select-none"
                />
              </div>
              <div className="lg:hidden">
                <Image
                  src={priceComparison}
                  alt=""
                  width={350}
                  placeholder="blur"
                  className="select-none"
                />
              </div>
              <div className="mt-2 text-center text-sm font-extrabold text-[#FF0000] lg:text-lg">
                Airbnb
              </div>
              <div className="text-center text-xl font-extrabold text-[#FF0000] lg:text-2xl">
                $300/night
              </div>
            </div>
            <div>
              <div className="hidden lg:block">
                <Image
                  src={priceComparison}
                  alt=""
                  height={250}
                  placeholder="blur"
                  className="select-none"
                />
              </div>
              <div className="lg:hidden">
                <Image
                  src={priceComparison}
                  alt=""
                  width={350}
                  placeholder="blur"
                  className="select-none"
                />
              </div>
              <div className="mt-2 text-center text-sm font-extrabold text-teal-900 lg:text-lg">
                Tramona
              </div>
              <div className="text-center text-xl font-extrabold text-teal-900 lg:text-2xl">
                $250/night
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="mt-20 lg:grid lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col space-y-1 pb-6 text-left lg:mr-24 lg:flex lg:flex-col lg:justify-center lg:space-y-4">
            <h2 className="text-2xl font-extrabold lg:text-4xl">
              See completed requests
            </h2>
            <div className="text-sm font-semibold text-[#7E7564]">
              Check out our feed to see recent deals
            </div>
            <div className="hidden lg:block">
              <Button className="rounded-full bg-teal-900 hover:bg-teal-950">
                View deals
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <CompletedRequestsSection />
          </div>
          <div className="flex justify-center pt-8 lg:hidden">
            <Button className="w-80 rounded-full bg-teal-900 hover:bg-teal-950">
              View deals
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-20 mx-auto max-w-7xl justify-center space-y-4 lg:mb-20 lg:mt-28 lg:space-y-8">
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          Why use Tramona?
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start gap-3 rounded-lg p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-[#D8E5E3] p-2">
                <ShieldIcon className="h-6 w-6 text-teal-900" />
              </div>
              <h3 className="text-lg font-bold">Safety</h3>
            </div>
            <p className="text-sm text-[#584F3E]">
              Every host we work with{" "}
              <strong className="font-extrabold text-black">
                also lists on Airbnb
              </strong>
              . We give you the link to see the property before you book with
              us.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-lg p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-[#D8E5E3] p-2">
                <CircleDollarSign className="h-6 w-6 text-teal-900" />
              </div>
              <h3 className="text-lg font-bold">Price Transparency</h3>
            </div>
            <p className="text-sm text-[#584F3E]">
              We have <strong className="font-extrabold text-black">$0 fees for travelers</strong> and show you the
              listing on Airbnb to encourage you to check pricing on the same
              property.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-lg p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-[#D8E5E3] p-2">
                <TableProperties className="h-6 w-6 text-teal-900" />
              </div>
              <h3 className="text-lg font-bold">Submitting a Request</h3>
            </div>
            <p className="text-sm text-[#584F3E]">
              Send your travel details to all hosts in your destination city.
              They'll respond by offering you{" "}
              <strong className="font-extrabold text-black">
                properties outside of your budget on Airbnb, in your budget on
                Tramona
              </strong>
              .
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-lg p-4 lg:-mt-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-[#D8E5E3] p-2">
                <Handshake className="h-6 w-6 text-teal-900" />
              </div>
              <h3 className="text-lg font-bold leading-tight">
                Before you book, check Tramona
              </h3>
            </div>
            <p className="text-sm text-[#584F3E]">
              Tramona is <strong className="font-extrabold text-black">completely free to use</strong>, and we think
              you'll like it. Before you book, check Tramona to see{" "}
              <strong className="font-extrabold text-black">which special deals hosts will offer you</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="mt-8 space-y-4 lg:mt-14 lg:space-y-8">
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
      </div> */}

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 md:flex-row lg:mb-20">
        <div className="flex flex-1 flex-col items-center rounded-lg bg-gray-100 p-6 text-center">
          <h3 className="mb-4 text-2xl font-bold">Looking for a place?</h3>
          <p className="mb-6 text-sm text-gray-600">
            Tramona keeps guests safe by not only verifying them on Tramona, but
            also making sure they are verified on Airbnb as well.
          </p>
          <div className="mb-2 text-4xl font-bold text-teal-900">300,000+</div>
          <p className="mb-6 text-sm text-gray-600">
            properties your matches will be coming from
          </p>
          <button className="rounded-full bg-teal-900 px-6 py-2 text-white transition-colors hover:bg-teal-950">
            Submit a request
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center rounded-lg bg-gray-100 p-6 text-center">
          <h3 className="mb-4 text-2xl font-bold">Listing your place</h3>
          <p className="mb-6 text-sm text-gray-600">
            It's as easy as making an account, and signing up has a host. We
            have API access from the biggest PMS, or you can upload manually.
            Once on, wait for requests to roll in.
          </p>
          <div className="mb-2 text-4xl font-bold text-teal-900">15%</div>
          <p className="mb-6 text-sm text-gray-600">
            increase in occupancy when using Tramona
          </p>
          <button className="rounded-full bg-teal-900 px-6 py-2 text-white transition-colors hover:bg-teal-950">
            List my place
          </button>
        </div>
      </div>
    </section>
  );
}

export function DesktopSearchLayout() {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-muted-foreground lg:block">
        Send a request to every host in <br className="lg:hidden" />
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
