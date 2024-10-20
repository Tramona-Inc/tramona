import { useState } from "react";
import {
  MapPinIcon,
  CalendarIcon,
  Users2Icon,
  DollarSignIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingSearchBar() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-lg">
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
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-full border px-4 py-2">
          <MapPinIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Enter your destination"
            className="w-full outline-none"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-full border px-4 py-2">
          <CalendarIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Select dates"
            className="w-full outline-none"
          />
        </div>
        {activeTab === "name" && (
          <div className="flex flex-1 items-center gap-2 rounded-full border px-4 py-2">
            <DollarSignIcon className="text-gray-400" />
            <input
              type="text"
              placeholder="Name your price"
              className="w-full outline-none"
            />
          </div>
        )}
        <div className="flex flex-1 items-center gap-2 rounded-full border px-4 py-2">
          <Users2Icon className="text-gray-400" />
          <input
            type="text"
            placeholder="Add guests"
            className="w-full outline-none"
          />
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <Button className="rounded-full bg-teal-700 px-8 py-2 text-white">
          Find Deals
        </Button>
      </div>
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
