import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputTogether } from "@/components/ui/input-together";
import {
  type LocationType,
  useHostOnboarding,
} from "@/utils/store/host-onboarding";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import { api } from "@/utils/api";
import SaveAndExit from "./SaveAndExit";
import { useState, useEffect } from "react";
import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";
import CountryDropdown from "@/components/_common/country-dropdown/CountryDropdown";
import { useDropdownStore } from "@/utils/store/dropdown";
import StateDropdown from "@/components/_common/country-dropdown/StatesDropdown";
import { errorToast } from "@/utils/toasts";

const formSchema = z.object({
  country: zodString(),
  street: zodString(),
  apt: z.string().optional(),
  city: zodString(),
  state: zodString(),
  zipcode: zodString(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding4({
  editing = false,
  setHandleOnboarding,
}: {
  editing?: boolean;
  setHandleOnboarding?: (handle: () => void) => void;
}) {
  const [location, setLocation] = useState({
    country: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [address, setAddress] = useState<string>("");

  const isLocationFilled = () => {
    return (
      form.getValues("country") !== "" &&
      form.getValues("street") !== "" &&
      form.getValues("city") !== "" &&
      form.getValues("state") !== "" &&
      form.getValues("zipcode").length > 4
    );
  };

  const updateLocation = (
    field: string,
    value: string,
    setLocationInStore: (location: LocationType) => void,
  ) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      [field]: value,
    }));
    setLocationInStore({ ...location, [field]: value });
  };

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
    if (!coordinateData?.coordinates.location) {
      errorToast("Could not find your location."); // Set error to true if coordinates are not found
      return; // Prevent form submission
    }

    setLocationInStore(location);
  }

  const { countryValue, stateValue } = useDropdownStore();
  useEffect(() => {
    form.setValue("country", countryValue);
    form.setValue("state", stateValue);
  }, [countryValue, stateValue, form]);

  useEffect(() => {
    if (isLocationFilled()) {
      const location: LocationType = {
        country: form.getValues("country"),
        street: form.getValues("street"),
        apt: form.getValues("apt") ?? undefined,
        city: form.getValues("city"),
        state: form.getValues("state"),
        zipcode: form.getValues("zipcode"),
      };
      const addressConversion = `${location.street}${
        location.apt ? `, ${location.apt}` : ""
      }, ${location.city}, ${location.state} ${location.zipcode}, ${
        location.country
      }`;
      setAddress(addressConversion);
    }
    setHandleOnboarding &&
      setHandleOnboarding(() => form.handleSubmit(handleFormSubmit));
  }, [form, countryValue, form.formState]);
  // I couldnt figure out a way for this hook to fire when the for was filled, so you will get console errors
  const { data: coordinateData } = api.offers.getCoordinates.useQuery({
    location: address,
  });

  function handleError(): void {
    setError(!error);
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="mt-10 flex flex-col gap-5">
          <h1 className="text-4xl font-bold">
            Where&apos;s your property located?
          </h1>
          {error && (
            <p className="text-red-500">Please fill out all required fields</p>
          )}
          <Form {...form}>
            <div className="flex flex-col gap-y-1">
              <CountryDropdown />
              <StateDropdown />
            </div>

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
          {coordinateData ? (
            <div className="relative mb-10 h-[400px]">
              <div className="absolute inset-0 z-0">
                <SingleLocationMap
                  lat={coordinateData.coordinates.location!.lat}
                  lng={coordinateData.coordinates.location!.lng}
                />
              </div>
            </div>
          ) : (
            <div className="h-[400px]"></div>
          )}
        </div>
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
