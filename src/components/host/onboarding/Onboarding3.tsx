import CardSelect from "@/components/_common/CardSelect";
import Home from "@/components/_icons/Home";
import Room from "@/components/_icons/Room";
import SharedRoom from "@/components/_icons/SharedRoom";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const options = [
  {
    id: "entire",
    icon: <Home />,
    title: "Apartment",
    text: "Guests have the whole place to themselves.",
  },
  {
    id: "single room",
    icon: <Room />,
    title: "Home",
    text: "Guests have their own room in a home and access to shared spaces.",
  },
  {
    id: "shared room",
    icon: <SharedRoom />,
    title: "Hotels, B&Bs, & More",
    text: "Guests sleep in a room or common area that may be shared with you or others.",
  },
];

export default function Onboarding3() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 max-lg:container">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-bold">What is the living situation?</h1>

        <div>
          <h3 className="mb-5 text-2xl font-semibold">Type of Space</h3>
          <div className="mb-5 flex flex-col gap-5">
            {options.map((item) => (
              <CardSelect key={item.title} title={item.title} text={item.text}>
                {item.icon}
              </CardSelect>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-2xl font-semibold">Rooms and spaces</h3>
          <div className="mb-5 flex flex-col gap-5">
            <Button variant="increment" className="text-4xl" size={"icon"}>
              <Minus color="gray" />
            </Button>
            <Button variant="increment" className="text-4xl" size={"icon"}>
              <Plus color="gray" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
