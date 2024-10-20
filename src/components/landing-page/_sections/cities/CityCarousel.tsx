import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  type CarouselApi,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";

// Define the structure for city data
interface City {
  name: string;
  image: string;
}

// Sample city data (replace with your actual data and images)
const cities: City[] = [
  { name: "Denver", image: "/images/denver.jpg" },
  { name: "Seattle", image: "/images/seattle.jpg" },
  { name: "San Francisco", image: "/images/san-francisco.jpg" },
  { name: "Washington D.C.", image: "/images/washington-dc.jpg" },
  // Add more cities as needed
];

export function CityCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {cities.map((city, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={city.image}
                  alt={city.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{city.name}</h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white">
          <ChevronRight className="h-6 w-6" />
        </CarouselNext>
      </Carousel>
    </div>
  );
}
