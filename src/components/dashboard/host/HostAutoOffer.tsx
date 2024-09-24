import React, { useState, useCallback, useEffect } from "react";
import { type Property } from "@/server/db/schema";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type DiscountTier = {
  days: number;
  percentOff: number;
};

const MAX_TIERS = 10;
const MIN_TIERS = 1;
const MIN_DISCOUNT = 1;
const MAX_DISCOUNT = 80;
const HIGH_DISCOUNT_THRESHOLD = 50;

const DEFAULT_TIERS: DiscountTier[] = [
  { days: 90, percentOff: 5 },
  { days: 60, percentOff: 10 },
  { days: 30, percentOff: 15 },
  { days: 21, percentOff: 20 },
  { days: 14, percentOff: 25 },
  { days: 7, percentOff: 30 },
];

export default function HostAutoOffer({ property }: { property: Property }) {
  const [autoOfferEnabled, setAutoOfferEnabled] = useState(
    property.autoOfferEnabled ?? false,
  );
  const [discountTiers, setDiscountTiers] = useState<DiscountTier[]>(
    property.autoOfferDiscountTiers ?? DEFAULT_TIERS,
  );
  const [showHighDiscountAlert, setShowHighDiscountAlert] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [showEnableConfirmation, setShowEnableConfirmation] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateAutoOfferMutation = api.properties.updateAutoOffer.useMutation({
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Auto-offer settings have been successfully updated.",
        duration: 3000,
      });
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      toast({
        title: "Error saving settings",
        description: `There was a problem saving your settings. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [discountTiers]);

  const orderTiers = (tiers: DiscountTier[]): DiscountTier[] => {
    return [...tiers].sort((a, b) => b.days - a.days);
  };

  const handleSave = () => {
    const orderedTiers = orderTiers(discountTiers);
    const hasHighDiscount = orderedTiers.some(
      (tier) => tier.percentOff >= HIGH_DISCOUNT_THRESHOLD,
    );
    if (hasHighDiscount) {
      setShowHighDiscountAlert(true);
    } else {
      saveSettings(orderedTiers);
    }
  };

  const saveSettings = (tiers: DiscountTier[]) => {
    updateAutoOfferMutation.mutate({
      id: property.id,
      autoOfferEnabled,
      autoOfferDiscountTiers: tiers,
    });
    setDiscountTiers(tiers);
    setHasUnsavedChanges(false);
  };

  const handleDiscountChange = useCallback(
    (index: number, field: keyof DiscountTier, value: string) => {
      setDiscountTiers((prevTiers) => {
        const newTiers = [...prevTiers];
        if (field === "percentOff") {
          const numValue = parseInt(value, 10);
          newTiers[index].percentOff = isNaN(numValue)
            ? 0
            : Math.max(MIN_DISCOUNT, Math.min(MAX_DISCOUNT, numValue));
        } else if (field === "days") {
          const numValue = parseInt(value, 10);
          newTiers[index].days = isNaN(numValue) ? 0 : Math.max(0, numValue);
        }
        return newTiers;
      });
    },
    [],
  );

  const addTier = () => {
    if (discountTiers.length < MAX_TIERS) {
      setDiscountTiers([
        ...discountTiers,
        { days: 0, percentOff: MIN_DISCOUNT },
      ]);
    }
  };

  const removeTier = (index: number) => {
    if (discountTiers.length > MIN_TIERS) {
      setDiscountTiers(discountTiers.filter((_, i) => i !== index));
    }
  };

  const resetToDefault = () => {
    setDiscountTiers([...DEFAULT_TIERS]);
    setShowResetAlert(false);
    setResetKey((prevKey) => prevKey + 1);
    setHasUnsavedChanges(true);
  };

  const handleAutoOfferToggle = (checked: boolean) => {
    if (checked) {
      setShowEnableConfirmation(true);
    } else {
      setAutoOfferEnabled(false);
      saveSettings(discountTiers);
    }
  };

  const confirmEnableAutoOffer = () => {
    setAutoOfferEnabled(true);
    setShowEnableConfirmation(false);
    saveSettings(discountTiers);
  };

  const handleCancel = () => {
    setDiscountTiers(property.autoOfferDiscountTiers);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Auto-Offer Settings</h2>
        <Switch
          className="data-[state=checked]:bg-primaryGreen"
          checked={autoOfferEnabled}
          onCheckedChange={handleAutoOfferToggle}
        />
      </div>
      {autoOfferEnabled && (
        <>
          <p className="text-sm text-muted-foreground">
            Automatically send offers to guests with discount tiers based on how
            near an upcoming vacancy is. As vacant dates approach, offering a
            greater discount might be able to fill those dates more quickly.{" "}
            <br />
            <br />
            (Discounts are based off of this property's rate on Airbnb.)
          </p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="discount-tiers">
              <AccordionTrigger>Discount Tiers</AccordionTrigger>
              <AccordionContent>
                {discountTiers.map((tier, index) => (
                  <div
                    key={`${resetKey}-${index}`}
                    className="my-2 flex items-center space-x-2"
                  >
                    <Input
                      type="number"
                      value={tier.days}
                      onChange={(e) =>
                        handleDiscountChange(index, "days", e.target.value)
                      }
                      className="w-20"
                      min="0"
                    />
                    <span>days before check-in:</span>
                    <Input
                      type="number"
                      value={tier.percentOff}
                      onChange={(e) =>
                        handleDiscountChange(
                          index,
                          "percentOff",
                          e.target.value,
                        )
                      }
                      className="w-20"
                      min={MIN_DISCOUNT}
                      max={MAX_DISCOUNT}
                      step="1"
                    />
                    <span>% off</span>
                    {discountTiers.length > MIN_TIERS && (
                      <Button
                        onClick={() => removeTier(index)}
                        variant="ghost"
                        className="hover:bg-transparent"
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ))}
                {discountTiers.length < MAX_TIERS && (
                  <Button
                    onClick={addTier}
                    className="mt-2"
                    variant={"outline"}
                  >
                    Add Tier
                  </Button>
                )}
                <div className="flex mt-8 space-x-2">
                  <Button onClick={handleSave}>Save</Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={!hasUnsavedChanges}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowResetAlert(true)}
                    variant="outline"
                  >
                    Reset to Default
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      )}

      <AlertDialog
        open={showHighDiscountAlert}
        onOpenChange={setShowHighDiscountAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm High Discount</AlertDialogTitle>
            <AlertDialogDescription>
              You have set a discount of 50% or more. This is a significant
              reduction in price. Are you sure you want to save these settings?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowHighDiscountAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowHighDiscountAlert(false);
                saveSettings(orderTiers(discountTiers));
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetAlert} onOpenChange={setShowResetAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset to the default settings? This will
              remove any custom tiers you've set up.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowResetAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={resetToDefault}>
              Confirm Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showEnableConfirmation}
        onOpenChange={setShowEnableConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enable Auto-Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Enabling auto-offer will automatically create offers based on your
              settings. You can turn it off at any time, but it won't affect
              offers already extended to travelers. Do you want to enable this
              feature?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowEnableConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmEnableAutoOffer}>
              Enable Auto-Offer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
