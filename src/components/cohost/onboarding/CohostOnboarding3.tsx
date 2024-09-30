import CardSelect from "@/components/_common/CardSelect";
import Home from "@/components/_icons/Home";
import Room from "@/components/_icons/Room";
import SharedRoom from "@/components/_icons/SharedRoom";
import { Button } from "@/components/ui/button";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { Minus, Plus } from "lucide-react";
import OnboardingFooter from "../../host/onboarding/OnboardingFooter";
import SaveAndExit from "../../host/onboarding/SaveAndExit";
import { useState } from "react";

export const options = [
  {
    id: "Entire place",
    icon: <Home />,
    title: "Entire Place",
    text: "Guests have the whole place to themselves.",
  },
  {
    id: "Private room",
    icon: <Room />,
    title: "Private Room",
    text: "Guests have their own room in a home and access to shared spaces.",
  },
  {
    id: "Shared room",
    icon: <SharedRoom />,
    title: "Shared Room",
    text: "Guests sleep in a room or common area that may be shared with you or others.",
  },
] as const;

export function Total({
  name,
  total,
  setTotal,
}: {
  name: string;
  total: number;
  setTotal: (total: number) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between border-b-2 p-5">
      <h2 className="text-xl font-semibold">{name}</h2>
      <div className="grid max-w-[150px] grid-cols-3 place-items-center">
        <Button
          variant="increment"
          className="text-4xl"
          size={"icon"}
          onClick={() => {
            if (total - 1 > 0) {
              setTotal(total - 1);
            }
          }}
        >
          <Minus color="gray" />
        </Button>
        <div className="text-xl font-semibold">{total}</div>
        <Button
          variant="increment"
          className="text-4xl"
          size={"icon"}
          onClick={() => {
            setTotal(total + 1);
          }}
        >
          <Plus color="gray" />
        </Button>
      </div>
    </div>
  );
}

export default function CohostOnboarding3({ editing = false }) {
  const maxGuests = useHostOnboarding((state) => state.listing.maxGuests);
  const setMaxGuests = useHostOnboarding((state) => state.setMaxGuests);

  const bedrooms = useHostOnboarding((state) => state.listing.bedrooms);
  const setBedrooms = useHostOnboarding((state) => state.setBedrooms);

  const beds = useHostOnboarding((state) => state.listing.beds);
  const setBeds = useHostOnboarding((state) => state.setBeds);

  const bathrooms = useHostOnboarding((state) => state.listing.bathrooms);
  const setBathrooms = useHostOnboarding((state) => state.setBathrooms);

  const spaceType = useHostOnboarding((state) => state.listing.spaceType);
  const setSpaceType = useHostOnboarding((state) => state.setSpaceType);

  const [error, setError] = useState(false);

  function handleError() {
    setError(true);
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mb-5 flex w-full flex-col items-center justify-center gap-5 max-lg:container">
        <div className="mt-10 flex flex-col gap-5">
          <h1 className="text-4xl font-bold">What is the living situation?</h1>

          <div>
            <h3 className="mb-5 text-2xl font-semibold">Type of Space</h3>
            {error && (
              <p className="mb-2 text-red-500">Please select a type of space</p>
            )}
            <div className="mb-5 flex flex-col gap-5">
              {options.map((item) => (
                <CardSelect
                  key={item.title}
                  title={item.title}
                  text={item.text}
                  onClick={() => setSpaceType(item.id)}
                  isSelected={spaceType === item.id}
                >
                  {item.icon}
                </CardSelect>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-2xl font-semibold">Rooms and spaces</h3>
            <div className="mb-5 flex flex-col gap-5">
              <Total
                name={"Maximum guests"}
                total={maxGuests}
                setTotal={setMaxGuests}
              />

              <Total
                name={"Bedrooms"}
                total={bedrooms}
                setTotal={setBedrooms}
              />

              <Total name={"Beds"} total={beds} setTotal={setBeds} />

              <Total
                name={"Bathrooms"}
                total={bathrooms}
                setTotal={setBathrooms}
              />
            </div>
          </div>
        </div>
      </div>
      {!editing && (
        <OnboardingFooter
          isFormValid={spaceType !== "Other"}
          isForm={true}
          handleError={handleError}
        />
      )}
    </>
  );
}
