"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ShoppingCart,
  Shield,
  DollarSign,
  Info,
  Clock,
  CheckCircle,
} from "lucide-react";

import ReserveBtn, {
  RequestToBookDetails,
  PropertyPageData,
} from "../actionButtons/ReserveBtn";

export default function RequestToBookOrBookNowPriceCard({
  // offer,
  property,
  requestToBook,
  acceptedAt,
}: {
  property: PropertyPageData;
  requestToBook: RequestToBookDetails;
  acceptedAt: boolean;
}) {
  const [date, setDate] = useState({
    from: new Date(2024, 10, 11),
    to: new Date(2024, 10, 14),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showBidInput, setShowBidInput] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidPercentage, setBidPercentage] = useState(5);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const basePrice = 145; // per night price
  const minDiscount = 5;
  const maxDiscount = 20;

  const presetOptions = [
    { price: 116, label: "Good Bid", percentOff: 20 },
    { price: 130, label: "Better Bid", percentOff: 10 },
    { price: 145, label: "Buy Now", percentOff: 0 },
  ];

  useEffect(() => {
    if (showBidInput) {
      const discountedPrice = Math.round(basePrice * (1 - bidPercentage / 100));
      setBidAmount(discountedPrice.toString());
    }
  }, [showBidInput, bidPercentage]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBidAmount = e.target.value;
    setBidAmount(newBidAmount);
    const newPercentage = Math.round(
      ((basePrice - parseFloat(newBidAmount)) / basePrice) * 100,
    );
    setBidPercentage(
      Math.max(minDiscount, Math.min(newPercentage, maxDiscount)),
    );
    setSelectedPreset(null);
  };

  const handleSliderChange = (value: number[]) => {
    setBidPercentage(value[0]!);
    const newBidAmount = Math.round(basePrice * (1 - value[0]! / 100));
    setBidAmount(newBidAmount.toString());
    setSelectedPreset(null);
  };

  const getBidLikelihood = () => {
    if (bidPercentage <= 10) return "Good chance of acceptance";
    if (bidPercentage <= 15) return "Moderate chance of acceptance";
    return "Lower chance of acceptance";
  };

  const handlePresetSelect = (price: number) => {
    setBidAmount(price.toString());
    const newPercentage = Math.round(((basePrice - price) / basePrice) * 100);
    setBidPercentage(
      Math.max(minDiscount, Math.min(newPercentage, maxDiscount)),
    );
    setSelectedPreset(price);
  };

  return (
    <Card className="w-full bg-gray-50 shadow-lg">
      <CardContent className="flex flex-col gap-y-2 rounded-xl p-6">
        {/* Date Picker */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button className="grid w-full grid-cols-2 overflow-hidden rounded-lg border text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <div className="border-r p-3">
                <div className="text-sm text-muted-foreground">CHECK-IN</div>
                <div className="text-base font-medium">
                  {format(date.from, "MM/dd/yyyy")}
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm text-muted-foreground">CHECKOUT</div>
                <div className="text-base font-medium">
                  {format(date.to, "MM/dd/yyyy")}
                </div>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date.from}
              selected={{ from: date.from, to: date.to }}
              onSelect={(selectedDate) => {
                if (selectedDate?.from && selectedDate?.to) {
                  setDate({ from: selectedDate.from, to: selectedDate.to });
                  setIsCalendarOpen(false);
                }
              }}
              numberOfMonths={2}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>

        {/* Guest Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full overflow-hidden rounded-lg border p-4 text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              )}
            >
              <div className="text-sm text-muted-foreground">GUESTS</div>
              <div className="text-base font-medium">2 guests</div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <Select defaultOpen={true}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 guest</SelectItem>
                  <SelectItem value="2">2 guests</SelectItem>
                  <SelectItem value="3">3 guests</SelectItem>
                  <SelectItem value="4">4 guests</SelectItem>
                  <SelectItem value="5">5 guests</SelectItem>
                  <SelectItem value="6">6 guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Pricing and Booking Options */}
        {showBidInput ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pricing Options</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      These options offer estimated chances of bid acceptance.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {presetOptions.map((option) => (
                <button
                  key={option.price}
                  onClick={() => handlePresetSelect(option.price)}
                  className={cn(
                    "rounded-lg border p-4 text-center transition-colors",
                    selectedPreset === option.price
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50",
                    option.label === "Buy Now" && "font-semibold",
                  )}
                >
                  <div className="text-xl font-bold">${option.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {option.label}
                  </div>
                  {option.percentOff > 0 && (
                    <div className="text-xs font-medium text-green-600">
                      {option.percentOff}% off
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium italic text-muted-foreground">
                Or Name Your Price
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter Bid"
                      value={bidAmount}
                      onChange={handleBidChange}
                      className="pl-7"
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-lg font-medium text-green-600">
                      {bidPercentage}% off
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Slider
                      value={[bidPercentage]}
                      onValueChange={handleSliderChange}
                      max={maxDiscount}
                      min={minDiscount}
                      step={1}
                      className="w-full"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to right, #22c55e, #ef4444)",
                        opacity: 0.2,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>High Acceptance Probability</div>
                    <div>Low Acceptance Probability</div>
                  </div>
                </div>

                <div
                  className={cn(
                    "text-center text-sm font-medium",
                    bidPercentage <= 10
                      ? "text-green-600"
                      : bidPercentage <= 15
                        ? "text-yellow-600"
                        : "text-red-600",
                  )}
                >
                  {getBidLikelihood()}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Hosts have 24 hours to accept or reject your bid.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Accepted bids will be automatically booked.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>
                      You can place multiple bids. Overlapping bids will be
                      canceled if one is accepted.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Button
                    onClick={() => {
                      console.log(`Bid placed: ${bidAmount}`);
                      setShowBidInput(false);
                      setBidAmount("");
                      setBidPercentage(5);
                      setSelectedPreset(null);
                    }}
                    className="flex-1"
                  >
                    Save Bid
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowBidInput(false)}
                  >
                    Cancel Bid
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-1 text-2xl font-bold">Book it now for</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">
                  ${basePrice}
                </span>
                <span className="text-xl text-muted-foreground">Per Night</span>
              </div>
              <Button
                variant="link"
                className="mt-1 flex items-center gap-1 px-0 text-muted-foreground"
              >
                Price Breakdown
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ReserveBtn
                btnSize="sm"
                requestToBook={requestToBook}
                property={property}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowBidInput(true)}
              >
                Place Bid
              </Button>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              You won&apos;t be charged yet
            </p>
          </>
        )}

        <a href="#" className="block text-center text-primary hover:underline">
          Have a property? List now →
        </a>

        <div className="mt-6 space-y-3">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 text-left font-medium hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-green-600">Tramona Safety Guarantee</span>
              </div>
              <ChevronDown className="h-4 w-4 text-green-600" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-9 pt-2 text-muted-foreground">
              Our safety guarantee ensures your peace of mind during your stay.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 text-left font-medium hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-green-600">
                  Lowest Fees Out of all the major Booking Platforms
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-green-600" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-9 pt-2 text-muted-foreground">
              We pride ourselves on offering the most competitive fees in the
              industry.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
