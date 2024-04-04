import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const kitchenItems = [
  {
    id: "stove",
    content: "Stove",
  },
  {
    id: "refrigerator",
    content: "Refrigerator",
  },
  {
    id: "microwave",
    content: "Microwave",
  },
  {
    id: "oven",
    content: "Oven",
  },
  {
    id: "freezer",
    content: "Freezer",
  },
  {
    id: "dishwasher",
    content: "Dishwasher",
  },
  {
    id: "dishes & silverwarr",
    content: "Dishes & silverware",
  },
  {
    id: "dining table & chairs",
    content: "Dining Table & Chairs",
  },
  {
    id: "coffee maker",
    content: "Coffee Maker",
  },
];

const livingRoomItems = [
  {
    id: "tv",
    content: "TV",
  },
  {
    id: "couch",
    content: "Couch",
  },
];

const heatingAndCoolingItems = [
  {
    id: "heating",
    content: "Heating",
  },
  {
    id: "air conditioning",
    content: "Air Conditioning",
  },
];

const laundryItems = [
  {
    id: "washer",
    content: "Washher",
  },
  {
    id: "dryer",
    content: "Dryer",
  },
];

const parkingItems = [
  {
    id: "street parking",
    content: "Washher",
  },
  {
    id: "garage parking",
    content: "Garage Parking",
  },
  {
    id: "ev charging",
    content: "EV charging",
  },
  {
    id: "driveway parking",
    content: "Driveway parking",
  },
];

type CheckboxSelectProps = {
  id: string;
  content: string;
};

function CheckboxSelect({ item }: { item: CheckboxSelectProps }) {
  return (
    <div className="flex flex-row items-center gap-2 rounded-lg border p-3">
      <Checkbox id={item.id} />
      <p className="text-xl font-bold">{item.content}</p>
    </div>
  );
}

export default function Onboarding6() {
  return (
    <div className="mb-5 flex w-full flex-col items-center justify-center gap-5 max-lg:container">
      <div className="my-20 flex flex-col gap-10">
        <h1 className="text-4xl font-bold">What amenities do you offer?</h1>

        <div>
          <h3 className="mb-5 text-2xl font-semibold">Kitchen</h3>
          <div className="grid grid-cols-3 gap-5">
            {kitchenItems.map((item) => (
              <CheckboxSelect key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-2xl font-semibold">Living room</h3>
          <div className="grid grid-cols-3 gap-5">
            {livingRoomItems.map((item) => (
              <CheckboxSelect key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-2xl font-semibold"> Heating & cooling</h3>
          <div className="grid grid-cols-3 gap-5">
            {heatingAndCoolingItems.map((item) => (
              <CheckboxSelect key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-2xl font-semibold">Laundry</h3>
          <div className="grid grid-cols-3 gap-5">
            {laundryItems.map((item) => (
              <CheckboxSelect key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-2xl font-semibold">Internet & office</h3>
          <div className="grid grid-cols-3 gap-5">
            {laundryItems.map((item) => (
              <CheckboxSelect key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-2xl font-semibold">Parking</h3>
          <div className="grid grid-cols-3 gap-5">
            {parkingItems.map((item) => (
              <CheckboxSelect key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Other</h3>
          <p className="text-muted-foreground">
            Specify additional amenities you want to highlight.
          </p>

          <Textarea />
        </div>
      </div>
    </div>
  );
}
