import PropertyFilter from "@/components/property/PropertyFilter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilterIcon } from "lucide-react";

export function FilterPropertiesBtn() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          asChild
          variant="ghost"
          type="button"
          className="px-2 text-teal-900 hover:bg-teal-900/15"
        >
          <FilterIcon />
          More filters
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <PropertyFilter />
      </DialogContent>
    </Dialog>
  );
}
