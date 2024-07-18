import React from "react";
import { cn } from "@/utils/utils";
import Marquee from "src/components/_common/MarqueeVertical";
import Image from "next/image";


const completedRequests = [
  {
    location: "Malfa, SI",
    originalPrice: 148,
    tramonaPrice: 105,
    image: "/assets/images/fake-completed-requests/1L.jpg",
  },
  {
    location: "Cancun, MX",
    originalPrice: 547,
    tramonaPrice: 438,
    image: "/assets/images/fake-completed-requests/2L.jpg",
  },
  {
    location: "Mammoth, CA",
    originalPrice: 1034,
    tramonaPrice: 818,
    image: "/assets/images/fake-completed-requests/3L.jpg",
  },
  {
    location: "Kotor, ME",
    originalPrice: 164,
    tramonaPrice: 132,
    image: "/assets/images/fake-completed-requests/4L.jpg",
  },
  {
    location: "Sayulita, MX",
    originalPrice: 377,
    tramonaPrice: 202,
    image: "/assets/images/fake-completed-requests/5R.jpg",
  },
  {
    location: "Vik, IS",
    originalPrice: 656,
    tramonaPrice: 513,
    image: "/assets/images/fake-completed-requests/6R.jpg",
  },
  {
    location: "Paso Robles, CA",
    originalPrice: 208,
    tramonaPrice: 158,
    image: "/assets/images/fake-completed-requests/7R.jpg",
  },
  {
    location: "Nashville, TN",
    originalPrice: 655,
    tramonaPrice: 400,
    image: "/assets/images/fake-completed-requests/8R.jpg",
  },
];

const leftImages = completedRequests.slice(0, completedRequests.length / 2)
const rightImages = completedRequests.slice(completedRequests.length / 2)

const PropertyCard = ({ property } : any) => {
    return (
      <div className="relative w-full mb-4">
        <Image
          className="w-full h-auto rounded-lg"
          width={300}
          height={200}
          alt=""
          src={property.image}
        />
        <div className="mt-2">
          <p className="text-sm font-bold">{property.location}</p>
          <div className="flex items-center">
            <span className="text-sm font-semibold">${property.tramonaPrice}</span>
            <span className="text-sm line-through ml-2 text-gray-500">${property.originalPrice}</span>
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">{Math.round(((property.originalPrice - property.tramonaPrice) / property.originalPrice) * 100)}% off</span>
          </div>
        </div>
      </div>
    );
  };

export default function CompletedRequestsSection() {
  return (
    <div className="relative flex h-96 flex-row items-center justify-center overflow-hidden rounded-lg lg:border lg:bg-background sm:px-20 lg:shadow-xl">
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {leftImages.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
        {rightImages.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 lg:bg-gradient-to-b from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 lg:bg-gradient-to-t from-white dark:from-background"></div>
    </div>
  );
}
