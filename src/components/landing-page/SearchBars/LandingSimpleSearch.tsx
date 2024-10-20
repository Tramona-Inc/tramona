import React from "react";
import { MapPinIcon, CalendarIcon, UsersIcon, SearchIcon } from "lucide-react";

export function SimpleSearchBar() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between rounded-full border-2 border-gray-300 bg-white p-2 shadow-lg"
    >
      <div className="flex flex-1 items-center">
        <div className="flex items-center border-r px-4 py-2">
          <MapPinIcon className="mr-2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations"
            className="text-sm outline-none"
          />
        </div>
        <div className="flex items-center border-r px-4 py-2">
          <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Check in"
            className="w-24 text-sm outline-none"
          />
        </div>
        <div className="flex items-center border-r px-4 py-2">
          <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Check out"
            className="w-24 text-sm outline-none"
          />
        </div>
        <div className="flex items-center px-4 py-2">
          <UsersIcon className="mr-2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Add guests"
            className="w-24 text-sm outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-full bg-red-500 p-2 text-white transition duration-300 hover:bg-red-600"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
