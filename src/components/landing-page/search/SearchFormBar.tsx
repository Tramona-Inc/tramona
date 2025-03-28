// SearchFormBar.tsx
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CalendarDays, Users } from "lucide-react";
import SingleDateInput from "@/components/_common/SingleDateInput";
import GuestInput from "@/components/_common/GuestInput";
import type { UseFormReturn } from "react-hook-form";
import { locations } from "./locations";
import { SearchFormValues } from "./schemas";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";

interface SearchFormBarProps {
  form: UseFormReturn<SearchFormValues, unknown, SearchFormValues>; // Added unknown as the second type parameter
  onSubmit: (values: SearchFormValues) => Promise<void> | void;
  isCompact?: boolean;
  variant?: "default" | "modal";
}

export function SearchFormBar({
  form,
  onSubmit,
  isCompact = false,
  variant = "default",
}: SearchFormBarProps) {
  const checkInDate = form.watch("checkIn");
  const checkOutDate = form.watch("checkOut");
  const numGuests = form.watch("numGuests");
  const { isSearching } = useAdjustedProperties();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(isSearching);
    e.preventDefault();
    const values = form.getValues();
    let hasError = false;

    // Clear all previous errors first
    form.clearErrors();

    if (!values.location) {
      form.setError("location", { message: "Please select a destination" });
      hasError = true;
    }
    if (values.checkIn === undefined) {
      form.setError("checkIn", { message: "Required" });
      hasError = true;
    }
    if (values.checkOut === undefined) {
      form.setError("checkOut", { message: "Required" });
      hasError = true;
    }

    if (hasError) return;

    // Only scroll if form is valid
    window.scrollTo({
      top: 350,
      behavior: "smooth",
    });

    await onSubmit(values);
  };

  if (variant === "modal") {
    return (
      <Form {...form}>
        <div className="space-y-4">
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
                        field.value instanceof Date ? field.value : undefined
                      }
                      placeholder="Check in"
                      disablePast
                      className="w-full rounded-lg border border-gray-300 p-4 pl-10"
                      maxDate={
                        checkOutDate instanceof Date ? checkOutDate : undefined
                      }
                      popoverSide="top"
                    />
                    <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
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
                        field.value instanceof Date ? field.value : undefined
                      }
                      placeholder="Check out"
                      disablePast
                      className="w-full rounded-lg border border-gray-300 p-4 pl-10"
                      minDate={
                        checkInDate instanceof Date ? checkInDate : undefined
                      }
                      popoverSide="top"
                    />
                    <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Guests */}
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
                      value={numGuests}
                      minGuests={1}
                      maxGuests={999}
                    />
                    <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-full bg-primaryGreen py-6 text-white"
            disabled={isSearching}
            onClick={handleSubmit}
          >
            {isSearching ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <div className="flex items-center justify-center">
                <Search className="mr-2 h-5 w-5" />
                <span>Search</span>
              </div>
            )}
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex w-full justify-center">
          <div
            className={`flex w-full items-end transition-all duration-300 ease-in-out ${
              isCompact ? "mt-2 h-9" : "-mt-6 h-20"
            }`}
          >
            <div
              className={`z-50 mx-auto flex w-full items-center justify-between rounded-full border border-gray-200 bg-white drop-shadow-lg transition-all duration-300 ease-in-out ${
                isCompact ? "h-10 px-2" : "h-14 px-4"
              }`}
            >
              {/* Location */}
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isCompact ? "w-40" : "w-72"
                }`}
              >
                {/* <Search
                  className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                    isCompact ? "scale-75" : "scale-100"
                  }`}
                  size={20}
                /> */}

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-fulll">
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.clearErrors("location");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`justify-start border-0 bg-transparent transition-all duration-300 ease-in-out focus:ring-0 ${
                              isCompact ? "text-xs" : "text-base"
                            }`}
                          >
                            <Search
                              className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                                isCompact ? "scale-75" : "scale-100"
                              }`}
                              size={20}
                            />
                            <SelectValue placeholder="Search Destinations" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                          position="item-aligned"
                          sideOffset={4}
                          align="start"
                        >
                          {locations.map((location) => (
                            <SelectItem
                              key={location.name}
                              value={location.name}
                            >
                              {location.name}, {location.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="-mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mx-4 h-8 w-px bg-gray-300"></div>

              {/* Check-in */}
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isCompact ? "w-28" : "w-40"
                }`}
              >
                {/* <CalendarDays
                  className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                    isCompact ? "scale-75" : "scale-100"
                  }`}
                  size={20}
                /> */}
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SingleDateInput
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value
                              : undefined
                          }
                          variant="lpDesktopSearch"
                          placeholder="Check in"
                          disablePast
                          className={`border-0 bg-transparent transition-all duration-300 ease-in-out hover:bg-transparent focus:ring-0 ${
                            isCompact ? "text-xs" : "text-base"
                          }`}
                          maxDate={
                            checkOutDate instanceof Date
                              ? checkOutDate
                              : undefined
                          }
                          onChange={(e) => {
                            field.onChange(e);
                            form.setError("checkIn", { message: "" });
                          }}
                          icon={CalendarDays}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mx-4 h-8 w-px bg-gray-300"></div>

              {/* Check-out */}
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isCompact ? "w-28" : "w-40"
                }`}
              >
                {/* <CalendarDays
                  className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                    isCompact ? "scale-75" : "scale-100"
                  }`}
                  size={20}
                /> */}
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SingleDateInput
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value
                              : undefined
                          }
                          variant="lpDesktopSearch"
                          placeholder="Check Out"
                          disablePast
                          className={`border-0 bg-transparent transition-all duration-300 ease-in-out hover:bg-transparent focus:ring-0 ${
                            isCompact ? "text-xs" : "text-base"
                          }`}
                          minDate={
                            checkInDate instanceof Date
                              ? checkInDate
                              : undefined
                          }
                          onChange={(e) => {
                            field.onChange(e);
                            form.setError("checkOut", { message: "" });
                          }}
                          icon={CalendarDays}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mx-4 h-8 w-px bg-gray-300"></div>

              {/* Guests */}
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isCompact ? "w-28" : "w-40"
                }`}
              >
                {/* <Users
                  className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                    isCompact ? "scale-75" : "scale-100"
                  }`}
                  size={20}
                /> */}
                <FormField
                  control={form.control}
                  name="numGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <GuestInput
                          {...field}
                          variant="lpDesktopSearch"
                          placeholder="Guests"
                          className={`border-0 bg-transparent transition-all duration-300 ease-in-out hover:bg-transparent focus:ring-0 ${
                            isCompact ? "text-xs" : "text-base"
                          }`}
                          value={numGuests}
                          minGuests={1}
                          maxGuests={999}
                          icon={Users}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                className={`ml-2 aspect-square rounded-full bg-primaryGreen p-0 text-white transition-all duration-300 ease-in-out ${
                  isCompact ? "h-6 w-6" : "h-9 w-9"
                }`}
                onClick={handleSubmit}
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Search
                    className={`transition-all duration-300 ease-in-out ${
                      isCompact ? "scale-75" : "scale-100"
                    }`}
                    size={16}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
