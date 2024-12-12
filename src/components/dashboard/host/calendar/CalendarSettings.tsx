import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HostPropertiesRestrictions from "../HostPropertiesRestrictions";
import { Property } from "@/server/db/schema/tables/properties";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
interface DiscountTier {
  days: number;
  discount: number;
}

export default function CalendarSettings({ property }: { property: Property }) {
  // <---------------------------------- MUTATIONS ---------------------------------->
  const { mutateAsync: updateBookItNow } =
    api.properties.updateBookItNow.useMutation();

  const { mutateAsync: updateRequestToBook } =
    api.properties.updateRequestToBook.useMutation();

  const { mutateAsync: updateAutoOffer } =
    api.properties.updateAutoOffer.useMutation();

  // Book it now section
  const [isChecked, setIsChecked] = useState<boolean | undefined>(
    property.bookItNowEnabled,
  );
  const [bookItNowPercent, setBookItNowPercent] = useState<number>( //HERE CHANGE THIS BECAUSE IT SUPPOSE BE CONNECTED TO THE PROPERTY PRICING
    property.requestToBookMaxDiscountPercentage,
  );
  const [bookItNowSaved, setBookItNowSaved] = useState(false);

  const [offersToBookPercent, setOffersToBookPercent] = useState<number>(
    property.requestToBookMaxDiscountPercentage,
  );
  // Other state variables remain the same
  const [offersToBookOpen, setOffersToBookOpen] = useState(false);
  const [nameYourPriceOpen, setNameYourPriceOpen] = useState(false);
  const [offersToBookSaved, setOffersToBookSaved] = useState(false);
  const [nameYourPriceSaved, setNameYourPriceSaved] = useState(false);

  //Name your price  & Auto offers section
  const [isAutoOfferChecked, setIsAutoOfferChecked] = useState<
    undefined | boolean
  >(property.autoOfferEnabled);

  const [discountTiers, setDiscountTiers] = useState<DiscountTier[]>([
    { days: 90, discount: 5 },
    { days: 60, discount: 10 },
    { days: 30, discount: 15 },
    { days: 21, discount: 20 },
    { days: 14, discount: 25 },
    { days: 7, discount: 30 },
  ]);

  useEffect(() => {
    setIsChecked(property.bookItNowEnabled);
    setBookItNowPercent(property.requestToBookMaxDiscountPercentage);
    setOffersToBookPercent(property.requestToBookMaxDiscountPercentage);
  }, [property]); //update when the selected property changes

  const handleBookItNowSwitch = async (checked: boolean) => {
    setIsChecked(checked);
    //only update if turned off
    try {
      await updateBookItNow({
        id: property.id,
        bookItNowEnabled: checked,
      });
      if (!checked) {
        toast({
          title: `Book it now disabled`,
        });
      }
    } catch (err) {
      toast({
        title: "Something went wrong...",
        variant: "destructive",
      });
    }
  };

  const handleBookItNowSave = async () => {
    setBookItNowSaved(true);
    setTimeout(() => setBookItNowSaved(false), 2000);
    try {
      await updateBookItNow({
        id: property.id,
        bookItNowEnabled: isChecked,
      }); // Enable "Book It Now"
      toast({
        title: `Update successful.`,
      });
    } catch (error) {
      toast({
        title: "Try again",
        description: "Something went wrong...",
      });
    }
  };

  const handleOffersToBookSave = async () => {
    //update request to book discount percentage
    setOffersToBookSaved(true);
    setTimeout(() => setOffersToBookSaved(false), 2000);
    try {
      await updateRequestToBook({
        propertyId: property.id,
        requestToBookMaxDiscountPercentage: offersToBookPercent,
      });
      toast({
        title: "Update successful",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleNameYourPriceSave = () => {
    setNameYourPriceSaved(true);
    setTimeout(() => setNameYourPriceSaved(false), 2000);
  };

  const handleAutoOfferSwitch = async (checked: boolean) => {
    setIsAutoOfferChecked(checked);
    await updateAutoOffer({
      id: property.id,
      autoOfferEnabled: checked,
    });
    console.log("done");
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
            <div className="space-y-3 rounded-lg border p-6">
              <div className="flex cursor-pointer items-center justify-between">
                <h3 className="text-[20px] font-bold text-black">
                  Book it now
                </h3>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-base text-muted-foreground">
                  Set your price, starting as low as the price on Airbnb
                </p>
                <Switch
                  checked={isChecked}
                  className="data-[state=checked]:bg-primaryGreen data-[state=unchecked]:bg-gray-300"
                  onCheckedChange={(checked) => {
                    void handleBookItNowSwitch(checked);
                  }}
                />
              </div>

              {isChecked && (
                <div className="space-y-4 pt-4">
                  <div className="my-6 w-full border-b border-gray-200" />
                  <Label>{bookItNowPercent}% OFF</Label>
                  <Slider
                    value={[bookItNowPercent]}
                    onValueChange={(value) => setBookItNowPercent(value[0]!)}
                    max={80}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enhance the discount to create a more impactful incentive
                    and boost bookings
                  </p>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleBookItNowSave}
                      disabled={bookItNowSaved}
                    >
                      {bookItNowSaved ? "Saving!" : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Offers to book section */}
            <div className="rounded-lg border">
              <div
                className="flex cursor-pointer items-center justify-between px-6 py-8"
                onClick={() => setOffersToBookOpen(!offersToBookOpen)}
              >
                <h3 className="text-[20px] font-bold text-black">
                  Offers to Book
                </h3>
                <Button variant="ghost" size="sm">
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-300"
                    style={{
                      transform: offersToBookOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </Button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${offersToBookOpen ? "-mt-4 max-h-[1000px] p-6 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-base font-bold">
                  What prices would you consider?
                </p>
                <div className="-mx-6 mt-4 w-[calc(100%+3rem)] border-b border-gray-200" />
                <div className="space-y-4 pt-4">
                  <div className="text-lg font-medium">
                    <Label>{offersToBookPercent}% off Airbnb Prices</Label>
                  </div>
                  <Slider
                    value={[offersToBookPercent]}
                    onValueChange={(value) =>
                      setOffersToBookPercent(Math.max(5, value[0]!))
                    }
                    min={5}
                    max={100}
                    step={1}
                  />
                  <p className="text-base text-muted-foreground">
                    You will see requests to book your property in your
                    &quot;requests&quot; tab. You will have the option to
                    accept, deny or counter offer.
                  </p>
                  <div className="flex justify-end">
                    <Button onClick={handleOffersToBookSave}>
                      {offersToBookSaved ? "Saved!" : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Name your price section */}
            <div className="rounded-lg border">
              <div
                className="flex cursor-pointer items-center justify-between px-6 py-8"
                onClick={() => setNameYourPriceOpen(!nameYourPriceOpen)}
              >
                <h3 className="text-xl font-bold text-black">
                  Name Your Own Price
                </h3>
                <Button variant="ghost" size="sm">
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-300"
                    style={{
                      transform: nameYourPriceOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </Button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${nameYourPriceOpen ? "-mt-4 max-h-[1000px] p-6 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-base font-bold">
                  Every day we get thousands of requests from travelers. How
                  would you like to respond to them?
                </p>

                <div className="-mx-6 mt-4 w-[calc(100%+3rem)] border-b border-gray-200" />
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Auto-offer</Label>
                    <Switch
                      checked={isAutoOfferChecked}
                      onCheckedChange={(checked) =>
                        handleAutoOfferSwitch(checked)
                      }
                      className="data-[state=checked]:bg-primaryGreen"
                    />
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
                                  newTiers[index]!.days = parseInt(
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
                                  newTiers[index]!.discount = parseInt(
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

                    <div className="flex justify-start">
                      <Button
                        variant="outline"
                        onClick={addTier}
                        className="w-auto"
                      >
                        Add tier
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleNameYourPriceSave}>
                      {nameYourPriceSaved ? "Saved!" : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="restrictions" className="space-y-6 sm:space-y-8">
            <HostPropertiesRestrictions property={property} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
