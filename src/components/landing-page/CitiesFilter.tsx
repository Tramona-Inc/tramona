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
import { useRouter } from "next/router";

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

export default function CitiesFilter({
  isLandingPage = false,
}: {
  isLandingPage?: boolean;
}) {
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

  const router = useRouter();

  return (
    <div className="sticky top-header-height z-10 h-14 border-b bg-white">
      <div className="absolute inset-2">
        <ScrollArea ref={ref} viewportRef={viewportRef}>
          <div className="flex gap-1 pb-2 pl-12 pr-40">
            {cities.map((city) => (
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
                  }
                }}
                className={cn(
                  "px-3 text-xs font-semibold sm:text-sm",
                  city.id === filter?.id && !isLandingPage
                    ? "bg-zinc-300 hover:bg-zinc-300"
                    : "text-muted-foreground",
                )}
              >
                {city.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="pointer-events-none relative left-0 top-2 inline-block bg-gradient-to-r from-white via-white via-50% to-transparent pr-5">
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
      <div className="pointer-events-none absolute right-0 top-2 flex gap-2 bg-gradient-to-l from-white via-white via-80% to-transparent pl-4">
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto rounded-full"
          onClick={scrollRight}
        >
          <ChevronRightIcon />
        </Button>
        {!isLandingPage && <FiltersBtn />}
      </div>
    </div>
  );
}
