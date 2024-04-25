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

const cities: string[] = [
  "All",
  "Westminster, United States",
  "Los Angeles, United States of America",
  "Los Angeles (LA)",
  "San Diego",
  "Orlando/Kissimmee",
  "Las Vegas",
  "Washington DC",
  "Seattle",
  "Boston",
  "Atlanta",
  "Nashville",
  "Austin",
  "Denver",
  "Portland",
  "Charleston",
  "Sedona",
  "Scottsdale",
  "Lake Tahoe",
  "Hawaii - Maui",
  "Hawaii - Kauai",
  "Aspen",
  "Outer Banks (OBX)",
  "Palm Springs Area",
  "Dallas Area",
  "Palm Coast",
  "Charlotte",
  "Zion",
  "Houston",
  "Kansas City",
  "Punta Cana",
  "Philadelphia",
  "St. Augustine",
  "Eureka Springs",
  "Boca Raton",
  "Fort Lauderdale",
  "Kitty Hawk",
  "Fairfax, VA",
  "Birmingham",
  "Bozeman",
  "Idaho",
  "Joshua Tree",
  "Oakland",
  "South San Francisco",
  "Arizona (assuming Phoenix or Tucson)",
  "Multi City",
];

export default function CitiesFilter() {
  const filter = useCitiesFilter((state) => state.filter);
  const setFilter = useCitiesFilter((state) => state.setFilter);

  const open = useCitiesFilter((state) => state.open);
  const setOpen = useCitiesFilter((state) => state.setOpen);

  return (
    <div className="grid grid-cols-8">
      <div className="col-span-5 flex w-full items-center justify-center xl:col-span-7 ">
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
                  }}
                  className={cn(city === filter && "font-bold", "p-1")}
                >
                  {city}
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
            className="col-span-3 ml-5  border-[1px] p-3 py-6 font-bold xl:col-span-1 "
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
