import React from "react";
import { cn } from "@/utils/utils";
import Marquee from "src/components/_common/MarqueeVertical";
import Image from "next/image";
import first from "public/assets/images/fake-completed-requests/1L.jpg";
import second from "public/assets/images/fake-completed-requests/2L.jpg";
import third from "public/assets/images/fake-completed-requests/3L.jpg";
import fourth from "public/assets/images/fake-completed-requests/4L.jpg";
import fifth from "public/assets/images/fake-completed-requests/5R.jpg";
import sixth from "public/assets/images/fake-completed-requests/6R.jpg";
import seventh from "public/assets/images/fake-completed-requests/7R.jpg";
import eighth from "public/assets/images/fake-completed-requests/8R.jpg";

const leftImages = [first, second, third, fourth];
const rightImages = [fifth, sixth, seventh, eighth];

const PreviousRequestCard = ({ img }: { img: any }) => {
  return (
    <figure
      className={cn(
        "relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="relative w-[85%] flex-grow">
          <Image
            className="h-full w-full object-contain"
            width={36}
            height={32}
            alt=""
            src={img}
          />
        </div>
        <div className="flex h-[15%] items-center">hello</div>
      </div>
    </figure>
  );
};

export default function CompletedRequestsSection() {
  return (
    <div className="relative flex h-96 flex-row items-center justify-center overflow-hidden rounded-lg border bg-background sm:px-20 md:shadow-xl">
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {leftImages.map((img, index) => (
          <PreviousRequestCard key={index} img={img} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
        {rightImages.map((img, index) => (
          <PreviousRequestCard key={index} img={img} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white dark:from-background"></div>
    </div>
  );
}