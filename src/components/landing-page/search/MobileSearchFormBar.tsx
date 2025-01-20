import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, SearchIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import { type SearchFormValues } from "./schemas";
import { locations } from "./locations";
import { CalendarDays } from "lucide-react";
import SingleDateInput from "@/components/_common/SingleDateInput";
import GuestInput from "@/components/_common/GuestInput";
import { Users } from "lucide-react";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";

interface MobileSearchFormBarProps {
  form: UseFormReturn<SearchFormValues, unknown, SearchFormValues>;
  onSubmit: (values: SearchFormValues) => Promise<void> | void;
}

export function MobileSearchFormBar({
  form,
  onSubmit,
}: MobileSearchFormBarProps) {
  const [open, setOpen] = React.useState(false);
  const location = form.watch("location");
  const checkIn = form.watch("checkIn");
  const checkOut = form.watch("checkOut");
  const numGuests = form.watch("numGuests");
  const { setIsSearching } = useAdjustedProperties();

  const getDisplayText = () => {
    return location;
  };

  const handleSubmit = async (values: SearchFormValues) => {
    setOpen(false);
    // Scroll to properties section
    window.scrollTo({
      top: 350,
      behavior: "smooth",
    });
    try {
      setIsSearching(true);
      await onSubmit(values);
    } catch (error) {
      form.setError("root", {
        message: "Something went wrong, please try again",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = form.handleSubmit(async (values) => {
    // Trigger all fields to validate if there are no errors
    await form.trigger();
    const hasErrors = Object.keys(form.formState.errors).length > 0;
    if (hasErrors) return;
    await handleSubmit(values);
  });

  const displayText = [
    checkIn && new Date(checkIn).toLocaleDateString(),
    checkOut && new Date(checkOut).toLocaleDateString(),
    numGuests && `${numGuests} guest${numGuests === 1 ? "" : "s"}`,
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full rounded-full border-2 border-gray-200 bg-white p-0 py-6 shadow-md hover:shadow-lg lg:hidden"
        >
          <div className="flex w-full items-center px-6 py-5">
            <Search className="mr-4 h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{getDisplayText()}</span>
              {displayText.length > 0 && (
                <span className="mt-0.5 text-xs text-gray-500">
                  {displayText.join(" · ")}
                </span>
              )}
            </div>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-y-none sm:max-w-[700px]">
        <div className="flex h-full flex-col gap-y-8 p-4 pb-20">
          <h2 className="text-xl font-semibold">Where to?</h2>
          <Form {...form}>
            <form
              onSubmit={handleFormSubmit}
              className="flex w-full flex-col gap-y-6"
            >
              {/* Location Select */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.clearErrors("location");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="flex h-13 w-full items-center justify-start rounded-lg bg-gray-50 px-3">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check-in */}
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <SingleDateInput
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value
                              : undefined
                          }
                          popoverSide="bottom"
                          placeholder="Check in"
                          disablePast
                          className="w-full rounded-lg border border-gray-300 p-4 pl-10"
                          maxDate={
                            checkOut instanceof Date ? checkOut : undefined
                          }
                          onChange={(e: Date | undefined) => {
                            field.onChange(e);
                            form.clearErrors("checkIn");
                          }}
                        />
                        <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check-out */}
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <SingleDateInput
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value
                              : undefined
                          }
                          popoverSide="bottom"
                          placeholder="Check out"
                          disablePast
                          className="w-full rounded-lg border border-gray-300 p-4 pl-10"
                          minDate={
                            checkIn instanceof Date ? checkIn : undefined
                          }
                          onChange={(e: Date | undefined) => {
                            field.onChange(e);
                            form.clearErrors("checkOut");
                          }}
                        />
                        <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add Guests field */}
              <FormField
                control={form.control}
                name="numGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <GuestInput
                          {...field}
                          placeholder="Guests"
                          className="w-full rounded-lg border border-gray-300 p-4 pl-10"
                          value={field.value}
                          minGuests={1}
                          maxGuests={999}
                          onChange={field.onChange}
                        />
                        <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="mt-12 flex w-full items-center justify-center rounded-full bg-primaryGreen py-6 text-white"
                disabled={false}
              >
                <Search className="mr-2 h-5 w-5" />
                <span>Search</span>
              </Button>
              <FormMessage />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MobileSearchFormBar;
