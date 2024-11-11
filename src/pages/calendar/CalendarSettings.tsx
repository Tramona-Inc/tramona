"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import MonthCalendar from "./MonthCalendar";
import { useState } from "react";

type ReservationInfo = {
  start: string;
  end: string;
  platformBookedOn: "airbnb" | "tramona";
};

export default function CalendarComponent() {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [discountTiers, setDiscountTiers] = React.useState([
    { days: 90, discount: 5 },
    { days: 60, discount: 10 },
    { days: 30, discount: 15 },
    { days: 21, discount: 20 },
    { days: 14, discount: 25 },
    { days: 7, discount: 30 },
  ]);
  const [date, setDate] = useState<Date>(new Date());
  const [bookItNow, setBookItNow] = React.useState(false);
  const [percentOff, setPercentOff] = React.useState(5);
  const [offersToBookOpen, setOffersToBookOpen] = React.useState(false);
  const [nameYourPriceOpen, setNameYourPriceOpen] = React.useState(false);
  const [selectedProperty, setSelectedProperty] =
    React.useState("All Properties");
  const [bookItNowSaved, setBookItNowSaved] = React.useState(false);
  const [offersToBookSaved, setOffersToBookSaved] = React.useState(false);
  const [nameYourPriceSaved, setNameYourPriceSaved] = React.useState(false);
  const [propertyRestrictionsOpen, setPropertyRestrictionsOpen] =
    React.useState(false);
  const [minimumOfferPriceOpen, setMinimumOfferPriceOpen] =
    React.useState(false);

  const [editing, setEditing] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  // Example properties - replace with your API call
  const properties = [
    "The best place in SD",
    "Cozy Downtown Loft",
    "Beachfront Paradise",
    "Mountain Retreat",
  ];

  // Replace with your actual API call
  const { data: reservedDateRanges, isLoading } =
    api.calendar.getReservedDateRanges.useQuery({
      propertyId: "property-id",
    });

  const handleDateClick = (date: Date) => {
    if (!editing) return;

    setSelectedRange((prev) => {
      if (!prev.start) {
        return { start: date, end: date };
      }
      if (!prev.end) {
        if (date < prev.start) {
          return { start: date, end: prev.start };
        }
        return { ...prev, end: date };
      }
      return { start: date, end: date };
    });
  };

  const handleBlockDates = async () => {
    if (!selectedRange.start || !selectedRange.end) return;

    try {
      // Add your API call here to block dates
      console.log("Blocking dates:", selectedRange);
      setSelectedRange({ start: null, end: null });
    } catch (error) {
      console.error("Error blocking dates:", error);
    }
  };

  const handleUnblockDates = async () => {
    if (!selectedRange.start || !selectedRange.end) return;

    try {
      // Add your API call here to unblock dates
      console.log("Unblocking dates:", selectedRange);
      setSelectedRange({ start: null, end: null });
    } catch (error) {
      console.error("Error unblocking dates:", error);
    }
  };
  const isDateReserved = (date: Date): ReservationInfo | undefined => {
    return reservedDates.find((reservation) => {
      const start = new Date(reservation.start);
      const end = new Date(reservation.end);
      return date >= start && date < end;
    });
  };

  const handleBookItNowSave = () => {
    console.log("Saving Book It Now settings:", { percentOff });
    setBookItNowSaved(true);
    setTimeout(() => setBookItNowSaved(false), 2000);
  };

  const handleOffersToBookSave = () => {
    console.log("Saving Offers to Book settings:", { percentOff });
    setOffersToBookSaved(true);
    setTimeout(() => setOffersToBookSaved(false), 2000);
  };

  const handleNameYourPriceSave = () => {
    console.log("Saving Name Your Price settings:", { discountTiers });
    setNameYourPriceSaved(true);
    setTimeout(() => setNameYourPriceSaved(false), 2000);
  };

  const dayWithPrice = (day: Date, prices: { [key: string]: number }) => {
    const dateStr = day.toISOString().split("T")[0];
    const reservedInfo = isDateReserved(day);

    let reservationClass = "";
    if (reservedInfo) {
      if (reservedInfo.platformBookedOn === "airbnb") {
        reservationClass = "bg-reserved-pattern";
      } else if (reservedInfo.platformBookedOn === "tramona") {
        reservationClass = "bg-reserved-pattern-2";
      }
    }

    return (
      <div
        className={cn(
          "h-14 w-full p-1 sm:h-20 sm:p-2",
          "flex flex-col justify-between",
          "hover:bg-accent hover:text-accent-foreground",
          reservationClass,
          selectedDates.some((d) => d.getTime() === day.getTime()) &&
            "bg-blue-200",
        )}
      >
        <span className="text-xs font-medium sm:text-sm">{day.getDate()}</span>
        <span className="text-[10px] text-muted-foreground sm:text-xs">
          ${prices[dateStr] || 168}
        </span>
      </div>
    );
  };

  const prices = React.useMemo(() => {
    const priceMap: { [key: string]: number } = {};
    const currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    while (currentDate.getMonth() === date.getMonth()) {
      priceMap[currentDate.toISOString().split("T")[0]] = 168;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return priceMap;
  }, [date]);

  const removeTier = (index: number) => {
    setDiscountTiers(discountTiers.filter((_, i) => i !== index));
  };

  const addTier = () => {
    setDiscountTiers([...discountTiers, { days: 0, discount: 0 }]);
  };

  const calculateDiscountedPrice = (
    originalPrice: number,
    percentOff: number,
  ) => {
    return Math.round(originalPrice * (1 - percentOff / 100));
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth() + increment,
      1,
    );
    setDate(newDate);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-4 p-2 sm:p-4 lg:flex-row">
      {/* CALENDAR */}
      <Card className="h-full w-full max-w-[1050px] flex-shrink-0">
        <CardContent className="flex h-full flex-col p-3 sm:p-6">
          <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:mb-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="text-xs text-muted-foreground sm:text-sm">
                <p>15 vacancies this month</p>
                <p>$1000 left on the table</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => changeMonth(-1)}
                className="rounded-full border bg-white shadow-lg hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => setDate(new Date())}>
                {date.toLocaleString("default", { month: "long" })}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => changeMonth(1)}
                className="rounded-full border bg-white shadow-lg hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="ml-0 rounded-full border shadow-lg sm:ml-4"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{selectedProperty}</span>
                    <span className="sm:hidden">Property</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {properties.map((property) => (
                    <DropdownMenuItem
                      key={property}
                      onSelect={() => setSelectedProperty(property)}
                    >
                      {property}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="min-h-[600px] flex-1">
            <MonthCalendar
              date={date}
              reservedDateRanges={reservedDateRanges}
              onDateClick={handleDateClick}
              selectedRange={selectedRange}
              isEditing={editing}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              Block Dates
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              Unblock Dates
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              Edit iCal Link
            </Button>
            <div className="w-full sm:w-auto sm:flex-1" />
            <Button
              variant="outline"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              Cancel
            </Button>
            <Button size="sm" className="flex-grow sm:flex-grow-0">
              Done
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SETTINGS */}
      <Card className="w-full flex-1">
        <CardContent className="p-3 sm:p-6">
          <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
            Settings
          </h2>
          <Tabs defaultValue="pricing">
            <TabsList className="mb-4 w-full sm:mb-6">
              <TabsTrigger value="pricing" className="flex-1">
                Pricing
              </TabsTrigger>
              <TabsTrigger value="restrictions" className="flex-1">
                Restrictions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="space-y-6 sm:space-y-8">
              {/* Book it now section */}
              <div className="space-y-4 rounded-lg border p-6">
                {" "}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[20px] font-bold text-primaryGreen">
                      {" "}
                      Book it now
                    </h3>
                    <p className="text-base text-muted-foreground">
                      {" "}
                      Set your price, starting as low as the price on Airbnb
                    </p>
                  </div>
                  <Switch
                    checked={bookItNow}
                    className="data-[state=checked]:bg-primaryGreen"
                    onCheckedChange={setBookItNow}
                  />
                </div>
                {bookItNow && (
                  <div className="space-y-4">
                    <Label>{percentOff}% OFF Airbnb Price</Label>
                    <Slider
                      value={[percentOff]}
                      onValueChange={(value) => setPercentOff(value[0])}
                      max={100}
                    />
                    <p className="text-xs text-muted-foreground">
                      This is likely to generate 1% more bookings, increase the
                      discount for a more significant effect
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primaryGreen sm:text-4xl">
                        ${calculateDiscountedPrice(168, percentOff)}
                      </span>
                      <span className="text-lg text-muted-foreground line-through sm:text-2xl">
                        $168
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleBookItNowSave}
                    >
                      {bookItNowSaved ? "Saved!" : "Save"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Offers to book section */}
              <div className="space-y-4 rounded-lg border p-6">
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => setOffersToBookOpen(!offersToBookOpen)}
                >
                  <h3 className="text-[20px] font-bold text-primaryGreen">
                    Offers to Book
                  </h3>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                {offersToBookOpen && (
                  <>
                    <p className="text-base text-muted-foreground">
                      What prices would you consider?
                    </p>
                    <div className="space-y-4">
                      <div className="text-lg font-medium">
                        <span>{percentOff}% off</span>
                      </div>
                      <Slider
                        value={[percentOff]}
                        onValueChange={(value) =>
                          setPercentOff(Math.max(5, value[0]))
                        }
                        min={5}
                        max={100}
                        step={1}
                      />
                      <p className="text-base text-muted-foreground">
                        You will see requests to book your property in your
                        "requests" tab. You will have the option to accept, deny
                        or counter offer.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full rounded-lg text-base"
                        onClick={handleOffersToBookSave}
                      >
                        {offersToBookSaved ? "Saved!" : "Save"}
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Name your price section */}
              <div className="space-y-4 rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-primaryGreen">
                    Name Your Own Price
                  </h3>
                  <Switch
                    checked={nameYourPriceOpen}
                    className="data-[state=checked]:bg-primaryGreen"
                    onCheckedChange={setNameYourPriceOpen}
                  />
                </div>
                {nameYourPriceOpen && (
                  <>
                    <p className="text-base text-muted-foreground">
                      Every day we get thousands of requests from travelers. How
                      would you like to respond to them?
                    </p>
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">Auto-offer</Label>
                      <Switch className="data-[state=checked]:bg-primaryGreen" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium">Discount Tiers</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDiscountTiers([])}
                        >
                          Reset
                        </Button>
                      </div>

                      <Table>
                        <TableBody>
                          {discountTiers.map((tier, index) => (
                            <TableRow key={index}>
                              <TableCell className="p-2">
                                <Input
                                  type="number"
                                  value={tier.days}
                                  onChange={(e) => {
                                    const newTiers = [...discountTiers];
                                    newTiers[index].days = parseInt(
                                      e.target.value,
                                    );
                                    setDiscountTiers(newTiers);
                                  }}
                                  className="w-16 sm:w-20"
                                />
                              </TableCell>
                              <TableCell className="p-2">
                                days before check-in:
                              </TableCell>
                              <TableCell className="p-2">
                                <Input
                                  type="number"
                                  value={tier.discount}
                                  onChange={(e) => {
                                    const newTiers = [...discountTiers];
                                    newTiers[index].discount = parseInt(
                                      e.target.value,
                                    );
                                    setDiscountTiers(newTiers);
                                  }}
                                  className="w-16 sm:w-20"
                                />
                              </TableCell>
                              <TableCell className="p-2">% off</TableCell>
                              <TableCell className="p-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTier(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={addTier}
                      >
                        Add tier
                      </Button>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleNameYourPriceSave}>
                        {nameYourPriceSaved ? "Saved!" : "Save"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="restrictions">
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() =>
                      setPropertyRestrictionsOpen(!propertyRestrictionsOpen)
                    }
                  >
                    <h3 className="font-semibold">Property restrictions</h3>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  {propertyRestrictionsOpen && (
                    <>
                      <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
                        Travelers must be at least this old to book this
                        property.
                      </p>
                      <Input placeholder="Minimum booking age" />
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() =>
                      setMinimumOfferPriceOpen(!minimumOfferPriceOpen)
                    }
                  >
                    <h3 className="font-semibold">Minimum offer price</h3>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  {minimumOfferPriceOpen && (
                    <>
                      <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
                        You will only see offers equal to or higher than this
                        price.
                      </p>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input className="pl-6" placeholder="0" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
