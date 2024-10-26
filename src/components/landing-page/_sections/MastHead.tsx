import landing_hosts from "public/assets/images/landing-page/landing_hosts.png";
import landing_travelers from "public/assets/images/landing-page/landing_travelers.png";
import landing_airbnb from "public/assets/images/landing-page/landing_airbnb.png";
import landing_sunset from "public/assets/images/landing-page/landing_sunset.png";
import { Button } from "@/components/ui/button";
import CityRequestFormContainer from "../SearchBars/CityRequestFormContainer";
import Link from "next/link";
import { Shield, UserCheck, Calendar, PhoneCall, Check } from "lucide-react";
import LandingSearchBar from "../SearchBars/LandingSearchBar";
import Image from "next/image";
import { TestimonialCarousel } from "./testimonials/TestimonialCarousel";
import FAQ from "@/components/landing-page/_sections/FAQ";
import DynamicDesktopSearchBar from "../search/DynamicDesktopSearchBar";
import MobileFilterBar from "../search/MobileFilterBar";
import MobileSearchDialog from "../search/MobileSearchDialog";
import { useState } from "react";
import { AdjustedPropertiesProvider } from "../search/AdjustedPropertiesContext";
import airbnbLanding from "public/assets/images/landing-page/airbnbLanding.png";
import Typewriter from "typewriter-effect";
import SliderToggle from "../search/Slider";
import TotalBooking from "./TotalBooking";

export default function MastHead() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeOption, setActiveOption] = useState<"price" | "book">("price");

  const handleToggle = (value: "price" | "book") => {
    setActiveOption(value);
  };
  return (
    <>
      <section className="relative overflow-hidden bg-white pb-32">
        {/* Mobile Background Image with overlay - hidden on desktop */}
        <div className="absolute inset-0 z-0 min-[900px]:hidden">
          <div className="relative h-[440px] w-full">
            <Image
              src={airbnbLanding}
              alt="Modern Airbnb property"
              layout="fill"
              objectFit="cover"
            />
            {/* Shadow overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>

        <div className="mx-auto max-w-[90%] px-4 lg:max-w-[80%]">
          <div className="relative min-[900px]:pt-20">
            <div className="relative min-h-[500px] lg:min-h-[600px]">
              {/* Content Section */}
              <div className="relative z-20 mb-8">
                {/* Desktop Version */}
                <div className="hidden min-[900px]:block">
                  <h1 className="mb-4 text-[36px] font-bold text-black min-[1102px]:text-[40px]">
                    Best Deals on Short-Term Rentals{" "}
                    <span className="whitespace-nowrap">anywhere</span>
                  </h1>
                  <p className="mb-8 text-[22px] font-bold text-black min-[1102px]:text-[24px]">
                    Name your price or book instantly at unbeatable rates
                  </p>
                </div>

                {/* Mobile Version */}
                <div className="text-center min-[900px]:hidden">
                  <h1 className="mb-6 mt-0 pt-8 text-4xl font-bold text-white">
                    The Best Prices on
                    <br />
                    Airbnbs Anywhere
                  </h1>
                </div>
              </div>

              {/* Search Bar Container */}
              <div className="relative z-30 mt-20 w-full lg:w-[60%]">
                {/* Desktop Search */}
                <div className="hidden min-[900px]:block">
                  <div className="rounded-2xl shadow-xl">
                    <LandingSearchBar />
                  </div>
                </div>

                {/* Mobile Search */}
                <div className="min-[900px]:hidden">
                  <div className="space-y-3">
                    <p className="text-md text-center font-semibold text-muted-foreground text-white lg:block">
                      Send a request to every host in{" "}
                      <span className="font-bold text-white">
                        <Typewriter
                          component={"span"}
                          options={{
                            strings: ["SEATTLE", "PARIS", "MIAMI", "ANY CITY"],
                            autoStart: true,
                            loop: true,
                          }}
                        />
                      </span>
                    </p>
                    <MobileSearchDialog
                      open={isSearchOpen}
                      onOpenChange={setIsSearchOpen}
                      activeOption={activeOption}
                    />
                    <SliderToggle
                      onToggle={handleToggle}
                      defaultValue="price"
                      className="mt-4"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-32 min-[900px]:hidden">
                <div className="space-y-6 rounded-2xl bg-white p-6">
                  <h2 className="text-center text-xl font-medium">
                    Make deals with hosts on their empty nights
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Check className="mr-2 text-primaryGreen" size={24} />
                      <span className="text-zinc-900">
                        Flexible Cancelation Policies
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Check className="mr-2 text-primaryGreen" size={24} />
                      <span className="text-zinc-900">
                        Same properties you see on Airbnb
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Check className="mr-2 text-primaryGreen" size={24} />
                      <span className="text-zinc-900">Best Prices</span>
                    </div>
                  </div>

                  <p className="text-center text-sm text-gray-600">
                    Search the best deals available{" "}
                    <span className="underline">anywhere</span> on short term
                    rentals right now
                  </p>
                </div>
              </div>

              {/* Desktop Background Image - Keep original styling */}
              <div className="absolute right-0 top-20 z-10 mt-12 hidden w-[775px] max-w-none min-[900px]:block">
                <div className="relative h-[450px]">
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

          <div className="mb-24 mt-32 hidden md:block">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <TotalBooking />
              </div>
            </div>
          </div>

          {/* Host/Traveler Section */}
          <div className="relative md:mb-24 md:mt-48">
            <div className="absolute inset-0 mt-0 rounded-3xl bg-primaryGreen md:mt-24"></div>
            <div className="relative grid gap-6 px-4 pb-12 pt-4 sm:grid-cols-2 sm:px-12">
              {/* Host Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
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
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
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
                    Tramona is the only platform where travelers can
                    consistently find the best prices on Airbnbs. Name your own
                    price, or book it now for an unbeatable price.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Name Your Own Price and Form Section */}
          <div className="relative mb-16">
            {/* Changed this line to handle responsive layout properly */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-8">
              {/* Left Column - Description */}
              <div className="flex flex-col justify-center">
                <h2 className="mb-4 text-3xl lg:text-[34px]">
                  <span className="font-bold text-primaryGreen">
                    Name Your Own Price—
                  </span>
                  <span className="font-normal text-primaryGreen">
                    Anywhere in the U.S.
                  </span>
                </h2>
                <p className="mb-6 text-center text-lg text-black">
                  When hosts have vacancies, no one wins.
                </p>
                <ul className="mb-6 list-decimal pl-5 text-lg text-black">
                  <li>Where you want to go</li>
                  <li>How much you want to spend</li>
                  <li>Amount of guests</li>
                  <li>Your dates</li>
                </ul>
                <p className="text-lg text-black">
                  Your request then goes out to every host in that area with a
                  vacancy
                </p>
              </div>

              {/* Right Column - Form */}
              <div className="flex items-center justify-end">
                <div className="right-0 w-full max-w-md rounded-2xl border bg-white p-6 shadow-2xl lg:max-w-2xl">
                  <CityRequestFormContainer />
                </div>
              </div>
            </div>

            {/* How Tramona Works Section */}
            <div className="-mx-4 mt-12 rounded-none bg-[#F4F6F8] p-8 md:mx-0 md:rounded-3xl">
              <h2 className="mb-2 text-center text-3xl font-bold text-primaryGreen">
                How Tramona works
              </h2>
              <p className="mb-6 text-center text-xl font-medium text-primaryGreen">
                The Priceline of Airbnbs
              </p>

              <div className="mx-auto max-w-4xl">
                <div className="mx-auto max-w-full">
                  <p className="mb-6 text-left text-xl font-semibold leading-relaxed text-primaryGreen">
                    For Travelers: Set your budget, submit your offer, or book
                    instantly at unbeatable prices.
                  </p>

                  <p className="mb-12 text-left text-xl font-semibold leading-relaxed text-primaryGreen">
                    For Hosts: Receive requests, accept, reject, or counter
                    offers with total control over pricing.
                  </p>
                </div>
              </div>

              <div className="mb-4 flex justify-center">
                <Button
                  variant="secondary"
                  className="bg-primaryGreen text-white"
                >
                  <Link href="/how-it-works">How it works</Link>
                </Button>
              </div>

              <p className="font-[24px]text-primaryGreen text-center text-xl font-medium">
                Never let a night go to waste
              </p>
            </div>

            {/* New Banner - Desktop Only */}
            <div className="relative mt-12 hidden md:block">
              <div className="absolute inset-x-0 left-[50%] w-screen -translate-x-1/2 bg-[#1C3D36] py-6">
                <div className="text-center text-xl font-medium text-white">
                  Lowest fees on the market. 40% lower than Airbnb and other
                  competitors
                </div>
              </div>
              {/* Spacer div to maintain layout flow */}
              <div className="h-[72px]" />
            </div>

            {/* Book It Now Section */}
            <div className="mt-16 hidden rounded-3xl bg-white p-8 md:block">
              <h2 className="text-center text-3xl font-bold text-primaryGreen">
                Book It Now- Best deals on Airbnbs{" "}
                <span className="font-bold text-primaryGreen underline">
                  Anywhere
                </span>
              </h2>
              <div className="mx-auto max-w-3xl"></div>
            </div>

            {/* City Carousel Section */}
            <AdjustedPropertiesProvider>
              <DynamicDesktopSearchBar />
            </AdjustedPropertiesProvider>
            <div className="md:my-12"></div>

            {/* Live Cities and Hosts Section */}
            <div className="rounded-3xl bg-white p-8 md:mt-16">
              <h2 className="mb-4 text-center text-3xl font-bold">
                We are currently live in{" "}
                <span className="underline">35 cities</span> and counting
              </h2>
              <p className="mb-8 text-center text-primaryGreen">
                Are you a host in a city we are not yet live in?{" "}
                <a href="/for-hosts" className="text-teal-600 underline">
                  Become a host
                </a>{" "}
                and help us launch there as soon as possible.
              </p>
            </div>

            <div className="mb-12 w-full border-t border-black" />

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="relative hidden h-[400px] w-full md:block">
                <Image
                  src={landing_sunset}
                  alt="Family on beach at sunset"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="mb-3 hidden text-2xl font-bold text-primaryGreen md:block">
                  Hosts: Fill Your Empty Nights and Earn More
                </h3>
                <h3 className="mb-3 hidden text-2xl font-medium text-primaryGreen md:block">
                  The Priceline for Airbnbs
                </h3>
                <p className="mb-6 text-black">
                  Tramona helps you earn more from your empty nights. Keep your
                  pricing unchanged on platforms like Airbnb and Vrbo, while
                  receiving direct requests, on your empty nights, from
                  travelers through Tramona. Accept, reject, or counter any
                  request—your pricing, your control.
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
                <Button className="mx-auto bg-primaryGreen text-white md:mx-0 md:self-start">
                  <Link href="/for-hosts">List your property</Link>
                </Button>
                <p className="mt-3 text-center text-sm text-gray-600 md:text-left">
                  Fully sign up in 1 minute with our “Connect with Airbnb”
                  option
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Carousel Section - Hidden on Mobile */}
          <div className="my-20 hidden md:block">
            <div className="mb-12 w-full border-t border-black" />
            <div className="my-12">
              <TestimonialCarousel />
            </div>
            <div className="mt-12 w-full border-t border-black" />
          </div>

          {/* Final CTA Section - FAQ Hidden on Mobile */}
          <div className="col-span-full hidden flex-col gap-2 rounded-2xl bg-zinc-100 p-6 md:flex">
            <FAQ />
          </div>
        </div>
      </section>

      {/* Ready to Experience Tramona Section */}
      <div className="col-span-full mt-16 hidden bg-[#1C3D36] px-8 py-8 text-white md:block">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Ready to Experience Tramona
        </h2>
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-12 sm:space-y-0">
          <Button
            variant="outline"
            className="w-[200px] rounded-md bg-white py-6 text-black hover:bg-white/90"
          >
            <Link href="/how-it-works">Name Your Own Price</Link>
          </Button>
          <Button
            variant="outline"
            className="w-[200px] rounded-md bg-white py-6 text-black hover:bg-white/90"
          >
            <Link href="/how-it-works">Book it Now</Link>
          </Button>
          <Button
            variant="outline"
            className="w-[200px] rounded-md bg-white py-6 text-black hover:bg-white/90"
          >
            <Link href="/for-hosts">Become a host</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
