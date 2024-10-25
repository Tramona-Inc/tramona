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
                  <h1 className="mb-4 text-[44px] font-bold text-zinc-900 min-[1102px]:text-[48px]">
                    The best prices on Airbnbs{" "}
                    <span className="whitespace-nowrap">anywhere</span>
                  </h1>
                  <p className="mb-8 text-[22px] font-bold text-zinc-900 min-[1102px]:text-[24px]">
                    Make deals with hosts on their empty nights
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

          {/* Host/Traveler Section */}
          <div className="relative md:mb-24 md:mt-48">
            <div className="absolute inset-0 mt-0 rounded-3xl bg-[#DEEEFB] md:mt-24"></div>
            <div className="relative grid gap-6 px-4 pb-12 pt-4 sm:grid-cols-2 sm:px-6">
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

              {/* Right Column - Form */}
              <div className="flex items-center justify-end">
                <div className="right-0 w-full max-w-md rounded-2xl border bg-white p-6 shadow-2xl lg:max-w-xl">
                  <CityRequestFormContainer />
                </div>
              </div>
            </div>

            {/* How Tramona Works Section */}
            <div className="-mx-4 mt-12 rounded-none bg-[#F4F6F8] p-8 md:mx-0 md:rounded-3xl">
              <h2 className="mb-6 text-center text-3xl font-bold">
                How Tramona works
              </h2>

              <div className="mb-6">
                <p className="text-gray-700">
                  <span className="font-bold leading-relaxed text-black">
                    For Travelers:{" "}
                  </span>
                  Submit your travel request with dates, location, and budget,
                  or use the "Book it Now" option to instantly book available
                  stays at great prices. Hosts review your custom requests and
                  send personalized offers, and once you agree on the price, you
                  can book directly through Tramona.
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

            <div className="mt-16 hidden rounded-3xl bg-white p-8 md:block">
              <h2 className="text-center text-3xl">
                Book It Now- Best deals on Airbnbs{" "}
                <span className="font-bold underline">Anywhere</span>
              </h2>
              <div className="mx-auto max-w-3xl"></div>
            </div>

            {/* City Carousel Section */}
            <div className="md:my-20">
              <AdjustedPropertiesProvider>
                <DynamicDesktopSearchBar />
              </AdjustedPropertiesProvider>
              <div className="md:my-12"></div>
            </div>

            {/* Live Cities and Hosts Section */}
            <div className="rounded-3xl bg-white p-8 md:mt-16">
              <h2 className="mb-4 text-center text-3xl font-bold">
                We are currently live in{" "}
                <span className="underline">35 cities</span> and counting
              </h2>
              <p className="mb-8 text-center text-gray-600">
                Are you a host in a city we are not yet live in?{" "}
                <a href="/for-hosts" className="text-teal-600 underline">
                  Become a host
                </a>{" "}
                and help us launch there.
              </p>
            </div>

            <div className="border-gray mb-12 hidden w-full border-t-2 md:block" />

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
                <h3 className="mb-4 hidden text-2xl font-bold md:block">
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
                <Button className="mx-auto bg-primaryGreen text-white md:mx-0 md:self-start">
                  <Link href="/for-hosts">List your property</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Testimonial Carousel Section - Hidden on Mobile */}
          <div className="my-20 hidden md:block">
            <div className="border-gray mb-12 w-full border-t-2" />
            <div className="my-12">
              <TestimonialCarousel />
            </div>
            <div className="border-gray mt-12 w-full border-t-2" />
          </div>

          {/* Final CTA Section - FAQ Hidden on Mobile */}
          <div className="grid gap-4 pt-32">
            <div className="col-span-full hidden flex-col gap-2 rounded-2xl bg-zinc-100 p-6 md:flex">
              <FAQ />
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Experience Tramona Section */}
      <div className="col-span-full mt-16 hidden bg-[#1C3D36] p-8 text-white md:block">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Ready to Experience Tramona
        </h2>
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button variant="outline" className="w-full sm:w-auto">
            <Link href="">Name Your Own Price</Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Link href="">Book it now</Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Link href="/for-hosts">Become a host</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
