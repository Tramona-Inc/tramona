import { Form, FormField, FormItem } from "@/components/ui/form";
import { ALL_CANCELLATION_POLICIES } from "@/server/db/schema";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { useState } from "react";
import { cn } from "@/utils/utils";
import CancellationCardSelect from "@/components/_common/CancellationCardSelect";

export const options = [
  {
    id: "Flexible",
    title: "Flexible",
    text: `Full Refund: Guests can get a full refund if they cancel at least 24 hours before check-in.
Partial Refund: If they cancel less than 24 hours before check-in, the first night is non-refundable, but the rest of the nights will be refunded.
During Stay: If guests decide to leave early, they will get a refund for the remaining nights.`,
  },
  {
    id: "Firm",
    title: "Firm",
    text: `Full Refund: Guests receive a full refund if they cancel at least 30 days before check-in.
Partial Refund: If they cancel between 7 and 30 days before check-in, they receive a 50% refund of the booking cost.
No Refund: If they cancel less than 7 days before check-in, no refund is provided.
During Stay: Guests do not receive a refund for the remaining nights if they decide to leave early.`,
  },
  {
    id: "Moderate",
    title: "Moderate",
    text: `Full Refund: Guests can get a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.
Partial Refund: If they cancel at least 7 days before check-in, they get a 50% refund of the booking cost.
No Refund: If they cancel less than 7 days before check-in, they will not receive a refund.
During Stay: If guests decide to leave early, they will not get a refund for the remaining nights.`,
  },
  {
    id: "Strict",
    title: "Strict",
    text: `Full Refund: Guests receive a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.
Partial Refund: If they cancel at least 7 days before check-in, they receive a 50% refund of the booking cost.
No Refund: If they cancel less than 7 days before check-in, no refund is provided.
During Stay: Guests do not receive a refund for the remaining nights if they decide to leave early.`,
  },
  {
    id: "Super Strict 30 Days",
    title: "Super Strict 30 Days",
    text: `Full Refund: Guests can get a full refund if they cancel within 48 hours of booking and at least 30 days before check-in.
Partial Refund: If they cancel at least 30 days before check-in, they get a 50% refund of the booking cost.
No Refund: If they cancel less than 30 days before check-in, they will not receive a refund.`,
  },
  {
    id: "Super Strict 60 Days",
    title: "Super Strict 60 Days",
    text: `Full Refund: Guests can get a full refund if they cancel within 48 hours of booking and at least 60 days before check-in.
Partial Refund: If they cancel at least 60 days before check-in, they get a 50% refund of the booking cost.
During Stay: If they cancel less than 60 days before check-in, they will not receive a refund.`,
  },
  {
    id: "Long Term",
    title: "Long Term",
    text: `First Month: Guests must cancel at least 30 days before check-in to get a full refund of the first month.
Partial Refund: If they cancel less than 30 days before check-in, they get a 50% refund of the first month.
After Check-In: If they cancel during their stay, the next 30 days are non-refundable.`,
  },
] as const;

// ! Honeslty didn't need to do a form

const formSchema = z.object({
  cancellationPolicy: z.enum(ALL_CANCELLATION_POLICIES),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding10({ editing = false }) {
  const cancellationPolicy = useHostOnboarding(
    (state) => state.listing.cancellationPolicy,
  );
  const setCancellationPolicy = useHostOnboarding(
    (state) => state.setCancellationPolicy,
  );
  const [error, setError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cancellationPolicy: "Flexible",
    },
  });

  async function handleFormSubmit() {
    setCancellationPolicy(cancellationPolicy);
  }

  function handleError() {
    setError(true);
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mx-auto mb-10 max-w-3xl space-y-5">
        <h1
          className={`text-4xl font-bold ${cn(editing && "text-center text-xl")}`}
        >
          Please choose your cancellation policy
        </h1>
        {error && (
          <p className="text-red-500">Please select a cancellation policy</p>
        )}

        <Form {...form}>
          <FormField
            control={form.control}
            name="cancellationPolicy"
            render={() => (
              <FormItem>
                <div className="mx-auto max-w-lg space-y-4">
                  {options.map((item) => (
                    <CancellationCardSelect
                      key={item.title}
                      title={item.title}
                      text={item.text}
                      onClick={() => setCancellationPolicy(item.id)}
                      isSelected={cancellationPolicy === item.id}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </Form>
      </div>
      {!editing && (
        <OnboardingFooter
          handleNext={form.handleSubmit(handleFormSubmit)}
          isFormValid={form.formState.isValid}
          isForm={true}
          handleError={handleError}
        />
      )}
    </>
  );
}
