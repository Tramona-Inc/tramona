import * as React from "react";
import { cn } from "@/utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState, useRef } from "react";
import { QuoteIcon } from "lucide-react";
import UserAvatar from "@/components/_common/UserAvatar";

const testimonials = [
    {
      quote:
        "Tramona has been very easy for me. All i did is sign up and now i get requests directly to my phone.",
      author: "Shawn P.",
      age: "49",
      role: "Host",
      superhost: true,
      image: "/assets/images/fake-reviews/shawnp.jpg"
    },
    {
      quote:
        "The 0 fees are really great. I like knowing the price wont double at the last second",
      author: "Bianca R.",
      age: "24",
      role: "Traveler",
      superhost: false,
      image: "/assets/images/fake-reviews/biancar.jpg"
    },
    {
      quote:
        "With close to 10 million properties on Airbnb its hard to get people to find my property, Tramona gives me an equal chance to get my property in front of travelers”",
      author: "Lamar F.",
      age: "31",
      role: "Host",
      superhost: false,
      image: "/assets/images/fake-reviews/lamarf.jpg"
    },
    {
      quote:
        "The biggest thing for me when traveling has always been price. Now i can afford properties i usually could never afford",
      author: "Susan L.",
      age: "28",
      role: "Traveler",
      superhost: false,
      image: "/assets/images/fake-reviews/susanl.jpg"
    },
    {
      quote:
        "I mean, if my property is vacant, ill always take something over nothing",
      author: "Chaz W.",
      age: "32",
      role: "Host",
      superhost: false,
      image: "/assets/images/fake-reviews/chazw.jpg"
    },
    {
      quote:
        "Tramona is very convenient, i just submit a request and wait. That’s it. Next thing i know i have 10 matches.",
      author: "Kim W.",
      age: "30",
      role: "Traveler",
      superhost: false,
      image: "/assets/images/fake-reviews/kimw.jpg"
    },
  ];
  

export function TestimonialCarousel() {
  const [api, setApi] = useState<any>();
  const [, forceUpdate] = useState({});
  const currentIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    api.on("select", () => {
      currentIndexRef.current = api.selectedScrollSnap();
      forceUpdate({}); // Force re-render
    });

    return () => {
      clearInterval(intervalId);
      api.off("select");
    };
  }, [api]);

  const getOpacity = (index: number) => {
    const totalItems = testimonials.length;
    const distance = Math.min(
      Math.abs((index % totalItems) - currentIndexRef.current),
      Math.abs((index % totalItems) - totalItems - currentIndexRef.current),
      Math.abs((index % totalItems) + totalItems - currentIndexRef.current)
    );
    if (distance === 0) return "opacity-100";
    if (distance === 1) return "opacity-45";
    return "opacity-30";
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <Carousel
        setApi={setApi}
        className="mx-auto w-full max-w-screen-2xl"
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent className="-ml-4">
          {testimonials.concat(testimonials).map((testimonial, index) => (
            <CarouselItem
              key={index}
              className="pl-4 transition-opacity duration-300 sm:basis-1/2 lg:basis-1/4"
            >
              <div className="h-[300px] w-full"> {/* Fixed size container */}
                <Card
                  className={cn(
                    "h-full w-full border-none bg-gray-100 shadow-none transition-opacity duration-300",
                    getOpacity(index)
                  )}
                >
                  <CardContent className="flex flex-col p-6 h-full">
                    <div className="mb-4">
                      <QuoteIcon style={{ fill: "#004236", color: "#004236"}} className="text-[#004236]"/>
                    </div>
                    <blockquote className="mb-4 flex-grow text-sm font-medium overflow-y-auto">
                      {testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center rounded-full mt-auto">
                      <div className="mr-2 flex-shrink-0">
                        <UserAvatar size={"sm"} image={testimonial.image}/>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate">
                          {testimonial.author}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {testimonial.role} • {testimonial.age} years old {testimonial.superhost ? "• Airbnb Superhost" : ""}
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