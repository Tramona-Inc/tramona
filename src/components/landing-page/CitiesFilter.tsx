import { useCitiesFilter } from "@/utils/store/cities-filter";
import { cn } from "@/utils/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { LucideListFilter } from "lucide-react";
import PropertyFilter from "../property/PropertyFilter";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { cities } from "./cities";

export default function CitiesFilter() {
  const filter = useCitiesFilter((state) => state.filter);
  const setFilter = useCitiesFilter((state) => state.setFilter);
  const setLocationBoundingBox = useCitiesFilter(
    (state) => state.setLocationBoundingBox,
  );

  const open = useCitiesFilter((state) => state.open);
  const setOpen = useCitiesFilter((state) => state.setOpen);

  return (
    <div className="grid grid-cols-8">
      <div className="col-span-5 flex w-full items-center justify-center md:col-span-7">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full md:px-10"
        >
          <CarouselContent>
            {cities.map((city, index) => (
              <CarouselItem key={index} className={"basis-1/10"}>
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    setFilter(city);
                    setLocationBoundingBox({
                      northeastLat: 0,
                      northeastLng: 0,
                      southwestLat: 0,
                      southwestLng: 0,
                    });
                  }}
                  className={cn(
                    "text:sm px-3 py-2 font-semibold sm:text-base lg:text-lg",
                    city.id === filter?.id && "bg-zinc-300",
                  )}
                >
                  {city.label}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outlineLight"}
            className="col-span-3 ml-5 border-[1px] p-3 py-6 font-bold md:col-span-1 "
          >
            <div className="grid grid-cols-2 place-items-center gap-1 md:gap-5">
              <LucideListFilter />
              <p>Filter</p>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="flex items-center justify-center font-bold">
            Filters
          </DialogTitle>
          <PropertyFilter />
        </DialogContent>
      </Dialog>
    </div>
  );
}
