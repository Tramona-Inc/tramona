import landing_hosts from "public/assets/images/landing-page/landing_hosts.png";
import landing_travelers from "public/assets/images/landing-page/landing_travelers.png";

import priceComparison from "public/assets/images/pricecomparison.jpg";
import { Button } from "@/components/ui/button";
import UserAvatarMastHead from "@/components/_common/UserAvatarMasthead";
import { Avatar } from "@/components/ui/avatar";
import CityRequestFormContainer from "../SearchBars/CityRequestFormContainer";
import { TestimonialCarousel } from "./testimonials/TestimonialCarousel";
import Image from "next/image";
import CompletedRequestsSection from "./CompletedRequests";
import Link from "next/link";
import { whyUseTramonaCopy } from "./why-use-tramona-copy";
import { CheckIcon } from "lucide-react";
import { scrollToTop } from "@/utils/utils";

export default function MastHead() {
  return (
    <section className="relative bg-white pb-32">
      {/* Main Title Section */}
      <div className="relative sm:mb-24 sm:h-[640px] lg:mb-0">
        <div className="relative grid h-full grid-cols-1 p-4 lg:grid-cols-1">
          <div className="flex flex-col justify-center">
            <div className="relative pt-10 text-center">
              <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold text-zinc-900 lg:text-5xl">
                The best prices on Airbnbs anywhere
              </h1>
              <p className="mx-auto max-w-[38rem] pt-4 text-xs font-semibold text-zinc-900 lg:pt-4 lg:text-base">
                Make deals with hosts on their empty nights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Host/Traveler Section */}
      <div className="relative mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Blue background with rounded corners */}
          <div className="absolute inset-0 mt-8 rounded-3xl bg-blue-50"></div>

          {/* Cards container */}
          <div className="relative grid gap-6 px-4 pb-12 pt-4 sm:grid-cols-2 sm:px-6">
            {/* Host Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="relative h-48 sm:h-64">
                <Image
                  src={landing_hosts}
                  alt="Hosts relaxing on beach"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold">Hosts</h2>
                <p className="mb-4 text-sm">
                  Tramona is the only platform built specifically for hosts to
                  fill their hard-to-book, empty nights.
                </p>
                <Link
                  href="/for-hosts"
                  className="text-sm font-medium text-teal-600 hover:underline"
                >
                  Learn more about hosting
                </Link>
              </div>
            </div>

            {/* Traveler Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="relative h-48 sm:h-64">
                <Image
                  src={landing_travelers}
                  alt="Travelers enjoying a cabin"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold">Travelers</h2>
                <p className="mb-4 text-sm">
                  Tramona is the only platform where travelers can consistently
                  find the best prices on Airbnbs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Name Your Own Price and Form Section */}
      <div className="relative mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="mb-4 text-3xl lg:text-4xl">
              <span className="font-bold">Name Your Own Price—</span>
              <span className="font-normal">Anywhere in the U.S.</span>
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              When hosts have vacancies, no one wins.
            </p>
            <ul className="mb-6 list-decimal pl-5 text-lg text-gray-600">
              <li>Where you want to go</li>
              <li>How much you want to spend</li>
              <li>Amount of guests</li>
              <li>Your dates</li>
            </ul>
            <p className="text-lg text-gray-600">
              Your request then goes out to every host in that area with a
              vacancy
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
              <CityRequestFormContainer />
            </div>
          </div>
        </div>
      </div>

      <div className="h-24 lg:h-60"></div>

      <p className="text-balance p-4 text-center font-semibold">
        Try it before you book. See what hosts will offer you!
      </p>

      <div className="mx-0 mt-8 flex max-w-full justify-center space-y-4 px-4 lg:mx-4 lg:mt-16 lg:flex lg:space-y-8">
        <TestimonialCarousel />
      </div>
      <div className="mx-auto my-40 w-5/6 max-w-7xl text-center text-2xl font-semibold tracking-tight lg:my-48 lg:text-4xl">
        When hosts have no one staying at their property, they would rather make
        something over nothing. With Tramona, your request goes out to every
        host with a vacancy, so you get the best deal, every time.
      </div>

      <div className="mt-20 space-y-4 lg:space-y-12">
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          <span className="text-teal-900">How?</span> Negotiation, 50% less
          fees. No markups.
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
        <div className="mt-20 p-4 lg:grid lg:grid-cols-2 xl:gap-24">
          <div className="flex flex-col space-y-1 pb-6 text-left lg:mr-24 lg:flex lg:flex-col lg:justify-center lg:space-y-4">
            <h2 className="text-2xl font-extrabold lg:text-4xl">
              See completed requests
            </h2>
            <div className="text-sm font-semibold text-muted-foreground">
              Check out our feed to see recent deals
            </div>
            <div className="hidden lg:block">
              <Button asChild>
                <Link href="/exclusive-offers">View deals</Link>
              </Button>
            </div>
          </div>
          <CompletedRequestsSection />
          <div className="flex justify-center pt-8 lg:hidden">
            <Button asChild size="lg">
              <Link href="/exclusive-offers">View deals</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl justify-center space-y-4 p-4 lg:mt-28 lg:space-y-8">
        <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
          Why use Tramona?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUseTramonaCopy.map(({ icon: Icon, title, bullets }) => (
            <div key={title} className="rounded-2xl border p-4">
              <div className="inline-block rounded-lg bg-primaryGreen-background p-2 text-primaryGreen">
                <Icon />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <div className="space-y-2 pt-4">
                {bullets.map((bullet) => (
                  <div key={bullet} className="flex gap-2 text-sm">
                    <CheckIcon className="size-4 shrink-0 text-zinc-400" />
                    <p className="text-zinc-600">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 pt-32 md:grid-cols-2">
        <div className="flex flex-1 flex-col items-center rounded-2xl bg-zinc-100 p-6 text-center">
          <div className="flex-1">
            <h3 className="mb-4 text-3xl font-bold">Looking for a place?</h3>
            <p className="mb-6 text-sm text-zinc-600">
              Tramona keeps guests safe by not only verifying them on Tramona,
              but also making sure they are verified on Airbnb as well.
            </p>
          </div>
          <div className="mb-2 text-4xl font-bold text-teal-900">300,000+</div>
          <p className="mb-6 text-sm text-zinc-600">
            properties your matches will be coming from
          </p>
          <Button onClick={scrollToTop} size="lg" className="rounded-full">
            Submit a request
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center rounded-2xl bg-zinc-100 p-6 text-center">
          <div className="flex-1">
            <h3 className="mb-4 text-3xl font-bold">Listing your place?</h3>
            <p className="mb-6 text-sm text-zinc-600">
              It&apos;s as easy as making an account and signing up as a host.
              We have API access from the biggest PMS&apos;s, or you can upload
              manually. Once on, wait for requests to roll in.
            </p>
          </div>
          <div className="mb-2 text-4xl font-bold text-teal-900">15%</div>
          <p className="mb-6 text-sm text-zinc-600">
            increase in occupancy when using Tramona
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/for-hosts">List my place</Link>
          </Button>
        </div>

        <div className="col-span-full flex flex-col items-center gap-2 rounded-2xl bg-zinc-100 p-6">
          <h2 className="text-center text-3xl font-bold">New To Tramona?</h2>
          <div className="text-sm font-medium text-zinc-600">
            Check out our FAQ for any questions, or send us a message directly
          </div>
          <Button asChild size="lg" className="mt-4 w-40 rounded-full">
            <Link href="/faq">FAQ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
