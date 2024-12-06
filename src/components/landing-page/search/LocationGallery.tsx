import React, { useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { locations } from "./locations";

interface LocationGalleryProps {
  onLocationSelect: (location: string) => void;
  isCompact?: boolean;
}

export function LocationGallery({ 
  onLocationSelect,
  isCompact = false
}: LocationGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left"
          ? -containerRef.current.clientWidth
          : containerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="relative flex items-center max-w-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 z-10 h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-50"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>

      <div
        ref={containerRef}
        className={`flex overflow-x-scroll scrollbar-hide mr-8 transition-all duration-300 ease-in-out
          ${isCompact ? "gap-4 px-8" : "gap-6 px-10"}`}
      >
        {locations.map((location) => (
          <div
            key={location.name}
            className={`flex-shrink-0 cursor-pointer transition-all duration-300 ease-in-out
              ${isCompact ? "w-14" : "w-24"}`}
            onClick={() => onLocationSelect(location.name)}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-md">
              <Image
                src={location.image}
                alt={location.name}
                className="h-full w-full object-cover"
                fill
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                <h3 className={`font-medium leading-tight text-white
                  ${isCompact ? "text-[10px]" : "text-xs"}`}>
                  {location.name}
                </h3>
                <p className={`text-white/90 leading-tight
                  ${isCompact ? "text-[8px]" : "text-[10px]"}`}>
                  {location.country}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 z-10 h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-50"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  );
}