// SearchFormBar.tsx
import React from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
import type { z } from "zod";
import { searchSchema } from "./schemas";

type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchFormBarProps {
  form: UseFormReturn<SearchFormValues>;
  onSubmit: (data: SearchFormValues) => void;
  isLoading: boolean;
  isCompact?: boolean;
  variant?: 'default' | 'modal';
}

export function SearchFormBar({
  form,
  onSubmit,
  isLoading,
  isCompact = false,
  variant = 'default',
}: SearchFormBarProps) {
  const checkInDate = form.watch("checkIn");
  const checkOutDate = form.watch("checkOut");
  const numGuests = form.watch("numGuests") ?? 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void form.handleSubmit(onSubmit)(e);
  };

  if (variant === 'modal') {
    return (
      <Form {...form}>
        <div className="space-y-4">
          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search destinations"
                      className="w-full rounded-lg border border-gray-300 p-4 pl-10"
                      {...field}
                    />
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </FormControl>
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
                      value={field.value ? new Date(field.value) : undefined}
                      placeholder="Check in"
                      disablePast
                      className="w-full rounded-lg border border-gray-300 p-4 pl-10"
                      maxDate={checkOutDate ? new Date(checkOutDate) : undefined}
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
                      value={field.value ? new Date(field.value) : undefined}
                      placeholder="Check out"
                      disablePast
                      className="w-full rounded-lg border border-gray-300 p-4 pl-10"
                      minDate={checkInDate ? new Date(checkInDate) : undefined}
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
            disabled={isLoading}
          >
            {isLoading ? (
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
            className={`flex items-end w-full transition-all duration-300 ease-in-out ${
              isCompact ? "mt-2 h-9" : "-mt-6 h-20"
            }`}
          >
            <div
              className={`z-50 mx-auto flex w-full items-center justify-between rounded-full border border-black bg-white drop-shadow-lg transition-all duration-300 ease-in-out ${
                isCompact ? "h-10 px-2" : "h-14 px-4"
              }`}
            >
              {/* Location */}
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isCompact ? "w-40" : "w-72"
                }`}
              >
                <Search
                  className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                    isCompact ? "scale-75" : "scale-100"
                  }`}
                  size={20}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`border-0 bg-transparent focus:ring-0 transition-all duration-300 ease-in-out ${
                              isCompact ? "text-xs" : "text-base"
                            }`}
                          >
                            <SelectValue placeholder="Search destinations" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          className="h-48 overflow-y-auto"
                          position="popper"
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
                <CalendarDays
                  className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                    isCompact ? "scale-75" : "scale-100"
                  }`}
                  size={20}
                />
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SingleDateInput
                          {...field}
                          value={field.value ? new Date(field.value) : undefined}
                          variant="lpDesktop"
                          placeholder="Check in"
                          disablePast
                          className={`border-0 bg-transparent hover:bg-transparent focus:ring-0 transition-all duration-300 ease-in-out ${
                            isCompact ? "text-xs" : "text-base"
                          }`}
                          maxDate={checkOutDate ? new Date(checkOutDate) : undefined}
                        />
                      </FormControl>
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
                <CalendarDays
                  className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                    isCompact ? "scale-75" : "scale-100"
                  }`}
                  size={20}
                />
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SingleDateInput
                          {...field}
                          value={field.value ? new Date(field.value) : undefined}
                          variant="lpDesktop"
                          placeholder="Check Out"
                          disablePast
                          className={`border-0 bg-transparent hover:bg-transparent focus:ring-0 transition-all duration-300 ease-in-out ${
                            isCompact ? "text-xs" : "text-base"
                          }`}
                          minDate={checkInDate ? new Date(checkInDate) : undefined}
                        />
                      </FormControl>
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
                <Users
                  className={`mr-2 text-gray-400 transition-all duration-300 ease-in-out ${
                    isCompact ? "scale-75" : "scale-100"
                  }`}
                  size={20}
                />
                <FormField
                  control={form.control}
                  name="numGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <GuestInput
                          {...field}
                          variant="lpDesktop"
                          placeholder="Guests"
                          className={`border-0 bg-transparent hover:bg-transparent focus:ring-0 transition-all duration-300 ease-in-out ${
                            isCompact ? "text-xs" : "text-base"
                          }`}
                          value={numGuests}
                          minGuests={1}
                          maxGuests={999}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                className={`ml-2 rounded-full bg-primaryGreen text-white transition-all duration-300 ease-in-out ${
                  isCompact ? "h-6 w-6 p-0" : "h-9 w-9 p-0"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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