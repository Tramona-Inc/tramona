import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MapPinIcon,
  CalendarIcon,
  Users2Icon,
  DollarSignIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LandingSearchBar() {
  const [activeTab, setActiveTab] = useState("search");

  const form = useForm({
    defaultValues: {
      destination: "",
      dates: "",
      price: "",
      guests: "",
    },
  });

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
      <div className="mb-4 flex">
        <button
          className={`flex-1 py-2 ${activeTab === "search" ? "border-b-2 border-teal-700 font-semibold text-teal-700" : "text-gray-500"}`}
          onClick={() => setActiveTab("search")}
        >
          Search Deals
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === "name" ? "border-b-2 border-teal-700 font-semibold text-teal-700" : "text-gray-500"}`}
          onClick={() => setActiveTab("name")}
        >
          Name Your Own Price
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="flex items-center justify-between rounded-full border border-black bg-white p-2">
              <div className="mx-2 flex w-64 items-center">
                <MapPinIcon className="mr-2 text-gray-400" />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your destination"
                          className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="h-8 w-px bg-gray-300" />

              <div className="flex w-48 items-center px-4">
                <CalendarIcon className="mr-2 text-gray-400" />
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Select dates"
                          className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {activeTab === "name" && (
                <>
                  <div className="h-8 w-px bg-gray-300" />
                  <div className="flex w-48 items-center px-4">
                    <DollarSignIcon className="mr-2 text-gray-400" />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Name your price"
                              className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <div className="h-8 w-px bg-gray-300" />

              <div className="flex w-48 items-center px-4">
                <Users2Icon className="mr-2 text-gray-400" />
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Add guests"
                          className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="rounded-full bg-teal-700 text-white"
              >
                Find Deals
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="mb-4 flex justify-center gap-8 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-teal-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          Flexible Cancelation Policies
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-teal-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          Same properties you see on Airbnb
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-teal-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          Best Prices
        </div>
      </div>
      <div className="text-center text-sm text-gray-600">
        Search the best deals available{" "}
        <span className="text-teal-700 underline">anywhere</span> on short term
        rentals right now
      </div>
    </div>
  );
}
