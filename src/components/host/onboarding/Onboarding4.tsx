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
import { api } from "@/utils/api";
import SaveAndExit from "./SaveAndExit";
import { useState, useEffect } from "react";
import { SelectIcon } from "@radix-ui/react-select";
import { CaretSortIcon } from "@radix-ui/react-icons";
import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";

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

    setLocationInStore(location);
  }
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
  }, [form.formState]);
  // I couldnt figure out a way for this hook to fire when the for was filled, so you will get console errors
  const { data: coordinateData } = api.offers.getCoordinates.useQuery({
    location: address,
  });

  function handleError(): void {
    throw new Error("Function not implemented.");
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
                      <SelectIcon>
                        <CaretSortIcon className="h-4 w-4 opacity-50" />
                      </SelectIcon>
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
          {coordinateData && (
            <div className="relative mb-10 h-[400px]">
              <div className="absolute inset-0 z-0">
                <SingleLocationMap
                  lat={coordinateData.coordinates.lat}
                  lng={coordinateData.coordinates.lng}
                />
              </div>
            </div>
          )}
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
