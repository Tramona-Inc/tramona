import React from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Property } from "@/server/db/schema/tables/properties";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";

interface DiscountTier {
  days: number;
  percentOff: number;
}

function NameYourOwnPriceSection({ property }: { property: Property }) {
  const { mutateAsync: updateAutoOffer } =
    api.properties.updateAutoOffer.useMutation(); //auto offer and discount tiers

  const [nameYourPriceOpen, setNameYourPriceOpen] = useState(false);
  const [nameYourPriceSaved, setNameYourPriceSaved] = useState(false);

  //Name your price  & Auto offers section
  const [isAutoOfferChecked, setIsAutoOfferChecked] = useState<
    undefined | boolean
  >(property.autoOfferEnabled);

  const [discountTiers, setDiscountTiers] = useState<DiscountTier[] | null>(
    property.autoOfferDiscountTiers,
  );

  const handleNameYourPriceSave = async () => {
    setNameYourPriceSaved(true);
    setTimeout(() => setNameYourPriceSaved(false), 2000);
    await updateAutoOffer({
      id: property.id,
      autoOfferDiscountTiers: discountTiers,
    });
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
    if (!discountTiers) return;
    setDiscountTiers(discountTiers.filter((_, i) => i !== index));
  };

  const addTier = () => {
    if (!discountTiers) {
      setDiscountTiers([{ days: 0, percentOff: 0 }]); // Initialize with the new tier if null
    } else {
      setDiscountTiers([
        ...discountTiers, // Spread existing tiers
        { days: 0, percentOff: 0 }, // Add the new tier
      ]);
    }
  };

  const handleCancel = () => {
    setDiscountTiers(property.autoOfferDiscountTiers);
  };

  return (
    <div className="rounded-lg border">
      <div
        className="flex cursor-pointer items-center justify-between px-6 py-8"
        onClick={() => setNameYourPriceOpen(!nameYourPriceOpen)}
      >
        <h3 className="text-xl font-bold text-black">Name Your Own Price</h3>
        <Button variant="ghost" size="sm">
          <ChevronDown
            className="h-4 w-4 transition-transform duration-300"
            style={{
              transform: nameYourPriceOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${nameYourPriceOpen ? "-mt-4 max-h-[1000px] p-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="text-base font-bold">
          Every day we get thousands of requests from travelers. How would you
          like to respond to them?
        </p>

        <div className="-mx-6 mt-4 w-[calc(100%+3rem)] border-b border-gray-200" />
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Auto-offer</Label>
            <Switch
              checked={isAutoOfferChecked}
              onCheckedChange={(checked) => handleAutoOfferSwitch(checked)}
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
                {!discountTiers || discountTiers.length === 0 ? (
                  <div>
                    Click &quot;Add tier&quot; to add discounts to your auto
                    matches
                  </div>
                ) : (
                  discountTiers?.map((tier, index) => (
                    <TableRow key={index}>
                      <TableCell className="p-2">
                        <Input
                          type="number"
                          value={tier.days}
                          onChange={(e) => {
                            const newTiers = [...discountTiers];
                            newTiers[index]!.days = parseInt(e.target.value);
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
                          value={tier.percentOff}
                          onChange={(e) => {
                            const newTiers = [...discountTiers];
                            newTiers[index]!.percentOff = parseInt(
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
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex justify-start">
              <Button variant="outline" onClick={addTier} className="w-auto">
                Add tier
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleNameYourPriceSave}>
              {nameYourPriceSaved ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NameYourOwnPriceSection;
