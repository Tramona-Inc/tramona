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
        "With close to 10 million properties on Airbnb its hard to get people to find my property. Tramona gives me an equal chance to get my property in front of travelers",
      author: "Cathy W.",
      age: "25",
    },
    {
      quote:
        "Tramona has significantly increased my bookings. The platform's user-friendly interface makes it easy for travelers to discover my property.",
      author: "Michael S.",
      age: "25",
    },
    {
      quote:
        "As a new host, I was struggling to get visibility. Tramona leveled the playing field and helped me compete with established properties.",
      author: "Emma L.",
      age: "25",
    },
    {
      quote:
        "The analytics provided by Tramona have been invaluable in optimizing my listing and pricing strategy.",
      author: "David R.",
      age: "25",
    },
    {
      quote:
        "I appreciate how Tramona focuses on showcasing unique aspects of each property, helping mine stand out in a crowded market.",
      author: "Sophie T.",
      age: "25",
    },
    {
      quote:
        "The customer support team at Tramona is exceptional. They've been incredibly helpful in maximizing my property's potential.",
      author: "James B.",
      age: "25",
    },
    {
      quote:
        "Tramona's marketing tools have helped me reach a wider audience and attract guests I wouldn't have found otherwise.",
      author: "Olivia M.",
      age: "25",
    },
    {
      quote:
        "The seamless booking process on Tramona has reduced my administrative workload, allowing me to focus on providing great experiences for my guests.",
      author: "Daniel K.",
      age: "25",
    },
    {
      quote:
        "As an international host, I love how Tramona caters to a global audience, bringing diverse travelers to my doorstep.",
      author: "Yuki H.",
      age: "25",
    },
    {
      quote:
        "Tramona's commitment to fair visibility has been a game-changer for my small, unique property in a competitive urban market.",
      author: "Alexandra P.",
      age: "25",
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
              className="pl-4 transition-opacity duration-300 md:basis-1/2 lg:basis-1/4"
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
                      <QuoteIcon fill="teal" className="text-teal-700"/>
                    </div>
                    <blockquote className="mb-4 flex-grow text-sm font-medium overflow-y-auto">
                      {testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center rounded-full mt-auto">
                      <div className="mr-2 flex-shrink-0">
                        <UserAvatar size={"sm"} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate">
                          {testimonial.author}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          Traveler • {testimonial.age} years old
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