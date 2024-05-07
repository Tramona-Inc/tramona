import CardSelect from "@/components/_common/CardSelect";
import AssistedListing from "@/components/_icons/AssistedListing";
import ManuallyAdd from "@/components/_icons/ManuallyAdd";
import { useRouter } from "next/router";
import Image from "next/image";
import OnboardingFooter from "./OnboardingFooter";
import { on } from "events";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";

export default function Onboarding1({
  onPressNext,
}: {
  onPressNext: () => void;
}) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const items = [
    {
      id: "1",
      icon: <ManuallyAdd />,
      title: "Manually Add",
      text: "Complete a simple step-by-step process to add your property information",
      onClick: onPressNext,
    },
    {
      id: "2",
      icon: <AssistedListing />,
      title: "Assisted Listing",
      text: "Have the Tramona onboarding team set up my account.",
      onClick: openModal,
    },
  ];

  const handleCalendlyLink = () => {
    <iframe
      title="Calendly Scheduler"
      src="http://calendly.com/tramona"
      style={{
        width: "100%",
        height: "800px",
        border: "0",
      }}
    ></iframe>;
    // Handle the Calendly link here
    // Close the modal
    closeModal();
    // Navigate to "/host" route
    void router.push("/host");
  };

  return (
    <>
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

        <div className="flex flex-col items-center justify-center sm:mx-20">
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
                onClick={item.onClick}
              >
                {item.icon}
              </CardSelect>
            ))}
          </div>
        </div>
      </div>

      <OnboardingFooter isForm={false} />
      <Dialog open={showModal} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center">
          <p>Click the button below to schedule a meeting:</p>
          {/* Button to open the Calendly link */}
          <button onClick={handleCalendlyLink}>Schedule Meeting</button>
        </div>
      </Dialog>
    </>
  );
}
