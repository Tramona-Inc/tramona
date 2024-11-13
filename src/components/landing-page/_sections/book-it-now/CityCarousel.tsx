import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface CityCarouselProps {
  setLocation: (city: string) => void;
}

export const cities = [
  "Las Vegas",
  "Orlando",
  "New York",
  "Los Angeles",
  "Chicago",
  "Miami",
  "San Francisco",
  "Seattle",
  "Boston",
  "Austin",
  "Denver",
  "Nashville",
  "Washington D.C.",
  "Philadelphia",
];

export function CityCarousel({ setLocation }: CityCarouselProps) {
  return (
    <div className="mx-auto mb-8 max-w-6xl">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {cities.map((city) => (
            <CarouselItem key={city} className="md:basis-1/4 lg:basis-1/6">
              <div className="p-1">
                <Card
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => setLocation(city)}
                >
                  <CardContent className="flex items-center p-4">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt={city}
                      width={60}
                      height={60}
                      className="mr-3 rounded-lg"
                    />
                    <span className="text-sm font-medium">{city}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
