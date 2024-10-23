import { useState } from "react";
import { X, Search, Calendar, Users2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import RequestCityForm from "../SearchBars/RequestCityForm";

interface MobileSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSearchDialog({
  open,
  onOpenChange,
}: MobileSearchDialogProps) {
  const [activeTab, setActiveTab] = useState<"search" | "request">("search");

  return (
    <>
      {/* Search Bar Trigger */}
      <div
        onClick={() => onOpenChange(true)}
        className="flex w-full cursor-pointer items-center rounded-full border bg-white px-4 py-3 shadow-lg md:hidden"
      >
        <Search className="mr-3 h-5 w-5 text-gray-400" />
        <span className="text-gray-500">Search or Request a deal</span>
      </div>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="h-[100dvh] gap-0 p-0">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b bg-white">
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <button onClick={() => onOpenChange(false)}>
                  <X className="h-5 w-5" />
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("search")}
                    className={cn(
                      "border-b-2 pb-2 text-sm font-medium",
                      activeTab === "search"
                        ? "border-black"
                        : "border-transparent text-gray-500",
                    )}
                  >
                    <span className={activeTab === "search" ? "font-bold" : ""}>
                      Search Properties
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("request")}
                    className={cn(
                      "border-b-2 pb-2 text-sm font-medium",
                      activeTab === "request"
                        ? "border-black"
                        : "border-transparent text-gray-500",
                    )}
                  >
                    <span
                      className={activeTab === "request" ? "font-bold" : ""}
                    >
                      Request deal
                    </span>
                  </button>
                </div>
                <div className="w-5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "search" ? (
              <div className="flex flex-col space-y-6 p-4">
                {/* Location Section */}
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Location</h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Enter your destination"
                      className="h-14 rounded-full border-gray-200 pl-12"
                    />
                  </div>
                </div>

                {/* Dates Section */}
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Dates</h3>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Select dates"
                      className="h-14 rounded-full border-gray-200 pl-12"
                    />
                  </div>
                </div>

                {/* Travelers Section */}
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Travelers</h3>
                  <div className="relative">
                    <Users2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Add guests"
                      className="h-14 rounded-full border-gray-200 pl-12"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <RequestCityForm />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-between border-t bg-white p-4">
            <Button
              variant="ghost"
              onClick={() => {
                // Clear form logic
              }}
              className="font-medium"
            >
              Clear all
            </Button>
            <Button className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
