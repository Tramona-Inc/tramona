import { Form, FormField, FormItem } from "@/components/ui/form";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { cn } from "@/utils/utils";
import { zodUrl } from "@/utils/zod-utils";
import { useZodForm } from "@/utils/useZodForm";
import { Input } from "@/components/ui/input";
import { getOriginalListing, parseListingUrl } from "@/utils/listing-sites";
import { useState } from "react";

// TODO: use zodListingUrl (adds other sites), store url in form state instead of listing id/site

const formSchema = z.object({
  url: zodUrl().startsWith("https://www.airbnb.com/rooms", {
    message: "Link must start with https://www.airbnb.com/rooms",
  }),
});

export default function OnboardingLinkInput({ editing = false }) {
  const [error, setError] = useState(false);

  const originalListingId = useHostOnboarding(
    (state) => state.listing.originalListingId,
  );

  const setOriginalListingId = useHostOnboarding(
    (state) => state.setOriginalListingId,
  );

  // add back when we support more than just airbnb

  // const originalListingPlatform = useHostOnboarding(
  //   (state) => state.listing.originalListingPlatform,
  // );

  const setOriginalListingPlatform = useHostOnboarding(
    (state) => state.setOriginalListingPlatform,
  );

  const setAirbnbUrl = useHostOnboarding((state) => state.setAirbnbUrl);

  const curUrl =
    getOriginalListing({
      originalListingId: originalListingId ?? null,
      originalListingPlatform: "Airbnb",
    })?.getListingUrl({}) ?? undefined;

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      url: curUrl,
    },
  });

  const onSubmit = form.handleSubmit(async ({ url }) => {
    console.log(url);
    const { Site, listingId } = parseListingUrl(url); // site will always be airbnb for now
    setOriginalListingId(listingId);
    setOriginalListingPlatform(Site.siteName);
    setAirbnbUrl(url);
  });

  const handleError = () => {
    setError(!error);
  };

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="container my-10 flex flex-grow flex-col justify-center">
        <div className="mx-auto mb-10 max-w-3xl space-y-5">
          <h1
            className={`text-4xl font-bold ${cn(editing && "text-center text-xl")}`}
          >
            Please enter the Airbnb link of your listing
          </h1>
          {error && (
            <p className="text-sm text-red-500">
              Please fill out the required field
            </p>
          )}
          <Form {...form}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <Input
                    autoFocus
                    {...field}
                    placeholder="https://www.airbnb.com/rooms/..."
                    inputMode="url"
                  />
                </FormItem>
              )}
            />
          </Form>
        </div>
      </div>

      {!editing && (
        <OnboardingFooter
          handleNext={onSubmit}
          isFormValid={form.formState.isValid}
          isForm={true}
          handleError={handleError}
        />
      )}
    </>
  );
}
