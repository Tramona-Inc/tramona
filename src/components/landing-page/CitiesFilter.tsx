import { useCitiesFilter } from "@/utils/store/cities-filter";
import { cn } from "@/utils/utils";
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
import { useRef } from "react";

function FiltersBtn() {
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

export default function CitiesFilter() {
  const filter = useCitiesFilter((state) => state.filter);
  const setFilter = useCitiesFilter((state) => state.setFilter);

  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  // const [scrollX, setScrollX] = useState(0);

  // useEffect(() => {
  //   const el = ref.current;
  //   if (!el) return;
  //   const onScroll = () => setScrollX(el.scrollLeft);

  //   addEventListener("scroll", onScroll);

  //   return () => {
  //     removeEventListener("scroll", onScroll);
  //   };
  // }, []);

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

  return (
    <div className="relative h-12">
      <div className="absolute inset-0">
        <ScrollArea ref={ref} viewportRef={viewportRef}>
          <div className="flex gap-1 pb-2 pl-12 pr-40">
            {cities.map((city) => (
              <Button
                key={city.id}
                variant={"ghost"}
                onClick={() => setFilter(city)}
                className={cn(
                  "px-3 text-xs font-semibold sm:text-sm",
                  city.id === filter?.id && "bg-zinc-300 hover:bg-zinc-300",
                )}
              >
                {city.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="pointer-events-none relative left-0 top-0 inline-block bg-gradient-to-r from-white via-white via-50% to-transparent pr-5">
        {/* TODO: fix scrollX and only show when scrollX > somethin */}
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto rounded-full"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon />
        </Button>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 flex gap-2 bg-gradient-to-l from-white via-white via-80% to-transparent pl-4">
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto rounded-full"
          onClick={scrollRight}
        >
          <ChevronRightIcon />
        </Button>
        <FiltersBtn />
      </div>
    </div>
  );
}
