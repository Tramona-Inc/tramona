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
import { useState } from "react";
import OnboardingFooter from "./OnboardingFooter";

export default function Onboarding4() {
  const [location, setLocation] = useState({
    country: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    zipcode: "",
  });

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

  return (
    <>
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="mt-10 flex flex-col gap-5">
          <h1 className="text-4xl font-bold">
            Where&apos;s your property located?
          </h1>

          <Select
            value={propertyLocation.country}
            onValueChange={(value) => {
              updateLocation("country", value, setLocationInStore);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Country /region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="United States">United States</SelectItem>
            </SelectContent>
          </Select>

          <div className="rounded-lg border">
            <InputTogether
              className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6"
              placeholder="Street address"
              value={propertyLocation.street}
              onChange={(e) =>
                updateLocation("street", e.target.value, setLocationInStore)
              }
            />
            <InputTogether
              className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6 focus:rounded-none"
              placeholder="Apt, suite, unit (if applicable)"
              value={propertyLocation.apt ?? ""}
              onChange={(e) =>
                updateLocation("apt", e.target.value, setLocationInStore)
              }
            />
            <InputTogether
              className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6 focus:rounded-none"
              placeholder="City / town"
              value={propertyLocation.city}
              onChange={(e) =>
                updateLocation("city", e.target.value, setLocationInStore)
              }
            />
            <InputTogether
              className="border-b-1 rounded-t-lg border-x-0 border-t-0 p-6 focus:rounded-none"
              placeholder="State / territory"
              value={propertyLocation.state}
              onChange={(e) =>
                updateLocation("state", e.target.value, setLocationInStore)
              }
            />
            <InputTogether
              className="rounded-t-lg border-x-0 border-b-0 border-t-0 p-6 focus:rounded-b-lg focus:rounded-t-none"
              placeholder="ZIP code"
              value={propertyLocation.zipcode}
              onChange={(e) =>
                updateLocation("zipcode", e.target.value, setLocationInStore)
              }
            />
          </div>
        </div>
      </div>
      <OnboardingFooter isForm={false} />
    </>
  );
}
