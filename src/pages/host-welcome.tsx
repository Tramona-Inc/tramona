import MainLayout from "@/components/_common/MainLayout";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FeedLanding from "@/components/feeds/feed-landing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/utils/utils";
import Autoplay, { type AutoplayOptionsType } from "embla-carousel-autoplay";

type Tabs = {
  id: number;
  title: string;
  info: string;
  image: string;
};

const contents: Tabs[] = [
  {
    id: 0,
    title: "We make the market efficent",
    info: "More negotiation means more deals. Deals that previously would not have happened. We give you the freedom to choose if you want them.",
    image: "/assets/images/host-welcome/1.avif",
  },
  {
    id: 1,
    title: "We are creating new deals",
    info: "By being on Tramona you have the freedom to do accept deals that work for you. ",
    image: "/assets/images/host-welcome/2.jpg",
  },
  {
    id: 2,
    title: "We increase your month-over-month revenue",
    info: "Customers are often swayed to book a trip when presented with a good deal. Deals increase the likelihood of bookings - which means more money for you!",
    image: "/assets/images/host-welcome/3.avif",
  },
];

export default function HostWelcome() {
  // State to track selected tab and image opacity
  const [tab, setTab] = useState<number>(0);
  const [imageOpacity, setImageOpacity] = useState<number>(1);

  // Filter the selected content based on the tab
  const selectedContent = contents.find((content) => content.id === tab);

  // Handle tab change with fade transition
  const handleTabChange = (content: Tabs) => {
    // Set image opacity to 0 to start the fade-out transition
    setImageOpacity(0);

    // Delay the tab change to allow time for the fade-out transition
    setTimeout(() => {
      // Update the tab
      setTab(content.id);
    }, 250); // Adjust the timeout based on your transition duration
    setTimeout(() => {
      setImageOpacity(1);
    }, 500);
  };

  return (
    <MainLayout>
      {/** Welcome */}
      <main>
        <div className="h-full w-screen bg-[#3843D0]">
          <div className="container flex flex-col  space-y-12 px-16 py-20 text-white md:space-y-14 md:px-32 lg:px-40 xl:px-52">
            <div className="space-y-4">
              <h3 className="md:text-md text-sm font-bold lg:text-lg">
                TRAMONA HOST
              </h3>
              <h1 className="text-4xl font-extrabold md:text-5xl lg:text-7xl">
                {" "}
                Welcome Hosts!
              </h1>
            </div>

            <div className="relative">
              <div className="rounded-md bg-white px-10 py-16 text-2xl font-bold text-[#3843D0] md:px-16 md:text-3xl lg:px-16 lg:text-4xl xl:px-28">
                Tramona is a travel service built specifically to decrease your
                vacancies
              </div>
              <Image
                src="/assets/images/star.png"
                width={100}
                height={100}
                alt={"Star"}
                className="absolute -right-10 -top-10 max-md:h-20 max-md:w-20 md:-right-12 md:-top-12 "
              />
            </div>
          </div>
        </div>
      </main>

      {/** How */}
      <main>
        <div className="flex w-screen flex-col items-center p-10">
          <h1 className="py-10 text-4xl font-bold text-[#2563EB] md:p-20 md:text-5xl lg:text-7xl">
            <p>How It Works</p>
          </h1>
          <div>
            <div className="flex flex-col items-center space-x-0 rounded-md border-2 border-[#818CF8] bg-[#F9FAFB] p-8 font-semibold text-[#2563EB] md:flex-row md:space-x-10 md:p-16">
              <div className="text-7xl font-extrabold sm:text-8xl lg:text-9xl">
                1
              </div>
              <p className="pt-2 text-lg sm:text-2xl md:pt-0 lg:text-3xl">
                Travelers come to us and tell us how much they want to spend and
                where they want to go
              </p>
            </div>

            <div className="flex flex-col items-center space-x-0 rounded-md border-2 border-[#F472B6] bg-[#FBCFE8] p-8 text-3xl font-semibold text-[#9D174D] md:flex-row md:space-x-10 md:p-16">
              <div className="text-7xl font-extrabold sm:text-8xl lg:text-9xl">
                2
              </div>

              <p className="pt-2 text-xl sm:text-2xl md:pt-0 lg:text-3xl">
                In your host dashboard, you can see requests of people wanting
                to travel in your area
              </p>
            </div>

            <div className="flex flex-col items-center space-x-0 rounded-md border-2 border-[#60A5FA] bg-[#BFDBFE] p-8 text-3xl font-semibold text-[#1E40AF] md:flex-row md:space-x-10 md:p-16">
              <div className="text-7xl font-extrabold sm:text-8xl lg:text-9xl">
                3
              </div>
              <p className="pt-2 text-xl sm:text-2xl md:pt-0 lg:text-3xl">
                You can then respond to that traveler and accept, deny, or
                counter their request.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/** Grow */}
      <main>
        <div className="w-screen bg-[#C4B5FD] px-10 py-20 md:h-fit md:py-40">
          <div className="container flex flex-col items-center pt-5 sm:pt-0 lg:flex-row">
            <div className="space-y-5 lg:w-[33rem]">
              <h3 className="text-md font-semibold sm:text-xl">
                GROW WITH TRAMONA
              </h3>
              <p className="text-2xl font-bold md:text-4xl">
                Just like that you now have{" "}
                <span className="bg-[#FCD34D]"> less vacancies. </span>
                Increasing your month over month profit
              </p>
              <div className="text-lg font-bold underline underline-offset-2">
                Learn more
              </div>
            </div>
            <Image
              src="/assets/images/sqwiggly.png"
              width={4000}
              height={4000}
              alt={"sqwiggle"}
              className="hidden w-4/12 p-10 lg:block xl:p-20"
            />
            <div className="flex w-4/12 justify-center pt-10 md:pt-0">
              <Button
                variant="outline"
                className=" border border-black  bg-black px-20 py-7 text-sm font-bold text-white transition duration-300 ease-in-out md:text-2xl"
              >
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/** Help */}
      <main>
        <div className="flex w-screen flex-row p-5 pb-10 sm:p-10 md:h-fit md:py-32 lg:h-[70vh]">
          <div className="container flex flex-col items-center space-y-5 lg:flex-row">
            <div className="pt-10 sm:pt-0 lg:pr-24">
              <div className="space-y-5">
                <h3 className="text-md font-semibold sm:text-xl">
                  WE WANT TO HELP YOU WIN
                </h3>
                <p className="text-2xl font-bold md:text-4xl">
                  At Tramona we take a{" "}
                  <span className="bg-[#C4B5FD]">host first approach.</span> Our
                  goal is to make sure your property is always booked.
                </p>
                <div className="text-lg font-bold underline underline-offset-2">
                  Learn more
                </div>
              </div>
            </div>

            {/* <div className=" h-full w-full rounded-md border-4 border-[#D9D9D9] bg-[#D9D9D9] pl-24 lg:visible lg:h-full lg:max-h-96 lg:w-4/6"></div> */}

            <Image
              src="/assets/images/host-welcome/4.avif"
              width={4000}
              height={4000}
              alt="Picture of the author"
              className=" h-full w-full rounded-xl object-cover  lg:visible  lg:max-h-96"
              // onTransitionEnd={handleImageTransitionEnd}
            />
          </div>
        </div>
      </main>

      {/** Social Feed */}
      <main>
        <div className="  bg-[#EC4899] text-white sm:p-16 ">
          <div className="container flex h-fit flex-row p-5 text-white sm:p-0 md:space-x-5 md:py-24 lg:space-x-20 lg:p-10">
            <div className=" flex flex-col  items-center space-y-5 py-10 md:w-5/12 md:justify-center md:space-y-10 lg:w-1/2">
              <h3 className="w-full text-xl font-semibold">SOCIAL FEED</h3>
              <p className="text-3xl font-bold lg:text-4xl xl:self-start">
                Share & Discover Other Amazing Deals with Our Social Feed
              </p>

              <div className="md:hidden">
                <FeedLanding />
              </div>

              <div className="md:self-start">
                <Button
                  variant="outline"
                  className=" border bg-[#2563EB] px-16 py-7 text-lg font-bold text-white transition duration-300 ease-in-out md:text-xl lg:px-20 lg:py-7"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="hidden md:block md:w-7/12 lg:w-1/2">
              <FeedLanding />
            </div>
          </div>
        </div>
      </main>

      {/** Why */}
      <main className="h-fit bg-[#BFDBFE] ">
        <div className="container h-fit space-y-5 py-10 md:space-y-10 md:py-20 ">
          <h1 className="flex justify-center text-3xl font-bold sm:text-4xl md:text-5xl">
            Why Tramona works
          </h1>
          {/* Tabs section */}
          <div className="hidden space-y-10 md:block ">
            {/* Image section */}
            <div className="flex h-[50vh]  w-full justify-center">
              {/* Image with fade transition */}
              {selectedContent && (
                <Image
                  src={selectedContent.image}
                  width={4000}
                  height={4000}
                  alt="Picture of the author"
                  style={{ opacity: imageOpacity }}
                  className="rounded-xl object-cover transition-opacity duration-300"
                  // onTransitionEnd={handleImageTransitionEnd}
                />
              )}
            </div>

            <div className="flex-row-3 flex space-x-10 lg:space-x-32">
              {contents.map((content) => (
                <div
                  className="w-1/3 md:space-y-16 lg:space-y-20 xl:space-y-10"
                  key={content.id}
                  onClick={() => handleTabChange(content)}
                >
                  <div className="space-y-10 lg:space-y-5">
                    <h1
                      className={cn(
                        "rounded-md border-4 transition-colors duration-500",
                        content.id === tab
                          ? "border-black "
                          : "border-[#BFDBFE] ",
                      )}
                    />
                    <h1
                      className={cn(
                        "h-20 text-2xl font-bold transition-colors duration-1000 lg:text-3xl",
                        content.id === tab ? "text-black" : "text-black/20",
                      )}
                    >
                      {content.title}
                    </h1>
                  </div>

                  <p
                    className={cn(
                      "text-lg transition-colors duration-1000 lg:text-xl",
                      content.id === tab ? " text-black" : "text-black/20",
                    )}
                  >
                    {content.info}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Carousel
            className="w-full md:hidden"
            plugins={[
              Autoplay({
                delay: 2000,
              } as AutoplayOptionsType),
            ]}
          >
            <CarouselContent>
              {contents.map((content) => (
                <CarouselItem key={content.id} className="space-y-5">
                  <Image
                    src={content.image}
                    width={4000}
                    height={4000}
                    alt="Picture of the author"
                    style={{ opacity: imageOpacity }}
                    className="h-[35vh] rounded-xl object-cover transition-opacity duration-300"
                    // onTransitionEnd={handleImageTransitionEnd}
                  />

                  <div
                    className="text-black"
                    key={content.id}
                    onClick={() => handleTabChange(content)}
                  >
                    <div className="space-y-8 ">
                      <h1 className="rounded-md border-2 border-black transition-colors duration-500" />
                      <h1 className="h-20 text-2xl font-bold transition-colors duration-1000 lg:text-4xl">
                        {content.title}
                      </h1>
                    </div>

                    <p className="text-lg  transition-colors duration-1000 ">
                      {content.info}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </main>

      {/** Invite */}
      <main>
        <div className="container flex flex-col items-center space-y-5 px-7 py-20 md:space-y-10 md:py-40">
          <h1 className="text-center text-2xl font-bold md:text-4xl">
            We&apos;re currently working with Thousands of hosts
          </h1>
          <h2 className="font-medium md:text-3xl">
            Think someone new might be interest?
          </h2>
          <Button
            variant="outline"
            className=" border bg-[#2563EB] px-12 py-7 text-lg font-bold text-white transition duration-300 ease-in-out md:text-2xl"
          >
            Invite your friends
          </Button>
        </div>
      </main>
    </MainLayout>
  );
}
