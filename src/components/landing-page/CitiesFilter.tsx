import { useCitiesFilter } from "@/utils/store/cities-filter";
import { cn, useOverflow } from "@/utils/utils";
import { ChevronLeftIcon, ChevronRightIcon, FilterIcon } from "lucide-react";
import PropertyFilter from "../property/PropertyFilter";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cities } from "./cities";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { type RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export function FiltersBtn() {
  const open = useCitiesFilter((state) => state.open);
  const setOpen = useCitiesFilter((state) => state.setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="pointer-events-auto">
          <FilterIcon />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-bold">Filters</DialogTitle>
        </DialogHeader>
        <PropertyFilter />
      </DialogContent>
    </Dialog>
  );
}

export default function CitiesFilter({
  isLandingPage = false,
}: {
  isLandingPage?: boolean;
}) {
  const filter = useCitiesFilter((state) => state.filter);
  const setFilter = useCitiesFilter((state) => state.setFilter);
  const setLocationBoundingBox = useCitiesFilter(
    (state) => state.setLocationBoundingBox,
  );

  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const isOverflowing = useOverflow(viewportRef);

  function scrollLeft() {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  }

  function scrollRight() {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  }

  const router = useRouter();

  return (
    <div className="sticky top-header-height z-10 h-14 bg-white">
      <div className="absolute inset-2">
        <ScrollArea ref={ref} viewportRef={viewportRef}>
          <div className="flex justify-center gap-1 px-12 pb-2">
            <div className="hidden md:flex">
              {cities.map((city) => {
                if (city.id === "all" && isLandingPage) return null;
                const isSelected = city.id === filter?.id && !isLandingPage;
                return (
                  <Button
                    key={city.id}
                    variant="ghost"
                    onClick={async () => {
                      if (isLandingPage) {
                        void router.push({
                          pathname: "/explore",
                          query: { city: city.id },
                        });
                      } else {
                        setFilter(city);
                        setLocationBoundingBox({
                          northeastLat: 0,
                          northeastLng: 0,
                          southwestLat: 0,
                          southwestLng: 0,
                        });
                      }
                    }}
                    className={cn(
                      "px-3 text-xs font-bold sm:text-base",
                      isSelected
                        ? "bg-zinc-300 hover:bg-zinc-300"
                        : "text-muted-foreground",
                    )}
                  >
                    {city.label}
                  </Button>
                );
              })}
            </div>
            <div className="flex md:hidden">
              {cities.slice(0, 4).map((city) => {
                if (city.id === "all" && isLandingPage) return null;
                const isSelected = city.id === filter?.id && !isLandingPage;
                return (
                  <Button
                    key={city.id}
                    variant="ghost"
                    onClick={async () => {
                      if (isLandingPage) {
                        void router.push({
                          pathname: "/explore",
                          query: { city: city.id },
                        });
                      } else {
                        setFilter(city);
                        setLocationBoundingBox({
                          northeastLat: 0,
                          northeastLng: 0,
                          southwestLat: 0,
                          southwestLng: 0,
                        });
                      }
                    }}
                    className={cn(
                      "px-3 text-xs font-bold sm:text-base",
                      isSelected
                        ? "bg-zinc-300 hover:bg-zinc-300"
                        : "text-muted-foreground",
                    )}
                  >
                    {city.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {isOverflowing && (
        <>
          <div className="pointer-events-none relative left-0 top-2 inline-block bg-gradient-to-r from-white via-white via-50% to-transparent pr-5">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeftIcon />
            </Button>
          </div>
          <div className="pointer-events-none absolute right-0 top-2 flex gap-2 bg-gradient-to-l from-white via-white via-80% to-transparent pl-4">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto rounded-full"
              onClick={scrollRight}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
