import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { PropertyCard } from "./PropertyCard";

export function PropertyGrid() {
  return (
    <div className="mb-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <PropertyCard key={i} index={i} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          className="border-[#d7d7d7] bg-white px-8 py-2 text-base font-normal"
        >
          View More
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
