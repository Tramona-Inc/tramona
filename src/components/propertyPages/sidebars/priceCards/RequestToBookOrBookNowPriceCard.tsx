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
import { ChevronDown, ChevronUp, Info, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/router";
import PriceBreakdown from "./PriceBreakdown";

import PriceCardInformation from "./PriceCardInformation";
import BookNowBtn from "../actionButtons/BookNowBtn";
import RequestToBookBtn from "../actionButtons/RequestToBookBtn";
import { PropertyPageData } from "../../PropertyPage";

export type RequestToBookDetails = {
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  travelerOfferedPriceBeforeFees: number;
};

export default function RequestToBookOrBookNowPriceCard({
  property,
}: {
  property: PropertyPageData;
}) {
  const basePrice = 14500; // per night price
  const minDiscount = 5;
  const maxDiscount = 20;

  const router = useRouter();
  const { query } = router;

  const initialRequestToBook: RequestToBookDetails = {
    checkIn: query.checkIn ? new Date(query.checkIn as string) : new Date(),
    checkOut: query.checkOut ? new Date(query.checkOut as string) : new Date(),
    numGuests: query.numGuests ? parseInt(query.numGuests as string) : 2,
    travelerOfferedPriceBeforeFees: query.travelerOfferedPriceBeforeFees
      ? parseInt(query.travelerOfferedPriceBeforeFees as string)
      : basePrice,
  };

  const [date, setDate] = useState({
    from: initialRequestToBook.checkIn,
    to: initialRequestToBook.checkOut,
  });
  const [showPriceBreakdown, setShowPriceBreakdown] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showRequestInput, setShowRequestInput] = useState(false);
  const [requestAmount, setRequestAmount] = useState(basePrice);
  const [requestPercentage, setRequestPercentage] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [requestToBook, setRequestToBook] =
    useState<RequestToBookDetails>(initialRequestToBook);

  useEffect(() => {
    if (query.checkIn && query.checkOut && query.numGuests) {
      const checkIn = new Date(query.checkIn as string);
      const checkOut = new Date(query.checkOut as string);
      const numGuests = parseInt(query.numGuests as string);
      setDate({ from: checkIn, to: checkOut });
      setRequestToBook((prevState) => ({
        ...prevState,
        checkIn,
        checkOut,
        numGuests,
      }));
    }
  }, [query.checkIn, query.checkOut, query.numGuests]);

  const updateRequestToBook = (updates: Partial<RequestToBookDetails>) => {
    setRequestToBook((prevState) => ({
      ...prevState,
      ...updates,
    }));

    // Update URL query params
    void router.push(
      {
        query: {
          ...query,
          ...updates,
          checkIn: updates.checkIn?.toISOString() ?? query.checkIn,
          checkOut: updates.checkOut?.toISOString() ?? query.checkOut,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleGuestChange = (value: string) => {
    const numGuests = parseInt(value);
    updateRequestToBook({ numGuests });
  };

  const presetOptions = [
    { price: 116, label: "Good request", percentOff: 20 },
    { price: 130, label: "Better request", percentOff: 10 },
    { price: 145, label: "Buy Now", percentOff: 0 },
  ];

  useEffect(() => {
    if (showRequestInput) {
      const newPercentage = Math.round(
        ((basePrice - requestAmount) / basePrice) * 100,
      );
      setRequestPercentage(
        Math.max(minDiscount, Math.min(newPercentage, maxDiscount)),
      );
    }
  }, [showRequestInput, requestAmount, basePrice]);

  const handleRequestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRequestAmount = parseInt(e.target.value);
    setRequestAmount(newRequestAmount);
    updateRequestToBook({ travelerOfferedPriceBeforeFees: newRequestAmount });
    setSelectedPreset(null);
  };

  const handleSliderChange = (value: number[]) => {
    const newRequestAmount = Math.round(basePrice * (1 - value[0]! / 100));
    setRequestAmount(newRequestAmount);
    setRequestPercentage(value[0]!);
    updateRequestToBook({ travelerOfferedPriceBeforeFees: newRequestAmount });
    setSelectedPreset(null);
  };

  const getRequestLikelihood = () => {
    if (requestPercentage <= 10) return "Good chance of acceptance";
    if (requestPercentage <= 15) return "Moderate chance of acceptance";
    return "Lower chance of acceptance";
  };

  const handlePresetSelect = (price: number) => {
    setRequestAmount(price);
    updateRequestToBook({ travelerOfferedPriceBeforeFees: price });
    const newPercentage = Math.round(((basePrice - price) / basePrice) * 100);
    setRequestPercentage(
      Math.max(minDiscount, Math.min(newPercentage, maxDiscount)),
    );
    setSelectedPreset(price);
  };

  return (
    <Card className="w-full bg-gray-50 shadow-lg">
      <CardContent className="flex flex-col gap-y-2 rounded-xl md:p-2 xl:p-6">
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
                  updateRequestToBook({
                    checkIn: selectedDate.from,
                    checkOut: selectedDate.to,
                  });
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
              <div className="text-base font-medium">
                {requestToBook.numGuests} guests
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <Select
                defaultValue={requestToBook.numGuests.toString()}
                onValueChange={handleGuestChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} guest{num !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Pricing and Booking Options */}
        {showRequestInput ? (
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
                      onChange={handleRequestChange}
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
                  {getRequestLikelihood()}
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
                    <Info className="h-5 w-5" />
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
                    onClick={() => setShowRequestInput(false)}
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
                <span className="text-4xl font-bold text-primary lg:text-5xl">
                  {formatCurrency(basePrice)}
                </span>
                <span className="text-xl text-muted-foreground">Per Night</span>
              </div>
              <Button
                variant="link"
                className="mt-1 flex items-center gap-1 px-0 text-muted-foreground"
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
              >
                Price Breakdown
                {showPriceBreakdown ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {showPriceBreakdown && (
                <PriceBreakdown
                  requestToBookDetails={requestToBook}
                  property={property}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-1">
              {property.bookItNowEnabled && (
                <BookNowBtn
                  btnSize="sm"
                  property={property}
                  requestToBook={requestToBook}
                />
              )}
              <Button
                variant="outline"
                className={`col-auto w-full px-2 text-sm tracking-tight lg:text-base ${
                  !property.bookItNowEnabled ? "col-span-2" : ""
                }`}
                onClick={() => setShowRequestInput(true)}
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
