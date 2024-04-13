import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputTogether } from "@/components/ui/input-together";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type LocationType,
  useHostOnboarding,
} from "@/utils/store/host-onboarding";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { useState } from "react";

const formSchema = z.object({
  country: zodString(),
  street: zodString(),
  apt: z.string().optional(),
  city: zodString(),
  state: zodString(),
  zipcode: zodString(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding4() {
  const propertyLocation = useHostOnboarding((state) => state.listing.location);
  const setLocationInStore = useHostOnboarding((state) => state.setLocation);

  const [error, setError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: propertyLocation.country,
      street: propertyLocation.street,
      apt: propertyLocation.apt ?? undefined,
      city: propertyLocation.city,
      state: propertyLocation.state,
      zipcode: propertyLocation.zipcode,
    },
  });

  async function handleFormSubmit(values: FormValues) {
    const location: LocationType = {
      country: values.country,
      street: values.street,
      apt: values.apt ?? undefined,
      city: values.city,
      zipcode: values.zipcode,
      state: values.state,
    };

    setLocationInStore(location);
  }

  function handleError() {
    setError(true);
  }

  return (
    <>
      <SaveAndExit />
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="mt-10 flex flex-col gap-5">
          <h1 className="text-4xl font-bold">
            Where&apos;s your property located?
          </h1>
          {error && (
            <p className="text-red-500">Please fill out all required fields</p>
          )}

          <Form {...form}>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Country /region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">
                        United States
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="rounded-lg border">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <InputTogether
                      className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6"
                      placeholder="Street address"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apt"
                render={({ field }) => (
                  <FormItem>
                    <InputTogether
                      className="border-b-1 border-x-0 border-t-0 p-6"
                      placeholder="Apt, suite, unit (if applicable)"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <InputTogether
                      className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6 focus:rounded-none"
                      placeholder="City / town"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <InputTogether
                      className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6 focus:rounded-none"
                      placeholder="State / territory"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormMessage />
                    <InputTogether
                      className="rounded-t-lg border-x-0 border-b-0 border-t-0 p-6 focus:rounded-b-lg focus:rounded-t-none"
                      placeholder="ZIP code"
                      {...field}
                    />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </div>
      </div>
      <OnboardingFooter
        handleNext={form.handleSubmit(handleFormSubmit)}
        isFormValid={form.formState.isValid}
        isForm={true}
        handleError={handleError}
      />
    </>
  );
}
