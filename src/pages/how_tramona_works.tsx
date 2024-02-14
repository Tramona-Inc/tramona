import { useState } from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import { cn } from "@/utils/utils";
import Autoplay, { type AutoplayOptionsType } from "embla-carousel-autoplay";
import React from "react";

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
    image: "/assets/images/how-tramona/mansion.png",
  },
  {
    id: 1,
    title: "We are creating new deals",
    info: "By being on Tramona you have the freedom to do accept deals that work for you. ",
    image: "/assets/images/how-tramona/scene2.avif",
  },
  {
    id: 2,
    title: "We increase your month-over-month revenue",
    info: "Customers are often swayed to book a trip when presented with a good deal. Deals increase the likelihood of bookings - which means more money for you!",
    image: "/assets/images/how-tramona/scene1.avif",
  },
];

export default function how_tramona() {
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

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setTab(api.selectedScrollSnap());

    api.on("select", () => {
      setTab(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <div className="container h-fit space-y-5 py-10 ">
        <h1 className="flex justify-center text-2xl font-bold sm:text-4xl md:text-5xl">
          How Tramona works
        </h1>
        {/* Tabs section */}
        <div className="hidden md:block ">
          {/* Image section */}
          <div className="flex h-[55vh]  w-full justify-center">
            {/* Image with fade transition */}
            {selectedContent && (
              <Image
                src={selectedContent.image}
                width={4000}
                height={4000}
                alt="Picture of the author"
                style={{ opacity: imageOpacity }}
                className="rounded-t-xl object-cover transition-opacity duration-300"
                // onTransitionEnd={handleImageTransitionEnd}
              />
            )}
          </div>

          <div className="flex ">
            {contents.map((content) => (
              <button
                className={cn(
                  "itmes-center flex w-1/3 flex-col gap-5 p-10 text-left transition-colors duration-1000",
                  content.id === tab ? "bg-[#1979E6] text-white" : "text-black",
                  content.id === 0
                    ? "rounded-bl-lg"
                    : content.id === 2
                      ? "rounded-br-lg"
                      : "rounded-none",
                )}
                key={content.id}
                onClick={() => handleTabChange(content)}
              >
                <h1 className="min-h-[60px] text-2xl font-bold">
                  {content.title}
                </h1>
                <p>{content.info}</p>
              </button>
            ))}
          </div>
        </div>

        <Carousel
          setApi={setApi}
          className="w-full md:hidden"
          plugins={[
            Autoplay({
              delay: 5000,
            } as AutoplayOptionsType),
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
                      ? "bg-[#1979E6] text-white"
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
    </>
  );
}
