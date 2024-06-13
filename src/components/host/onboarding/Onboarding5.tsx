import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { cn } from "@/utils/utils";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  checkIn: zodString({ maxLen: 100 }),
  checkOut: zodString({ maxLen: 100 }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Onboarding5({ editing = false }) {
  const otherCheckInType = useHostOnboarding(
    (state) => state.listing.otherCheckInType,
  );

  const setOtherCheckInType = useHostOnboarding(
    (state) => state.setOtherCheckInType,
  );

  const checkInType = useHostOnboarding((state) => state.listing.checkInType);
  const setCheckInType = useHostOnboarding((state) => state.setCheckInType);

  const handleRadioChange = (value: string) => {
    if (value === "self" || value === "host") {
      setOtherCheckInType(false);
      setCheckInType(value); // Set check-in type for other options
    } else {
      setOtherCheckInType(true);
      setCheckInType(""); // Clear check-in type when "Other" is selected
    }
  };

  const checkIn = useHostOnboarding((state) => state.listing.checkIn);
  const checkOut = useHostOnboarding((state) => state.listing.checkOut);
  const setCheckIn = useHostOnboarding((state) => state.setCheckIn);
  const setCheckOut = useHostOnboarding((state) => state.setCheckOut);

  const [error, setError] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkIn: checkIn,
      checkOut: checkOut,
    },
  });

  async function handleFormSubmit(values: FormSchema) {
    setCheckIn(values.checkIn);
    setCheckOut(values.checkOut);
  }

  function handleError() {
    setError(true);
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="mt-10 flex flex-col gap-10">
          <h1 className="text-4xl font-bold">
            How will your guest check-in / out?
          </h1>

          <div className="flex flex-col gap-5">
            <RadioGroup
              defaultValue={otherCheckInType ? "other" : checkInType}
              onValueChange={handleRadioChange}
            >
              <div className="flex items-center space-x-2 rounded-lg border p-5">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self">
                  <h2 className="mb-2 text-lg font-bold">
                    Self check-in / out
                  </h2>
                  <p className="text-muted-foreground">
                    Guests can check in and out by themselves
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-5">
                <RadioGroupItem value="host" id="host" />
                <Label htmlFor="meet">
                  <h2 className="text-lg font-bold">Meet host at door</h2>
                  <p className="text-muted-foreground">
                    Guests get the keys from you when they arrive at the
                    property
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-5">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="option-two" className="text-lg font-bold">
                  Other
                </Label>
              </div>
            </RadioGroup>

            <div>
              <p
                className={cn(
                  !otherCheckInType && "text-muted-foreground",
                  "mb-2 text-sm font-semibold",
                )}
              >
                Other: please specify here
              </p>
              <Input
                type="text"
                disabled={!otherCheckInType}
                value={otherCheckInType ? checkInType : ""}
                onChange={(e) => setCheckInType(e.target.value)}
              />
              {/* //TODO display the character count */}
            </div>
          </div>

          <Form {...form}>
            <div className="mt-5 w-full">
              <h1 className="mb-2 text-xl font-bold">Hours</h1>
              {error && (
                <p className="text-red-500">
                  Please include both a check in and check out time
                </p>
              )}
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="font-semibold ">Check in</Label>
                      <Input
                        {...field}
                        type="time"
                        placeholder="Check in time"
                        className="p-5"
                      />
                      <FormMessage>
                        {form.formState.errors.checkIn?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="font-semibold">Check out</Label>
                      <Input
                        {...field}
                        type="time"
                        placeholder="Check out time"
                        className="p-5"
                      />
                      <FormMessage>
                        {form.formState.errors.checkOut?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
      {!editing ? (
        <OnboardingFooter
          handleNext={form.handleSubmit(handleFormSubmit)}
          isFormValid={form.formState.isValid}
          isForm={true}
          handleError={handleError}
        />
      ) : (
        <Button onClick={form.handleSubmit(handleFormSubmit)}>Save</Button>
      )}
    </>
  );
}
