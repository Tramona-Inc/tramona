import {
  type CitiesLatLong,
  useCitiesFilter,
} from "@/utils/store/cities-filter";
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

export const cities: CitiesLatLong[] = [
  { id: "all", label: "All", long: 0, lat: 0 },
  {
    id: "los_angeles",
    label: "Los Angeles",
    long: -118.3806008,
    lat: 34.1010307,
  },
  {
    id: "san_diego",
    label: "San Diego",
    long: -117.1611,
    lat: 32.7157,
  },
  {
    id: "nashville",
    label: "Nashville",
    long: -86.7816,
    lat: 36.1627,
  },
  { id: "orlando", label: "Orlando", long: -81.3792, lat: 28.5383 },
  {
    id: "washington_dc",
    label: "Washington DC",
    long: -77.0369,
    lat: 38.9072,
  },
  { id: "seattle", label: "Seattle", long: -122.3321, lat: 47.6062 },
  { id: "atlanta", label: "Atlanta", long: -84.388, lat: 33.749 },
  { id: "austin", label: "Austin", long: -97.7431, lat: 30.2672 },
  { id: "miami", label: "Miami", long: -80.1917902, lat: 25.7616798 },
  {
    id: "palm_springs_area",
    label: "Palm Springs Area",
    long: -116.5453,
    lat: 33.8303,
  },
  { id: "las vegas", label: "Las Vegas", long: -115.1398, lat: 36.1699 },
  { id: "sf", label: "San francisco", long: -122.4194, lat: 37.7749 },
  { id: "boston", label: "Boston", long: -71.0589, lat: 42.3601 },
];

export default function CitiesFilter() {
  const filter = useCitiesFilter((state) => state.filter);
  const setFilter = useCitiesFilter((state) => state.setFilter);

  const open = useCitiesFilter((state) => state.open);
  const setOpen = useCitiesFilter((state) => state.setOpen);

  console.log(filter);

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
                  className={cn(
                    city.id === filter.id && "font-bold",
                    "p-1 text-lg",
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
