import CardSelect from "@/components/_common/CardSelect";
import AssistedListing from "@/components/_icons/AssistedListing";
import ManuallyAdd from "@/components/_icons/ManuallyAdd";
import Image from "next/image";

const items = [
  {
    id: "1",
    icon: <ManuallyAdd />,
    title: "Manually Add",
    text: "Complete a simple step-by-step process to add your property information",
  },
  {
    id: "2",
    icon: <AssistedListing />,
    title: "Assisted Listing",
    text: "Have the Tramona onboarding team set up my account.",
  },
];

export default function Onboarding1() {
  return (
    <div className="w-full max-sm:container lg:grid lg:grid-cols-2">
      <div className="hidden flex-grow bg-muted lg:block">
        <Image
          src="/assets/images/host-onboarding.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-32 flex flex-col sm:mx-20">
        <h1 className="mb-16 flex flex-col text-4xl font-semibold">
          It&apos;s easy to list your
          <span>property on Tramona</span>
        </h1>

        <div className="flex flex-col gap-10">
          {items.map((item) => (
            <CardSelect key={item.title} title={item.title} text={item.text}>
              {item.icon}
            </CardSelect>
          ))}
        </div>
      </div>
    </div>
  );
}
