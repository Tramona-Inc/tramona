import landingBg from "public/assets/images/landing-bg.jpg";
import priceComparison from "public/assets/images/pricecomparison.jpg";
import { Button } from "@/components/ui/button";
import UserAvatarMastHead from "@/components/_common/UserAvatarMasthead";
import { Avatar } from "@/components/ui/avatar";
import {
  CircleDollarSign,
  Handshake,
  ShieldIcon,
  TableProperties,
} from "lucide-react";
import CityRequestFormContainer from "../SearchBars/CityRequestFormContainer";
import { TestimonialCarousel } from "./testimonials/TestimonialCarousel";
import Image from "next/image";
import CompletedRequestsSection from "./CompletedRequests";
import Link from "next/link";

export default function MastHead() {



  return (
    // padding for the sides? and do we want rounded corners?
    <section className="relative bg-white pb-4">
      <div className="relative sm:mb-24 sm:h-[700px] lg:mb-0">
        <div className="absolute inset-0">
          <Image
            src={landingBg}
            alt=""
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            className="select-none"
          />
        </div>
        {/* <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-black"></div> */}
        <div className="relative grid h-full grid-cols-1 p-4 lg:grid-cols-1">
          <div className="flex flex-col justify-center">
            <div className="relative pt-10 text-center">
              {/* <div className="relative inline-block rounded-full border-t border-white/20 bg-teal-900  px-3 font-extrabold uppercase tracking-wide text-white shadow-[1px_1px_10px] shadow-teal-100/60">
                $250k+ saved so far
              </div> */}
              {/* <div className="relative inline-flex items-center gap-1 rounded-full border-t border-white/30 bg-teal-50 px-3 text-sm font-extrabold uppercase tracking-wide text-teal-900 sm:text-base">
                $250k+ saved so far
              </div> */}
              <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold text-zinc-900 lg:text-5xl">
                Book the same properties you see on Airbnb for less
              </h1>
              <p className="mx-auto max-w-[38rem] pt-4 text-xs font-semibold text-zinc-900 lg:pt-4 lg:text-base">
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
                    +800
                  </Avatar>
                </div>
                <p className="ml-2 text-xs font-semibold text-[#7E7564]">
                  Requests made in the last 1 month
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:p-10">
            <div className="mt-12 flex-1 rounded-2xl border bg-white p-4 shadow-2xl lg:mt-0 lg:max-w-xl">
              <CityRequestFormContainer />
            </div>
          </div>
        </div>
      </div>

      <div className="h-24 lg:h-60"></div>

      <div className="mx-0 mt-8 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:mt-16 lg:flex lg:space-y-8">
        <TestimonialCarousel />
      </div>
      {/* <div className="mt-8 flex max-w-full justify-center space-y-4 lg:mx-0 lg:mt-16 lg:hidden lg:space-y-8">
        <MobileTestimonialCarousel />
      </div> */}

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
        <div className="mt-20 lg:grid lg:grid-cols-2 xl:gap-24">
          <div className="flex flex-col space-y-1 pb-6 text-left lg:mr-24 lg:flex lg:flex-col lg:justify-center lg:space-y-4">
            <h2 className="text-2xl font-extrabold lg:text-4xl">
              See completed requests
            </h2>
            <div className="text-sm font-semibold text-[#7E7564]">
              Check out our feed to see recent deals
            </div>
            <div className="hidden lg:block">
              <Link href="/exclusive-offers">
                <Button variant="greenPrimary">View deals</Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <CompletedRequestsSection />
          </div>
          <div className="flex justify-center pt-8 lg:hidden">
            <Link href="/exclusive-offers">
              <Button variant="greenPrimary" size="lg">
                View deals
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl justify-center space-y-4 lg:mb-20 lg:mt-28 lg:space-y-8">
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          Why use Tramona?
        </h2>
        <div className="grid grid-cols-1 basis-1/3  gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col grow items-start gap-3 rounded-lg p-4">
            <div className="mb-2 flex  items-center gap-2">
              <div className="rounded-lg bg-[#D8E5E3] p-2">
                <ShieldIcon className="h-6 w-6 text-teal-900" />
              </div>
              <h3 className="text-lg font-bold">Safety</h3>
            </div>
            <ul className="flex flex-col h-72 basi-1/3 gap-2 list-disc list-inside text-sm text-[#584F3E]">
              <li className="h-16 pb-2">
                Our hosts lists and are also verified on Airbnb
              </li>
              <li className="h-16 pb-2">
                We provide direct links to listings on this platforms
              </li>
              <li className="h-16 pb-2">
                All travelers are verified for your peace of mind.
              </li>
              <li className="h-16 pb-2">
                Minimum of $50,000 coverage per booking
              </li>
            </ul>
            <p className="place-content-end text-sm basis-1/3 text-[#584F3E] text-center">
              <strong className="font-extrabold text-black">
                Hosts benefits from our strict verification process ensuring reliable guests.
              </strong>
            </p>
          </div>
          <div className="flex flex-col basis-1/3 items-start gap-3 rounded-lg p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-[#D8E5E3] p-2">
                <CircleDollarSign className="h-6 w-6 text-teal-900" />
              </div>
              <h3 className="text-lg font-bold">Price Transparency</h3>
            </div>
            <ul className="flex flex-col gap-2 h-72 basis-1/3 list-disc list-inside text-sm text-[#584F3E]">
              <li className="h-16 pb-2">
                50% lower fees than Airbnb and other major platforms.
              </li>
              <li className="h-16 pb-2">
                We show you the listings on Airbnb for each property.
              </li>
              <li className="h-16 pb-2">
                Easily compare our prices with Airbnb.
              </li>

            </ul>
            <p className="place-content-end pb-5 text-sm basis-1/3  text-[#584F3E] text-center">
              <strong className="font-extrabold text-black">
                Hosts can earn more with our lower fee structure.
              </strong>
            </p>
          </div>
          <div className="flex flex-col basis-1/3 items-start gap-3 rounded-lg p-4">
            <div className="mb-2 flex  items-center gap-2">
              <div className="rounded-lg bg-[#D8E5E3] p-2">
                <TableProperties className="h-6 w-6 text-teal-900" />
              </div>
              <h3 className="text-lg font-bold">Submitting a Request</h3>
            </div>
            <ul className="flex flex-col gap-2 h-72 basis-1/3 list-disc list-inside text-sm text-[#584F3E]">
              <li className="h-16 pb-2">
                Send travel details to all hosts in your destination.
              </li>
              <li className="h-16 pb-2">
                Receive offers for properties outside your budget on Airbnb, within your budget on Tramona.
              </li>
              <li className="h-16 pb-2">
                Compare directly to the property on Airbnb to see the savings.
              </li>
            </ul>
            <p className="place-content-end pb-5 basis-1/3 text-sm text-[#584F3E] text-center">
              <strong className="font-extrabold text-black">
                Hosts receive more booking requests from price-conscious travelers.
              </strong>
            </p>
          </div>
          <div className="flex flex-col items-start basis-1/3 gap-3 rounded-lg p-4 lg:-mt-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-[#D8E5E3] p-2">
                <Handshake className="h-6 w-6 text-teal-900" />
              </div>
              <h3 className="text-lg font-bold leading-tight">
                Before you book, check Tramona
              </h3>
            </div>
            <ul className="flex flex-col basis-1/3 h-72 gap-2 list-disc list-inside text-sm text-[#584F3E]">
              <li className="h-16 pb-2">
                Tramona is completely free to use.
              </li>
              <li className="h-16 pb-2">
                See exclusive, one-of-a-kind deals everytime.
              </li>
              <li className="h-16 pb-2">
                Effortlessly compare pricing to Airbnb or other platforms before booking.
              </li>
            </ul>
            <p className="place-content-end pb-5 basis-1/3 text-sm text-[#584F3E] text-center">
              <strong className="font-extrabold text-black">
                Hosts get increased visibility and more booking opportunities
              </strong>
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

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-3 py-8 md:flex-row lg:mb-20">
        <div className="flex flex-1 flex-col items-center rounded-lg bg-zinc-100 p-6 text-center">
          <h3 className="mb-4 text-2xl font-bold">Looking for a place?</h3>
          <p className="mb-6 text-sm text-zinc-600">
            Tramona keeps guests safe by not only verifying them on Tramona, but
            also making sure they are verified on Airbnb as well.
          </p>
          <div className="mb-2 text-4xl font-bold text-teal-900">300,000+</div>
          <p className="mb-6 text-sm text-zinc-600">
            properties your matches will be coming from
          </p>
          <button className="rounded-full bg-teal-900 px-6 py-2 text-white transition-colors hover:bg-teal-950">
            Submit a request
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center rounded-lg bg-zinc-100 p-6 text-center">
          <h3 className="mb-4 text-2xl font-bold">Listing your place?</h3>
          <p className="mb-6 text-sm text-zinc-600">
            It&apos;s as easy as making an account and signing up as a host. We
            have API access from the biggest PMS&apos;s, or you can upload
            manually. Once on, wait for requests to roll in.
          </p>
          <div className="mb-2 text-4xl font-bold text-teal-900">15%</div>
          <p className="mb-6 text-sm text-zinc-600">
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
