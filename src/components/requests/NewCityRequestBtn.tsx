import { useState } from "react";
import { Button } from "@/components/ui/button";
import CityRequestFormContainer from "../landing-page/SearchBars/CityRequestFormContainer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

export function NewCityRequestBtn() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4 rounded-md pr-3" variant="secondary">
          <PlusIcon className="-ml-1 size-5" />
          New request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="border-b pb-2 font-bold">
          Request a deal
        </DialogHeader>
        <CityRequestFormContainer />
      </DialogContent>
    </Dialog>
  );
}
