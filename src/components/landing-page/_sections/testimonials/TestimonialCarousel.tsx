import * as React from "react";
import { cn } from "@/utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState, useRef } from "react";
import { QuoteIcon } from "lucide-react";
import UserAvatar from "@/components/_common/UserAvatar";
import { testimonials } from "./testimonials-data";

export function TestimonialCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [, forceUpdate] = useState({});
  const currentIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    const onSelect = () => {
      currentIndexRef.current = api.selectedScrollSnap();
      forceUpdate({});
    };
    api.on("select", onSelect);

    return () => {
      clearInterval(intervalId);
      api.off("select", onSelect);
    };
  }, [api]);

  const getOpacity = (index: number) => {
    const totalItems = testimonials.length;
    const distance = Math.min(
      Math.abs((index % totalItems) - currentIndexRef.current),
      Math.abs((index % totalItems) - totalItems - currentIndexRef.current),
      Math.abs((index % totalItems) + totalItems - currentIndexRef.current),
    );
    if (distance === 0) return "opacity-100";
    if (distance === 1) return "opacity-45";
    return "opacity-30";
  };

  return (
    <div ref={containerRef} className="relative overflow-y-hidden">
      <Carousel
        setApi={setApi}
        className="mx-auto w-full max-w-full 2xl:max-w-screen-2xl"
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
          containScroll: false,
        }}
      >
        <CarouselContent className="-ml-4">
          {testimonials.concat(testimonials).map((testimonial, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 pl-4 transition-opacity duration-300"
            >
              <div className="h-[300px] w-full">
                <Card
                  className={cn(
                    "h-full w-full border-none bg-gray-100 shadow-none transition-opacity duration-300",
                    getOpacity(index),
                  )}
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4">
                      <QuoteIcon
                        style={{ fill: "#004236", color: "#004236" }}
                        className="text-[#004236]"
                      />
                    </div>
                    <blockquote className="mb-4 flex-grow overflow-y-auto text-sm font-medium">
                      {testimonial.quote}
                    </blockquote>
                    <div className="mt-auto flex items-center rounded-full">
                      <div className="mr-2 flex-shrink-0">
                        <UserAvatar size={"sm"} image={testimonial.image} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold">
                          {testimonial.author}
                        </div>
                        <div className="truncate text-xs text-gray-500">
                          {testimonial.role} • {testimonial.age} years old{" "}
                          {testimonial.superhost ? "• Airbnb Superhost" : ""}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
