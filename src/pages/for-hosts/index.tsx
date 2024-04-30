import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import SqwiggleIcon from "@/components/_icons/SqwiggleIcon";
import { liveFeedOffers } from "@/components/offer-card/data";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import React from "react";

import MainLayout from "@/components/_common/Layout/MainLayout";
import { cn } from "@/utils/utils";
import Autoplay from "embla-carousel-autoplay";
import HowItWorks from "@/components/_common/HowItWorks";

const DamageProtection = () => {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col-reverse items-center md:flex-row">
        <div className="flex-1 space-y-6 p-6 text-center md:mr-8 md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Damage Protection for Hosts
          </h2>
          <p className="text-lg text-gray-700 sm:text-xl">
            Discovering damages can be stressful, and your peace of mind is
            our top priority. That's why we have partnered with Superhog to
            provide all our hosts/property managers with damage protection up
            to $50,000.
          </p>
          <p className="text-lg text-gray-700 sm:text-xl">
            Our collaboration with Superhog ensures a seamless experience for
            you. They specialize in handling incidents and will take charge of
            the process from here.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-auto">
            <Image
              src="/assets/images/landing-page/damage_protection.jpeg"
              alt=""
              width={384}
              height={300}
              unoptimized
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
  
};

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

function IntroSection() {
  return (
    <div className="[&>*]:flex [&>*]:min-h-[calc(100vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:sm:px-16">
      <section className="relative bg-white">
        <div className="flex flex-col-reverse items-center lg:flex-row lg:space-x-10 xl:space-x-20">
          <div className="max-w-xl space-y-5 lg:space-y-10">
            <h1 className="font-semibold">TRAMONA HOST</h1>
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome Hosts!
            </h2>
            <p className="text-lg tracking-tight sm:text-2xl">
              Tramona is a travel service built specifically to decrease your
              vacancies and increase your month-over-month profit.
            </p>
            <Link
              href="host/onboarding"
              className={buttonVariants({ variant: "darkPrimary", size: "lg" })}
            >
              Sign Up Now
            </Link>
          </div>
          <div className="py-10 md:py-5">
            <Image
              src={"/assets/images/host-welcome/4.avif"}
              width={500}
              height={500}
              alt=""
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HostWelcome() {
  // State to track selected tab and image opacity
  const [tab, setTab] = useState<number>(0);
  const [imageOpacity, setImageOpacity] = useState<number>(1);
  const [api, setApi] = React.useState<CarouselApi>();

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

  // Offers with discount greater than 25%
  const selectedOffers = liveFeedOffers.filter(
    (offer) => offer.discountPercent > 25,
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setTab(api.selectedScrollSnap());

    api.on("select", () => {
      setTab(api.selectedScrollSnap());
    });
  }, [api]);
  const steps = [
    {
      number: "1",
      title: "Travelers Make an Offer on Your Property",
      description:
        "Travelers send you offers for properties that you host on Tramona.",
    },
    {
      number: "2",
      title: "Travelers Send City Requests",
      description:
        "Travelers come to us and tell us how much they want to spend and where they want to go.",
    },
    {
      number: "3",
      title: "Respond to Offers & Requests",
      description:
        "You can then respond to that traveler and accept, deny, or counter their request or offer.",
    },
  ];

  return (
    <MainLayout>
      <Head>
        <title>Hosts | Tramona</title>
      </Head>

      <div className="">
        <IntroSection />
      </div>

      <div className="">
        <HowItWorks steps={steps} title="Hosting with Tramona" />
      </div>

      <DamageProtection />

      <hr className="mt-24 mx-24 mb-12 h-px border-0 bg-neutral-300"></hr>

      {/** Why */}
      <div className="bg-white">
        <div className="container h-fit space-y-5 py-10 md:py-20 ">
          <h1 className="flex justify-center text-3xl font-bold sm:text-4xl md:text-5xl">
            Why Tramona works
          </h1>
          {/* Tabs section */}
          <div className="hidden md:block ">
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

            <div className="flex">
              {contents.map((content) => (
                <button
                  className="flex w-1/3 flex-col items-center gap-5 space-y-10 p-10 xl:space-y-0  "
                  key={content.id}
                  onClick={() => handleTabChange(content)}
                >
                  <div className="space-y-10 md:space-y-5">
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
                </button>
              ))}
            </div>
          </div>

          <Carousel
            setApi={setApi}
            className="w-full md:hidden"
            plugins={[
              Autoplay({
                delay: 2500,
                stopOnInteraction: true,
              }),
            ]}
          >
            <CarouselContent>
              {contents.map((content) => (
                <CarouselItem key={content.id}>
                  <Image
                    src={content.image}
                    width={4000}
                    height={4000}
                    alt="Picture of the author"
                    style={{ opacity: imageOpacity }}
                    className="h-[35vh] rounded-t-xl object-cover transition-opacity duration-300"
                    // onTransitionEnd={handleImageTransitionEnd}
                  />
                  <div
                    className={cn(
                      "itmes-center flex h-fit flex-col gap-5 rounded-b-xl p-10 text-left transition-colors duration-1000",
                      content.id === tab
                        ? "bg-[#EC4899] text-white"
                        : "text-black",
                    )}
                    key={content.id}
                    onChange={() => handleTabChange(content)}
                  >
                    <h1 className="text-xl font-bold ">{content.title}</h1>
                    <p className="text-md md:text-2xl">{content.info}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/** Invite */}
        <div>
          <div className="container flex flex-col items-center space-y-5 px-7 py-20 md:space-y-10 md:py-40">
            <h1 className="text-center text-2xl font-bold md:text-4xl">
              We&apos;re currently working with thousands of hosts
            </h1>
            <h2 className="font-medium md:text-3xl">
              Think someone new might be interested?
            </h2>
            <Link
              href="/profile"
              className={cn(
                buttonVariants({ variant: "darkPrimary", size: "lg" }),
                "px-12 py-7 text-lg bg-[#004236] font-bold transition duration-300 md:text-2xl",
              )}
            >
              Invite your friends
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
