import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { cn } from "@/utils/utils";
import { zodUrl } from "@/utils/zod-utils";
import { useZodForm } from "@/utils/useZodForm";
import { Input } from "@/components/ui/input";
import { getOriginalListing } from "@/utils/listing-sites";
import { useState } from "react";
import { Airbnb } from "@/utils/listing-sites/Airbnb";

// TODO: use zodListingUrl (adds other sites), store url in form state instead of listing id/site

async function parseAirbnbListingUrl(url: string) {
  url = (await Airbnb.expandUrl!(url))!;
  const pathname = new URL(url).pathname;

  if (pathname.startsWith("/rooms")) return pathname.split("/")[2]!;
  if (pathname.startsWith("/hosting/listings")) return pathname.split("/")[3]!;
  throw new Error("Invalid Airbnb listing URL");
}

const formSchema = z.object({
  url: zodUrl().startsWith("https://www.airbnb.com/", {
    message: "Must be an Airbnb URL",
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
    const listingId = await parseAirbnbListingUrl(url);
    console.log(listingId);

    setOriginalListingId(listingId);
    setOriginalListingPlatform("Airbnb");
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
            className={cn(
              "text-center text-2xl font-bold",
              editing && "text-xl",
            )}
          >
            Please enter the Airbnb link of your listing
          </h1>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      autoFocus
                      {...field}
                      placeholder="https://www.airbnb.com/..."
                      inputMode="url"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <section>
            <h2 className="font-bold">Valid URLS:</h2>
            <ul className="list-disc pl-5 text-sm font-medium text-muted-foreground [&_b]:text-foreground">
              <li>
                https://www.airbnb.com<b>/rooms/</b>...
              </li>
              <li>
                https://www.airbnb.com<b>/hosting/listings/</b>...
              </li>
              <li>
                https://www.airbnb.com<b>/slink/</b>...
              </li>
            </ul>
          </section>
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
