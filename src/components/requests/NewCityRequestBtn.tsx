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
        <Button variant="primary">
          <PlusIcon className="size-5 -ml-1" />
          New request
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-full flex-col items-center">
        <DialogHeader className="w-full border-b pb-2 font-bold">
          Request a deal
        </DialogHeader>
        <CityRequestFormContainer isRequestsPage />
      </DialogContent>
    </Dialog>
  );
}
