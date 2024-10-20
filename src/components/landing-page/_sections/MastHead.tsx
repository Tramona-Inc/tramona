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
import {
  CheckIcon,
  Shield,
  UserCheck,
  Calendar,
  PhoneCall,
} from "lucide-react";
import { scrollToTop } from "@/utils/utils";
import landing_airbnb from "public/assets/images/landing-page/landing_airbnb.png";
import landing_sunset from "public/assets/images/landing-page/landing_sunset.png";
import LandingSearchBar from "../SearchBars/LandingSearchBar";
import FAQ from "@/components/landing-page/_sections/FAQ";

export default function MastHead() {
  return (
    <section className="relative overflow-hidden bg-white pb-32">
      <div className="mx-auto max-w-[90%] px-4 lg:max-w-[80%]">
        <div className="relative pt-20">
          <div className="relative min-h-[600px]">
            {/* Content */}
            <div className="relative z-20 mb-8">
              <h1 className="mb-4 text-4xl font-bold text-zinc-900 sm:text-5xl">
                The best prices on Airbnbs anywhere
              </h1>
              <p className="text-xl text-zinc-900">
                Make deals with hosts on their empty nights
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative z-30 w-full overflow-hidden rounded-2xl shadow-xl lg:w-[60%]">
              <LandingSearchBar />
            </div>

            {/* Background Image */}
            <div className="absolute right-0 top-10 z-10 w-[800px] max-w-none">
              <div className="relative h-[500px]">
                <Image
                  src={landing_airbnb}
                  alt="Modern Airbnb property"
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  className="rounded-l-[3rem]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Host/Traveler Section */}
        <div className="relative my-16">
          <div className="absolute inset-0 mt-8 rounded-3xl bg-blue-50"></div>
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

        {/* Name Your Own Price and Form Section */}
        <div className="relative mb-16">
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

          {/* How Tramona Works Section */}
          <div className="mt-12 rounded-3xl bg-[#F4F6F8] p-8">
            <h2 className="mb-6 text-center text-3xl font-bold">
              How Tramona works
            </h2>

            <div className="mb-6">
              <p className="text-gray-700">
                <span className="font-bold leading-relaxed text-black">
                  For Travelers:{" "}
                </span>
                Submit your travel request with dates, location, and budget, or
                use the "Book it Now" option to instantly book available stays
                at great prices. Hosts review your custom requests and send
                personalized offers, and once you agree on the price, you can
                book directly through Tramona.
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                <span className="font-bold leading-relaxed text-black">
                  For Hosts:{" "}
                </span>
                Receive traveler requests or enable the "Book it Now" feature
                for instant bookings. You control the price and get the option
                fill vacancies by offering deals directly to travelers.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                variant="secondary"
                className="bg-primaryGreen text-white"
              >
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>

          {/* Live Cities and Hosts Section */}
          <div className="mt-16 rounded-3xl bg-white p-8">
            <h2 className="mb-4 text-center text-3xl font-bold">
              We are currently live in{" "}
              <span className="underline">35 cities</span> and counting
            </h2>
            <p className="mb-8 text-center text-gray-600">
              Are you a host in a city we are not yet live in?{" "}
              <a href="/for-hosts" className="text-teal-600 hover:underline">
                Become a host
              </a>{" "}
              and help us launch there.
            </p>

            <div className="border-gray mb-12 w-full border-t-2" />

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="relative h-[400px] w-full">
                <Image
                  src={landing_sunset}
                  alt="Family on beach at sunset"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="mb-4 text-2xl font-bold">
                  Hosts: Fill Your Empty Nights and Earn More
                </h3>
                <p className="mb-6 text-zinc-900">
                  Whether you're in one of our 'Book It Now' cities or elsewhere
                  in the U.S., you can list your property and start earning.
                  Accept 'Name Your Own Price' offers from travelers nationwide.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Shield className="mr-2 size-4 shrink-0 text-teal-600" />{" "}
                    $50k protection per booking
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="mr-2 size-4 shrink-0 text-teal-600" />{" "}
                    3 levels of verification for travelers
                  </li>
                  <li className="flex items-center">
                    <Calendar className="mr-2 size-4 shrink-0 text-teal-600" />{" "}
                    Easy to sync your calendar up with other platforms to
                    prevent double bookings
                  </li>
                  <li className="flex items-center">
                    <PhoneCall className="mr-2 size-4 shrink-0 text-teal-600" />{" "}
                    24/7 support
                  </li>
                </ul>
                <Button className="self-start bg-primaryGreen text-white">
                  <Link href="/for-hosts">List your property</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Carousel Section */}
        <div className="my-20">
          {/* Black separator above carousel */}
          <div className="border-gray mb-12 w-full border-t-2" />

          {/* Carousel section */}
          <div className="my-12">
            <TestimonialCarousel />
          </div>

          {/* Black separator below carousel */}
          <div className="border-gray mt-12 w-full border-t-2" />
        </div>

        {/* Why use Tramona Section */}
        <div className="mt-20 justify-center space-y-4 lg:mt-28 lg:space-y-8">
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

        {/* Final CTA Section */}
        <div className="grid gap-4 pt-32 md:grid-cols-2">
          <div className="flex flex-1 flex-col items-center rounded-2xl bg-zinc-100 p-6 text-center">
            <div className="flex-1">
              <h3 className="mb-4 text-3xl font-bold">Looking for a place?</h3>
              <p className="mb-6 text-sm text-zinc-600">
                Tramona keeps guests safe by not only verifying them on Tramona,
                but also making sure they are verified on Airbnb as well.
              </p>
            </div>
            <div className="mb-2 text-4xl font-bold text-teal-900">
              300,000+
            </div>
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
                We have API access from the biggest PMS&apos;s, or you can
                upload manually. Once on, wait for requests to roll in.
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
            <FAQ />
          </div>
        </div>
      </div>
    </section>
  );
}
