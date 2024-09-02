import { Form, FormField, FormItem } from "@/components/ui/form";
import { CANCELLATION_POLICIES } from "@/server/db/schema";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { useState } from "react";
import { cn } from "@/utils/utils";
import CancellationCardSelect from "@/components/_common/CancellationCardSelect";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";

const formSchema = z.object({
  cancellationPolicy: z.enum(CANCELLATION_POLICIES),
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
                  {CANCELLATION_POLICIES.map((policy) => (
                    <CancellationCardSelect
                      key={policy}
                      policy={policy}
                      text={getCancellationPolicyDescription(policy)}
                      onClick={() => setCancellationPolicy(policy)}
                      isSelected={cancellationPolicy === policy}
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
