import { LucideChevronRightCircle, LucideListFilter } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const cities: string[] = [
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 100;
      console.log(scrollContainerRef.current);
    }
  };

  return (
    <div className="grid grid-cols-10 items-center gap-5">
      <div className="col-span-8">
        <ScrollArea
          ref={scrollContainerRef}
          className="whitespace-nowrap rounded-md"
        >
          <div className="flex space-x-4 p-4">
            {cities.map((city, index) => {
              return <div key={index}>{city}</div>;
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <Button
        variant={"ghost"}
        size={"sm"}
        onClick={scrollRight}
        className="text-muted-foreground transition-all duration-300 hover:text-primary"
      >
        <LucideChevronRightCircle strokeWidth={1} size={30} />
      </Button>

      <Button
        variant={"outlineLight"}
        className="border-[1px] p-3 py-6 font-bold"
      >
        <LucideListFilter />
        Filter
      </Button>
    </div>
  );
}
