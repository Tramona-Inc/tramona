import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/utils";
import { format, addDays, subDays } from "date-fns";
import { CalendarIcon, DollarSign, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";

interface FilterSidebarProps {
  location: string;
  setLocation: (location: string) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  minPrice: string;
  maxPrice: string;
  handlePriceChange: (type: "min" | "max", value: string) => void;
}

export function FilterSidebar({
  location,
  setLocation,
  date,
  setDate,
  minPrice,
  maxPrice,
  handlePriceChange,
}: FilterSidebarProps) {
  return (
    <div className="space-y-8 lg:sticky lg:top-4 lg:self-start">
      <Card className="p-4">
        <div className="space-y-8">
          {/* Location Input */}
          <div>
            <label className="mb-1 block text-sm font-medium">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Enter location"
                className="bg-white pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="mb-1 block text-sm font-medium">Dates</label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      format(date.from, "PPP")
                    ) : (
                      <span>Check-in</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.to ? format(date.to, "PPP") : <span>Check-out</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Guest Selection */}
          <div>
            <label className="mb-1 block text-sm font-medium">Guests</label>
            <Select>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Number of guests" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </SelectItem>
                ))}
                <SelectItem value="7+">7+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="bg-white pl-8"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative flex-1">
                <DollarSign className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              This is the &quot;Book it now&quot; price. You can always request
              a lower price.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full bg-[#004236] hover:bg-[#005a4b]">
              Search Properties
            </Button>
            <Button variant="outline" className="w-full">
              Make a Request
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
