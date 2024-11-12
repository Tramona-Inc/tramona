"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatCurrency } from "@/utils/utils";
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
  Info,
  Clock,
  CheckCircle,
} from "lucide-react";

import RequestToBookBtn, {
  RequestToBookDetails,
  PropertyPageData,
} from "../actionButtons/RequestToBookBtn";
import PriceCardInformation from "./PriceCardInformation";
import BookNowBtn from "../actionButtons/BookNowBtn";

export default function RequestToBookOrBookNowPriceCard({
  // offer,
  property,
  requestToBook,
}: {
  property: PropertyPageData;
  requestToBook: RequestToBookDetails;
}) {
  const [date, setDate] = useState({
    from: new Date(2024, 10, 11),
    to: new Date(2024, 10, 14),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showrequestInput, setShowrequestInput] = useState(false);
  const [requestAmount, setrequestAmount] = useState("");
  const [requestPercentage, setrequestPercentage] = useState(5);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const basePrice = 14500; // per night price
  const minDiscount = 5;
  const maxDiscount = 20;

  requestToBook.travelerOfferedPriceBeforeFees = basePrice;

  const presetOptions = [
    { price: 116, label: "Good request", percentOff: 20 },
    { price: 130, label: "Better request", percentOff: 10 },
    { price: 145, label: "Buy Now", percentOff: 0 },
  ];

  useEffect(() => {
    if (showrequestInput) {
      const discountedPrice = Math.round(
        basePrice * (1 - requestPercentage / 100),
      );
      setrequestAmount(discountedPrice.toString());
    }
  }, [showrequestInput, requestPercentage]);

  const handlerequestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newrequestAmount = e.target.value;
    setrequestAmount(newrequestAmount);
    const newPercentage = Math.round(
      ((basePrice - parseFloat(newrequestAmount)) / basePrice) * 100,
    );
    setrequestPercentage(
      Math.max(minDiscount, Math.min(newPercentage, maxDiscount)),
    );
    setSelectedPreset(null);
  };

  const handleSliderChange = (value: number[]) => {
    setrequestPercentage(value[0]!);
    const newrequestAmount = Math.round(basePrice * (1 - value[0]! / 100));
    setrequestAmount(newrequestAmount.toString());
    setSelectedPreset(null);
  };

  const getrequestLikelihood = () => {
    if (requestPercentage <= 10) return "Good chance of acceptance";
    if (requestPercentage <= 15) return "Moderate chance of acceptance";
    return "Lower chance of acceptance";
  };

  const handlePresetSelect = (price: number) => {
    setrequestAmount(price.toString());
    const newPercentage = Math.round(((basePrice - price) / basePrice) * 100);
    setrequestPercentage(
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
        {showrequestInput ? (
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
                      These options offer estimated chances of request
                      acceptance.
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
                    option.label === "Book Now" && "font-semibold",
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
                      placeholder="Enter request"
                      value={requestAmount}
                      onChange={handlerequestChange}
                      className="pl-7"
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-lg font-medium text-green-600">
                      {requestPercentage}% off
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Slider
                      value={[requestPercentage]}
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
                    requestPercentage <= 10
                      ? "text-green-600"
                      : requestPercentage <= 15
                        ? "text-yellow-600"
                        : "text-red-600",
                  )}
                >
                  {getrequestLikelihood()}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Hosts have 24 hours to accept or reject your request.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Accepted requests will be automatically booked.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>
                      You can place multiple requests. Overlapping requests will
                      be canceled if one is accepted.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <RequestToBookBtn
                    btnSize="sm"
                    requestToBook={requestToBook}
                    property={property}
                  />
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowrequestInput(false)}
                  >
                    Cancel request
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
                  {formatCurrency(basePrice)}
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
              <BookNowBtn
                btnSize="sm"
                property={property}
                requestToBook={requestToBook}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowrequestInput(true)}
              >
                Place request
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
        <PriceCardInformation />
      </CardContent>
    </Card>
  );
}
