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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PlusIcon className="-ml-1 size-5" />
          New request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="border-b pb-2 font-bold">
          Request a deal
        </DialogHeader>
        <CityRequestFormContainer isRequestsPage />
      </DialogContent>
    </Dialog>
  );
}
