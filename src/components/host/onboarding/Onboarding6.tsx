import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";

const kitchenItems = [
  {
    id: "Stove",
    content: "Stove",
  },
  {
    id: "Refrigerator",
    content: "Refrigerator",
  },
  {
    id: "Microwave",
    content: "Microwave",
  },
  {
    id: "Oven",
    content: "Oven",
  },
  {
    id: "Freezer",
    content: "Freezer",
  },
  {
    id: "Dishwasher",
    content: "Dishwasher",
  },
  {
    id: "Dishes and silverware",
    content: "Dishes & silverware",
  },
  {
    id: "Dining table and chairs",
    content: "Dining Table & Chairs",
  },
  {
    id: "Coffee maker",
    content: "Coffee Maker",
  },
];

const livingRoomItems = [
  {
    id: "TV",
    content: "TV",
  },
  {
    id: "Couch",
    content: "Couch",
  },
];

const heatingAndCoolingItems = [
  {
    id: "Heating",
    content: "Heating",
  },
  {
    id: "Air conditioning",
    content: "Air Conditioning",
  },
];

const laundryItems = [
  {
    id: "Washer",
    content: "Washer",
  },
  {
    id: "Dryer",
    content: "Dryer",
  },
];

const parkingItems = [
  {
    id: "Street Parking",
    content: "Street Parking",
  },
  {
    id: "Garage Parking",
    content: "Garage Parking",
  },
  {
    id: "Ev charging",
    content: "EV charging",
  },
  {
    id: "Driveway parking",
    content: "Driveway parking",
  },
];

type CheckboxSelectProps = {
  id: string;
  content: string;
};

function OtherBox({ item }: { item: string }) {
  const removeOtherAmenity = useHostOnboarding(
    (state) => state.removeOtherAmenity,
  );

  return (
    <div className="flex flex-row items-center justify-between gap-2 rounded-lg border p-3">
      <p className="text-sm font-bold capitalize sm:text-base">{item}</p>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => removeOtherAmenity(item)}
      >
        <Trash color={"red"} size={20} />
      </Button>
    </div>
  );
}

function CheckboxSelect({
  item,
  isSelected,
}: {
  item: CheckboxSelectProps;
  isSelected: boolean;
}) {
  const setAmenity = useHostOnboarding((state) => state.setAmenity);
  const removeAmenity = useHostOnboarding((state) => state.removeAmenity);

  return (
    <div className="flex flex-row items-center gap-2 rounded-lg border p-3">
      <Checkbox
        id={item.id}
        defaultChecked={isSelected}
        onCheckedChange={(checked) => {
          return checked ? setAmenity(item.id) : removeAmenity(item.id);
        }}
      />
      <p className="text-sm font-bold sm:text-base">{item.content}</p>
    </div>
  );
}

export default function Onboarding6({
  editing = false,
  setHandleOnboarding,
}: {
  editing?: boolean;
  setHandleOnboarding: (handle: () => void) => void;
}) {
  const amenities: string[] = useHostOnboarding(
    (state) => state.listing.amenities,
  );

  const otherAmenities: string[] = useHostOnboarding(
    (state) => state.listing.otherAmenities,
  );

  const setOtherAmenity = useHostOnboarding((state) => state.setOtherAmenity);

  const [otherValue, setOtherValue] = useState("");
  const [error, setError] = useState(false);

  function handleAddOther() {
    if (!otherAmenities.includes(otherValue.toLocaleLowerCase())) {
      if (otherValue !== "") {
        setOtherAmenity(otherValue.toLocaleLowerCase());
        setOtherValue("");
        setError(false);
      }
    } else {
      setError(true);
      setOtherValue("");
    }
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="my-20 flex flex-col gap-10">
          <h1 className="text-4xl font-bold">What amenities do you offer?</h1>

          <div>
            <h3 className="mb-5 text-2xl font-semibold">Kitchen</h3>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {kitchenItems.map((item) => (
                <CheckboxSelect
                  key={item.id}
                  item={item}
                  isSelected={amenities.includes(item.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-2xl font-semibold">Living room</h3>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {livingRoomItems.map((item) => (
                <CheckboxSelect
                  key={item.id}
                  item={item}
                  isSelected={amenities.includes(item.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-2xl font-semibold"> Heating & cooling</h3>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {heatingAndCoolingItems.map((item) => (
                <CheckboxSelect
                  key={item.id}
                  item={item}
                  isSelected={amenities.includes(item.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-2xl font-semibold">Laundry</h3>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {laundryItems.map((item) => (
                <CheckboxSelect
                  key={item.id}
                  item={item}
                  isSelected={amenities.includes(item.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-2xl font-semibold">Parking</h3>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {parkingItems.map((item) => (
                <CheckboxSelect
                  key={item.id}
                  item={item}
                  isSelected={amenities.includes(item.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold">Other</h3>
            <p className="text-muted-foreground">
              Specify additional amenities you want to highlight.
            </p>
            <div className="grid grid-cols-4 gap-5">
              <div className="col-span-3">
                <Input
                  placeholder="Other amenity"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddOther();
                    }
                  }}
                />
              </div>

              <Button
                onClick={() => {
                  handleAddOther();
                }}
              >
                <Plus />
              </Button>
            </div>
            <div>
              {error && (
                <p className="text-red-500">Please no duplicate values</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {otherAmenities.map((item, index) => (
                <OtherBox key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {!editing && <OnboardingFooter isForm={false} />}
    </>
  );
}
