import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Property } from "@/server/db/schema/tables/properties";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown";

interface DiscountTier {
  days: number;
  percentOff: number;
}

function RequestAndBidAutomationSection({ property }: { property: Property }) {
  const { mutateAsync: toggleAutoOffer } =
    api.properties.toggleAutoOffer.useMutation();

  const { mutateAsync: updateDiscountTier } =
    api.properties.updatePropertyDiscountTiers.useMutation();

  const [nameYourPriceOpen, setNameYourPriceOpen] = useState(false);
  const [nameYourPriceSaved, setNameYourPriceSaved] = useState(false);

  // Name your price & Auto offers section
  const [isAutoOfferChecked, setIsAutoOfferChecked] = useState<
    undefined | boolean
  >(property.autoOfferEnabled);

  const [discountTiers, setDiscountTiers] = useState<DiscountTier[] | null>(
    property.discountTiers,
  );

  // Reset when the property changes
  useEffect(() => {
    setNameYourPriceOpen(false);
    setIsAutoOfferChecked(property.autoOfferEnabled);
    setDiscountTiers(property.discountTiers);
  }, [property]);

  const handleNameYourPriceSave = async () => {
    setNameYourPriceSaved(true);
    setTimeout(() => setNameYourPriceSaved(false), 2000);
    await updateDiscountTier({
      propertyId: property.id,
      discountTiers: discountTiers,
    }).then(() => {
      toast({
        title: "Discount tier successfully updated",
      });
    });
  };

  const handleAutoOfferSwitch = async (checked: boolean) => {
    setIsAutoOfferChecked(checked);
    await toggleAutoOffer({
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
      setDiscountTiers([...discountTiers, { days: 0, percentOff: 0 }]);
    }
  };

  const handleCancel = () => {
    setDiscountTiers(property.discountTiers);
  };

  return (
    <div className="relative rounded-lg border">
      {/* Overlay */}
      {nameYourPriceOpen && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm"
          style={{ pointerEvents: "auto" }}
          onClick={() => setNameYourPriceOpen(false)}
        >
          <Lock className="h-8 w-8 text-gray-500" />
          <p className="mt-2 text-lg font-semibold text-gray-600">
            Coming Soon
          </p>
        </div>
      )}

      <CalendarSettingsDropdown
        title="Requests and Bids Automation"
        description="Automate your response to make sure you maximize your bookings."
        open={nameYourPriceOpen}
        setOpen={setNameYourPriceOpen}
      />

      <div
        className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
          nameYourPriceOpen
            ? "-mt-4 max-h-[1000px] p-6 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-base font-semibold">
          Every day we get thousands of requests from travelers. Here&apos;s how
          you can automate your response to make sure you maximize your
          bookings.
        </p>

        <div className="-mx-6 mt-4 w-[calc(100%+3rem)] border-b border-gray-200" />
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Auto-offer</Label>
            <Switch
              checked={isAutoOfferChecked}
              onCheckedChange={(checked) => handleAutoOfferSwitch(checked)}
              className="data-[state=checked]:bg-primaryGreen"
              disabled={nameYourPriceOpen}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">Discount Tiers</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDiscountTiers([])}
                disabled={nameYourPriceOpen}
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
                  discountTiers.map((tier, index) => (
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
                          disabled={nameYourPriceOpen}
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
              <Button
                variant="outline"
                onClick={addTier}
                className="w-auto"
                disabled={nameYourPriceOpen}
              >
                Add tier
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={nameYourPriceOpen}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNameYourPriceSave}
              disabled={nameYourPriceOpen}
            >
              {nameYourPriceSaved ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestAndBidAutomationSection;
