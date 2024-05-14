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
        <Button variant="secondary" type="button">
          <FilterIcon />
          Filter
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
