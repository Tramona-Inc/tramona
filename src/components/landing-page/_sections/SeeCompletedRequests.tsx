import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "./testimonials/testimonials-data";

const CARD_WIDTH = 300; // Width of each card in pixels
const CARD_MARGIN = 16; // Margin between cards
const SCROLL_SPEED = 0.5; // Pixels to move per frame

export function TestimonialCarousel() {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = () => {
      setOffset(
        (prevOffset) =>
          (prevOffset + SCROLL_SPEED) % (CARD_WIDTH + CARD_MARGIN),
      );
    };

    const animationId = setInterval(animate, 16); // ~60fps
    return () => clearInterval(animationId);
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div className="relative" style={{ height: "200px" }}>
        {testimonials.map((testimonial, index) => {
          const totalWidth = testimonials.length * (CARD_WIDTH + CARD_MARGIN);
          const adjustedOffset =
            (index * (CARD_WIDTH + CARD_MARGIN) - offset + totalWidth) %
            totalWidth;

          return (
            <Card
              key={index}
              className="absolute top-0 transition-opacity duration-300"
              style={{
                width: `${CARD_WIDTH}px`,
                left: `${adjustedOffset}px`,
                opacity:
                  adjustedOffset > CARD_WIDTH / 2 &&
                  adjustedOffset <
                    (containerRef.current?.clientWidth ?? 0) - CARD_WIDTH / 2
                    ? 1
                    : 0.5,
              }}
            >
              <CardContent className="flex h-[200px] flex-col justify-between p-6">
                <blockquote className="mb-4 text-sm font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <cite className="flex items-center text-xs text-gray-600">
                  <Image
                    src={testimonial.image}
                    alt=""
                    className="mr-2 h-8 w-8 rounded-full"
                  />
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
