import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "With close to 10 million properties on Airbnb its hard to get people to find my property. Tramana gives me an equal chance to get my property in front of travelers",
    author: "Cathy W.",
  },
  {
    quote: "Tramana has significantly increased my bookings. The platform's user-friendly interface makes it easy for travelers to discover my property.",
    author: "Michael S.",
  },
  {
    quote: "As a new host, I was struggling to get visibility. Tramana leveled the playing field and helped me compete with established properties.",
    author: "Emma L.",
  },
  {
    quote: "The analytics provided by Tramana have been invaluable in optimizing my listing and pricing strategy.",
    author: "David R.",
  },
  {
    quote: "I appreciate how Tramana focuses on showcasing unique aspects of each property, helping mine stand out in a crowded market.",
    author: "Sophie T.",
  },
  {
    quote: "The customer support team at Tramana is exceptional. They've been incredibly helpful in maximizing my property's potential.",
    author: "James B.",
  },
  {
    quote: "Tramana's marketing tools have helped me reach a wider audience and attract guests I wouldn't have found otherwise.",
    author: "Olivia M.",
  },
  {
    quote: "The seamless booking process on Tramana has reduced my administrative workload, allowing me to focus on providing great experiences for my guests.",
    author: "Daniel K.",
  },
  {
    quote: "As an international host, I love how Tramana caters to a global audience, bringing diverse travelers to my doorstep.",
    author: "Yuki H.",
  },
  {
    quote: "Tramana's commitment to fair visibility has been a game-changer for my small, unique property in a competitive urban market.",
    author: "Alexandra P.",
  },
];

const CARD_WIDTH = 300; // Width of each card in pixels
const CARD_MARGIN = 16; // Margin between cards
const SCROLL_SPEED = 0.5; // Pixels to move per frame

export function TestimonialCarousel() {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = () => {
      setOffset((prevOffset) => (prevOffset + SCROLL_SPEED) % (CARD_WIDTH + CARD_MARGIN));
    };

    const animationId = setInterval(animate, 16); // ~60fps
    return () => clearInterval(animationId);
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div className="relative" style={{ height: '200px' }}>
        {testimonials.concat(testimonials).map((testimonial, index) => {
          const totalWidth = testimonials.length * (CARD_WIDTH + CARD_MARGIN);
          const adjustedOffset = (index * (CARD_WIDTH + CARD_MARGIN) - offset + totalWidth) % totalWidth;

          return (
            <Card
              key={index}
              className="absolute top-0 transition-opacity duration-300"
              style={{
                width: `${CARD_WIDTH}px`,
                left: `${adjustedOffset}px`,
                opacity: adjustedOffset > CARD_WIDTH / 2 && adjustedOffset < containerRef.current?.clientWidth! - CARD_WIDTH / 2 ? 1 : 0.5,
              }}
            >
              <CardContent className="p-6 h-[200px] flex flex-col justify-between">
                <blockquote className="text-sm font-medium mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <cite className="text-xs text-gray-600 flex items-center">
                  <img src="/path-to-avatar.jpg" alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
                  {testimonial.author}
                </cite>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}