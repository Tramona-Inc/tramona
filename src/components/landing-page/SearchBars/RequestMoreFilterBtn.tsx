import RequestMoreFilter from '@/components/requests/RequestMoreFilter';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilterIcon } from "lucide-react";

export function RequestMoreFilterBtn() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          asChild
          variant="ghost"
          type="button"
          className="p-0 font-bold text-teal-900 hover:bg-transparent"
        >
          <div>
            <FilterIcon />
            More filters
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <RequestMoreFilter />
      </DialogContent>
    </Dialog>
  );
}
