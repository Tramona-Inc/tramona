import Header from "@/components/_common/Header";
import AssistedListing from "@/components/_icons/AssistedListing";
import ManuallyAdd from "@/components/_icons/ManuallyAdd";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const items = [
  {
    icon: <ManuallyAdd />,
    title: "Manually Add",

    text: "Complete a simple step-by-step process to add your property information",
  },
  {
    icon: <AssistedListing />,
    title: "Assisted Listing",
    text: "Have the Tramona onboarding team set up my account.",
  },
];

function CardSelect({
  children,
  title,
  text,
}: {
  children: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-row items-center gap-5 rounded-[12px] border-[2px] p-5 sm:p-8 lg:p-10">
      <div className="flex w-16 justify-center">{children}</div>
      <div>
        <h1 className="font-semibold md:text-2xl">{title}</h1>
        <p className="text-sm text-muted-foreground md:text-lg">{text}</p>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <>
      <Header type="dashboard" sidebarType={"host"} />
      <div className="flex min-h-screen-minus-header flex-col">
        <div className="w-full flex-grow max-sm:container lg:grid lg:grid-cols-2">
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
                <CardSelect
                  key={item.title}
                  title={item.title}
                  text={item.text}
                >
                  {item.icon}
                </CardSelect>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t-[5px] flex justify-end p-10">
          <Button>Get Started</Button>
        </div>
      </div>
    </>
  );
}
