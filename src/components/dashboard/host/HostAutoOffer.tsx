import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  useForm,
  useFieldArray,
  FieldArrayWithId,
  UseFormWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Constants
const MAX_TIERS = 10;
const MIN_TIERS = 1;
const MIN_DISCOUNT = 1;
const MAX_DISCOUNT = 80;
const HIGH_DISCOUNT_THRESHOLD = 50;

const DEFAULT_TIERS = [
  { days: 90, percentOff: 5 },
  { days: 60, percentOff: 10 },
  { days: 30, percentOff: 15 },
  { days: 21, percentOff: 20 },
  { days: 14, percentOff: 25 },
  { days: 7, percentOff: 30 },
];

// Schemas
const discountTierSchema = z.object({
  days: z.number().min(0, "Days must be 0 or greater"),
  percentOff: z.number().min(MIN_DISCOUNT).max(MAX_DISCOUNT),
});

const formSchema = z.object({
    autoOfferEnabled: z.boolean(),
    autoOfferDiscountTiers: z.array(discountTierSchema)
      .min(MIN_TIERS)
      .max(MAX_TIERS)
      .refine(
        (tiers) => {
          const days = tiers.map((tier) => tier.days);
          return new Set(days).size === days.length;
        },
        {
          message: "Each 'days' value must be unique",
          path: ["autoOfferDiscountTiers"],
        }
      ),
  });
type FormSchema = z.infer<typeof formSchema>;

// Updated helper functions
const orderTiers = (
  tiers: FormSchema["autoOfferDiscountTiers"],
): FormSchema["autoOfferDiscountTiers"] => {
  return [...tiers].sort((a, b) => b.days - a.days);
};

const hasHighDiscount = (
  tiers: FormSchema["autoOfferDiscountTiers"],
): boolean => {
  return tiers.some((tier) => tier.percentOff >= HIGH_DISCOUNT_THRESHOLD);
};

// Component
export default function HostAutoOffer({ property }: { property: Property }) {
  const [showHighDiscountAlert, setShowHighDiscountAlert] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [showEnableConfirmation, setShowEnableConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const originalValuesRef = useRef<FormSchema>({
    autoOfferEnabled: property.autoOfferEnabled ?? false,
    autoOfferDiscountTiers: property.autoOfferDiscountTiers ?? DEFAULT_TIERS,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: originalValuesRef.current,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "autoOfferDiscountTiers",
  });

  const updateAutoOfferMutation = api.properties.updateAutoOffer.useMutation({
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Settings saved",
        description: "Auto-offer settings have been successfully updated.",
        duration: 3000,
      });
      originalValuesRef.current = variables;
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: `There was a problem saving your settings. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const checkForChanges = useCallback((currentValues: FormSchema) => {
    const original = originalValuesRef.current;

    if (currentValues.autoOfferEnabled !== original.autoOfferEnabled) {
      return true;
    }

    if (
      currentValues.autoOfferDiscountTiers.length !==
      original.autoOfferDiscountTiers.length
    ) {
      return true;
    }

    for (let i = 0; i < currentValues.autoOfferDiscountTiers.length; i++) {
      if (
        currentValues.autoOfferDiscountTiers[i]?.days !==
          original.autoOfferDiscountTiers[i]?.days ||
        currentValues.autoOfferDiscountTiers[i]?.percentOff !==
          original.autoOfferDiscountTiers[i]?.percentOff
      ) {
        return true;
      }
    }

    return false;
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const currentValues = form.getValues();
      const isChanged = checkForChanges(currentValues);
      setHasUnsavedChanges(isChanged);
    });
    return () => subscription.unsubscribe();
  }, [form, checkForChanges]);

  const handleAddTier = useCallback(() => {
    if (fields.length < MAX_TIERS) {
      append({ days: 0, percentOff: MIN_DISCOUNT });
      const currentValues = form.getValues();
      setHasUnsavedChanges(checkForChanges(currentValues));
    }
  }, [fields.length, append, form, checkForChanges]);

  const handleSuccessfulSubmit = useCallback((data: FormSchema) => {
    originalValuesRef.current = data;
    setHasUnsavedChanges(false);
  }, []);

  const handleSubmit = useCallback(
    async (data: FormSchema) => {
      if (isSaving) return;

      const orderedTiers = orderTiers(data.autoOfferDiscountTiers);
      const uniqueDays = new Set(orderedTiers.map((tier) => tier.days));
      if (uniqueDays.size !== orderedTiers.length) {
        toast({
          title: "Error saving settings",
          description: "Cannot assign different discounts to the same time period.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
      if (hasHighDiscount(orderedTiers)) {
        setShowHighDiscountAlert(true);
      } else {
        try {
          await updateAutoOfferMutation.mutateAsync({
            id: property.id,
            autoOfferEnabled: data.autoOfferEnabled,
            autoOfferDiscountTiers: orderedTiers,
          });
          handleSuccessfulSubmit(data);
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      }
    },
    [property.id, updateAutoOfferMutation, isSaving, handleSuccessfulSubmit],
  );

  const handleCancel = useCallback(() => {
    form.reset(originalValuesRef.current);
    setHasUnsavedChanges(false);
  }, [form]);

  const handleResetToDefault = useCallback(() => {
    setShowResetAlert(true);
  }, []);

  const handleConfirmReset = useCallback(() => {
    const defaultValues = {
      autoOfferEnabled: property.autoOfferEnabled ?? false,
      autoOfferDiscountTiers: DEFAULT_TIERS,
    };
    form.reset(defaultValues);
    const isChanged = checkForChanges(defaultValues);
    setHasUnsavedChanges(isChanged);
    setShowResetAlert(false);
  }, [form, property.autoOfferEnabled, checkForChanges]);

  const handleCancelReset = useCallback(() => {
    setShowResetAlert(false);
  }, []);

  const handleAutoOfferToggle = useCallback(
    (checked: boolean) => {
      if (checked) {
        setShowEnableConfirmation(true);
      } else {
        form.setValue("autoOfferEnabled", false);
        form.handleSubmit(handleSubmit)();
      }
    },
    [form, handleSubmit],
  );

  const handleConfirmEnableAutoOffer = useCallback(() => {
    form.setValue("autoOfferEnabled", true);
    setShowEnableConfirmation(false);
    form.handleSubmit(handleSubmit)();
  }, [form, handleSubmit]);

  // Render helpers
  const renderDiscountTierFields = useCallback(
    (
      fields: FieldArrayWithId<FormSchema, "autoOfferDiscountTiers", "id">[],
      remove: (index: number) => void,
    ) =>
      fields.map((field, index) => (
        <div key={field.id} className="my-2 flex items-center space-x-2">
          <FormField
            control={form.control}
            name={`autoOfferDiscountTiers.${index}.days`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      field.onChange(value);
                      const currentValues = form.getValues();
                      setHasUnsavedChanges(checkForChanges(currentValues));
                    }}
                    className="w-20"
                    min="0"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span>days before check-in:</span>
          <FormField
            control={form.control}
            name={`autoOfferDiscountTiers.${index}.percentOff`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      field.onChange(value);
                      const currentValues = form.getValues();
                      setHasUnsavedChanges(checkForChanges(currentValues));
                    }}
                    className="w-20"
                    min={MIN_DISCOUNT}
                    max={MAX_DISCOUNT}
                    step="1"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span>% off</span>
          {fields.length > MIN_TIERS && (
            <Button
              type="button"
              onClick={() => {
                remove(index);
                const currentValues = form.getValues();
                setHasUnsavedChanges(checkForChanges(currentValues));
              }}
              variant="ghost"
              className="hover:bg-transparent"
              disabled={isSaving}
            >
              <X />
            </Button>
          )}
        </div>
      )),
    [form, checkForChanges, isSaving],
  );

  // Render
  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Auto-Offer</h2>
        <Switch
          className="data-[state=checked]:bg-primaryGreen"
          checked={form.watch("autoOfferEnabled")}
          onCheckedChange={handleAutoOfferToggle}
          disabled={isSaving}
        />
      </div>
      {form.watch("autoOfferEnabled") && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="discount-tiers">
                <AccordionTrigger disabled={isSaving}>
                  Discount Tiers
                </AccordionTrigger>
                <AccordionContent>
                  {renderDiscountTierFields(fields, remove)}
                  {fields.length < MAX_TIERS && (
                    <Button
                      type="button"
                      onClick={handleAddTier}
                      className="mt-2"
                      variant="outline"
                      disabled={isSaving}
                    >
                      Add Tier
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button type="submit" disabled={!hasUnsavedChanges || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={!hasUnsavedChanges || isSaving}
              >
                Cancel
              </Button>
              
            </div>
            <div>
            <Button
                type="button"
                onClick={handleResetToDefault}
                variant="outline"
                disabled={isSaving}
              >
                Reset to Default
              </Button>
              </div>
            </div>
          </form>
        </Form>
      )}

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
            <AlertDialogCancel onClick={handleCancelReset}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset}>
              Confirm Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              onClick={async () => {
                setShowHighDiscountAlert(false);
                await form.handleSubmit(handleSubmit)();
              }}
            >
              Confirm
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
            <AlertDialogAction onClick={handleConfirmEnableAutoOffer}>
              Enable Auto-Offer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
