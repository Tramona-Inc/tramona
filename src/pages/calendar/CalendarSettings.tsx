"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiscountTier {
  days: number;
  discount: number;
}

export default function CalendarSettings() {
  const [bookItNow, setBookItNow] = React.useState(false);
  const [percentOff, setPercentOff] = React.useState(5);
  const [offersToBookOpen, setOffersToBookOpen] = React.useState(false);
  const [nameYourPriceOpen, setNameYourPriceOpen] = React.useState(false);
  const [bookItNowSaved, setBookItNowSaved] = React.useState(false);
  const [offersToBookSaved, setOffersToBookSaved] = React.useState(false);
  const [nameYourPriceSaved, setNameYourPriceSaved] = React.useState(false);
  const [propertyRestrictionsOpen, setPropertyRestrictionsOpen] = React.useState(false);
  const [minimumOfferPriceOpen, setMinimumOfferPriceOpen] = React.useState(false);
  const [discountTiers, setDiscountTiers] = React.useState<DiscountTier[]>([
    { days: 90, discount: 5 },
    { days: 60, discount: 10 },
    { days: 30, discount: 15 },
    { days: 21, discount: 20 },
    { days: 14, discount: 25 },
    { days: 7, discount: 30 },
  ]);

  const calculateDiscountedPrice = (originalPrice: number, percentOff: number) => {
    return Math.round(originalPrice * (1 - percentOff / 100));
  };

  const handleBookItNowSave = () => {
    setBookItNowSaved(true);
    setTimeout(() => setBookItNowSaved(false), 2000);
  };

  const handleOffersToBookSave = () => {
    setOffersToBookSaved(true);
    setTimeout(() => setOffersToBookSaved(false), 2000);
  };

  const handleNameYourPriceSave = () => {
    setNameYourPriceSaved(true);
    setTimeout(() => setNameYourPriceSaved(false), 2000);
  };

  const removeTier = (index: number) => {
    setDiscountTiers(discountTiers.filter((_, i) => i !== index));
  };

  const addTier = () => {
    setDiscountTiers([...discountTiers, { days: 0, discount: 0 }]);
  };

  return (
    <Card className="w-full flex-1">
      <CardContent className="p-3 sm:p-6">
        <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">Settings</h2>
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[20px] font-bold text-primaryGreen">
                    Book it now
                  </h3>
                  <p className="text-base text-muted-foreground">
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
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="bg-primaryGreen text-white hover:bg-primaryGreen/90"
                      onClick={handleBookItNowSave}
                    >
                      {bookItNowSaved ? "Saved!" : "Save"}
                    </Button>
                  </div>
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
                      onValueChange={(value) => setPercentOff(Math.max(5, value[0]))}
                      min={5}
                      max={100}
                      step={1}
                    />
                    <p className="text-base text-muted-foreground">
                      You will see requests to book your property in your
                      "requests" tab. You will have the option to accept, deny
                      or counter offer.
                    </p>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        className="bg-primaryGreen text-white hover:bg-primaryGreen/90"
                        onClick={handleOffersToBookSave}
                      >
                        {offersToBookSaved ? "Saved!" : "Save"}
                      </Button>
                    </div>
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
                                  newTiers[index].days = parseInt(e.target.value);
                                  setDiscountTiers(newTiers);
                                }}
                                className="w-16 sm:w-20"
                              />
                            </TableCell>
                            <TableCell className="p-2">days before check-in:</TableCell>
                            <TableCell className="p-2">
                              <Input
                                type="number"
                                value={tier.discount}
                                onChange={(e) => {
                                  const newTiers = [...discountTiers];
                                  newTiers[index].discount = parseInt(e.target.value);
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

                    <Button variant="outline" className="w-full" onClick={addTier}>
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
                  onClick={() => setPropertyRestrictionsOpen(!propertyRestrictionsOpen)}
                >
                  <h3 className="font-semibold">Property restrictions</h3>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                {propertyRestrictionsOpen && (
                  <>
                    <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
                      Travelers must be at least this old to book this property.
                    </p>
                    <Input placeholder="Minimum booking age" />
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => setMinimumOfferPriceOpen(!minimumOfferPriceOpen)}
                >
                  <h3 className="font-semibold">Minimum offer price</h3>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                {minimumOfferPriceOpen && (
                  <>
                    <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
                      You will only see offers equal to or higher than this price.
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
  );
}