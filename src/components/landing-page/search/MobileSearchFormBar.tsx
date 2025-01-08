import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, SearchIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFormBar } from "./SearchFormBar";
import type { UseFormReturn } from "react-hook-form";
import { type SearchFormValues } from "./schemas";
import { locations } from "./locations";

interface MobileSearchFormBarProps {
  form: UseFormReturn<SearchFormValues, unknown, SearchFormValues>;
  onSubmit: (values: SearchFormValues) => Promise<void> | void;
  isLoading: boolean;
}

export function MobileSearchFormBar({
  form,
  onSubmit,
  isLoading,
}: MobileSearchFormBarProps) {
  const [open, setOpen] = React.useState(false);
  const location = form.watch("location");
  const checkIn = form.watch("checkIn");
  const checkOut = form.watch("checkOut");
  const numGuests = form.watch("numGuests");

  const getDisplayText = () => {
    if (location) {
      return location;
    }
    return "Best prices on Airbnbs anywhere";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = form.getValues();
    await onSubmit(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full rounded-full border-2 border-gray-200 bg-white p-0 py-5 shadow-md hover:shadow-lg lg:hidden"
        >
          <div className="flex w-full items-center px-6 py-4">
            <Search className="mr-4 h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{getDisplayText()}</span>
              {(checkIn ?? checkOut ?? numGuests) && (
                <span className="-mt-1 text-xs text-gray-500">
                  {[
                    checkIn && new Date(checkIn).toLocaleDateString(),
                    checkOut && new Date(checkOut).toLocaleDateString(),
                    numGuests &&
                      `${numGuests} guest${numGuests !== 1 ? "s" : ""}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
            </div>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-y-none h-[60vh] pb-12 sm:max-w-[700px]">
        <div className="flex h-full flex-col">
          <div className="space-y-6 p-4">
            <h2 className="text-lg font-semibold">Where to?</h2>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                {/* Location Select */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-13 flex w-full items-center justify-start rounded-lg bg-gray-50 px-3">
                            <SearchIcon className="size-5 text-gray-400" />
                            <div className="flex-1">
                              <SelectValue
                                placeholder="Search destinations"
                                className="text-gray-400"
                              />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          align="center"
                          className="h-48 w-full overflow-y-auto"
                        >
                          {locations.map((location) => (
                            <SelectItem
                              key={location.name}
                              value={location.name}
                              className="w-full"
                            >
                              {location.name}, {location.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <SearchFormBar
                  form={form}
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                  variant="modal"
                />
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MobileSearchFormBar;
