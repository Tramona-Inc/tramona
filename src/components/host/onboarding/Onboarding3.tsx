import CardSelect from "@/components/_common/CardSelect";
import Home from "@/components/_icons/Home";
import Room from "@/components/_icons/Room";
import SharedRoom from "@/components/_icons/SharedRoom";
import { Button } from "@/components/ui/button";
import { SpaceType, useHostOnboarding } from "@/utils/store/host-onboarding";
import { Minus, Plus } from "lucide-react";
import OnboardingFooter from "./OnboardingFooter";

const options = [
  {
    id: "entire" as SpaceType,
    icon: <Home />,
    title: "Apartment",
    text: "Guests have the whole place to themselves.",
  },
  {
    id: "single room" as SpaceType,
    icon: <Room />,
    title: "Home",
    text: "Guests have their own room in a home and access to shared spaces.",
  },
  {
    id: "shared room" as SpaceType,
    icon: <SharedRoom />,
    title: "Hotels, B&Bs, & More",
    text: "Guests sleep in a room or common area that may be shared with you or others.",
  },
];

function Total({
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

export default function Onboarding3() {
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

  return (
    <>
      <div className="mb-5 flex w-full flex-col items-center justify-center gap-5 max-lg:container">
        <div className="mt-10 flex flex-col gap-5">
          <h1 className="text-4xl font-bold">What is the living situation?</h1>

          <div>
            <h3 className="mb-5 text-2xl font-semibold">Type of Space</h3>
            <div className="mb-5 flex flex-col gap-5">
              {options.map((item) => (
                <CardSelect
                  key={item.title}
                  title={item.title}
                  text={item.text}
                  hover={true}
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
      <OnboardingFooter isForm={false} />
    </>
  );
}
