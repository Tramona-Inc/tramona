import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type CityRequestForm } from "./useCityRequestForm";
import {
  AirVentIcon,
  LampDeskIcon,
  UtensilsIcon,
  WavesIcon,
  WifiIcon,
} from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { ToggleGroupInput } from "@/components/_common/ToggleGroupInput";
import {
  ALL_REQUESTABLE_AMENITIES,
  type RequestableAmenity,
} from "@/server/db/schema";
import { cn } from "@/utils/utils";
import { HotTubIcon } from "@/components/_icons/HotTubIcon";
import { Total } from "@/components/_common/Total";

export function CityRequestFiltersDialog({
  form,
  children,
}: {
  form: CityRequestForm;
  children: React.ReactNode;
}) {
  const { note } = form.watch();
  const noteLength = note?.length ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle>Additional filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2 *:flex-1 md:flex-row">
            <FormField
              control={form.control}
              name="minNumBeds"
              render={({ field }) => (
                <FormItem className="rounded-md border pl-2">
                  <FormControl>
                    <Total
                      name="Beds"
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minNumBedrooms"
              render={({ field }) => (
                <FormItem className="rounded-md border pl-2">
                  <FormControl>
                    <Total
                      name="Bedrooms"
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minNumBathrooms"
              render={({ field }) => (
                <FormItem className="rounded-md border pl-2">
                  <FormControl>
                    <Total
                      name="Bathrooms"
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <ToggleGroupInput
                    {...field}
                    options={ALL_REQUESTABLE_AMENITIES}
                    renderToggleBtn={({ option, onClick, selected }) => {
                      const Icon = getAmenityIcon(option);
                      return (
                        <button
                          onClick={onClick}
                          className={cn(
                            "flex h-10 items-center justify-center gap-4 rounded-md border px-3 text-sm font-semibold",
                            selected
                              ? "border-primaryGreen bg-primaryGreen-background"
                              : "hover:bg-zinc-100",
                          )}
                        >
                          <Icon className="size-5 shrink-0" />
                          {option}
                        </button>
                      );
                    }}
                    renderToggleBtns={({ toggleBtns }) => (
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {toggleBtns}
                      </div>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <div className="flex justify-between">
                  <FormLabel>Additional notes</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {noteLength}/100
                  </p>
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-y"
                    rows={2}
                    maxLength={100}
                    placeholder="Enter your additional notes here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getAmenityIcon(amenity: RequestableAmenity) {
  switch (amenity) {
    case "Pool":
      return WavesIcon;
    case "Hot tub":
      return HotTubIcon;
    case "A/C":
      return AirVentIcon;
    case "Dedicated workspace":
      return LampDeskIcon;
    case "Kitchen":
      return UtensilsIcon;
    case "Wifi":
      return WifiIcon;
  }
}
