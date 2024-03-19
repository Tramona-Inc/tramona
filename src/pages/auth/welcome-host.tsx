import Head from "next/head";
import { useRouter } from "next/router";

import Undone from "@/components/_icons/UndoneIcon";
import OfferCard from "@/components/offer-card/OfferCard";
import { liveFeedOffers } from "@/components/offer-card/data";
import { Button } from "@/components/ui/button";
import type { StepperConfig } from "@/components/ui/stepper";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { useStepper } from "@/components/ui/use-stepper";

import { cn, sleep } from "@/utils/utils";
import ReferralCodeDialog from "@/components/sign-up/ReferralCodeDialog";

function StepperContentLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | null;
}): JSX.Element {
  return (
    <div className={cn("mt-5 flex flex-col gap-4 self-center", className)}>
      {children}
    </div>
  );
}

function Step1(): JSX.Element {
  return (
    <StepperContentLayout className="container gap-4 text-balance">
      <div className="flex flex-col gap-10 text-center my-3">
        <h1 className="text-4xl font-bold lg:text-5xl">
          Welcome Hosts!
        </h1>
        <p className="text-xl font-bold lg:text-2xl">
          Tramona is a website that helps you fill your vacancies
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 text-pretty lg:gap-4 bg-zinc-100 border-0 rounded-md py-8">
        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <p className="h-10 w-10 rounded-full border flex items-center justify-center text-white font-semibold bg-black text-2xl">1</p>
          </div>
          <p className="font-medium lg:text-lg">
            Travelers come to us and tell us how much they want to spend and where they want to go.
          </p>
        </div>

        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <p className="h-10 w-10 rounded-full border flex items-center justify-center text-white font-semibold bg-black text-2xl">2</p>
          </div>
          <p className="font-medium lg:text-lg">
            In your host dashboard, you can see requests of people wanting to travel in your area.
          </p>
        </div>

        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <p className="h-10 w-10 rounded-full border flex items-center justify-center text-white font-semibold bg-black text-2xl">3</p>
          </div>
          <p className="font-medium lg:text-lg">
            You can then respond to that traveler and accept, deny, or counter their request.
          </p>
        </div>
      </div>
    </StepperContentLayout>
  );
}

function Step2(): JSX.Element {

  return (
    <StepperContentLayout className="container gap-4 text-balance">
        <div className="flex flex-col gap-10 text-center">
          <h1 className="text-4xl font-bold lg:text-5xl">Get guest bookings with ease</h1>
          <p className="text-lg font-bold lg:text-2xl">
            It is as simple as inputting your property info and receiving offers from guests looking to travel to your city!
          </p>
        </div>
    </StepperContentLayout>
  );
}

function Step3(): JSX.Element {
  const offers = liveFeedOffers
    .filter((offer) => offer.discountPercent > 30)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 3);

  return (
    <StepperContentLayout className="container gap-4 text-balance text-center">
      <h1 className="text-4xl font-bold lg:text-5xl">Do you know other hosts?</h1>
      <div className="my-4 self-center font-medium lg:max-w-[600px]">
        <p className="text-xl lg:text-2xl font-bold">
          Refer friends to Tramona and get 30% of what we make for up to a year of their bookings!
        </p>
      </div>
      <div className="my-4 flex min-w-full flex-1 flex-col space-y-4 self-center rounded-3xl bg-primary p-4 md:min-w-[400px] lg:min-w-[500px] xl:min-w-[600px]">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </StepperContentLayout>
  );
}

const steps = [
  { label: "", icon: <Undone />, children: <Step1 /> },
  { label: "", icon: <Undone />, children: <Step2 /> },
  { label: "", icon: <Undone />, children: <Step3 /> },
] satisfies StepperConfig[];

export default function Welcome() {
  const { nextStep, activeStep, isLastStep } = useStepper({
    initialStep: 0,
    steps,
  });

  const router = useRouter();

  const startExploring = () => {
    nextStep();
    sleep(1500)
      .then(() => router.push("/"))
      .catch(() => {
        return;
      });
  };

  return (
    <>
      <Head>
        <title>Welcome | Tramona</title>
      </Head>

      <ReferralCodeDialog />

      <div className="mx-auto flex w-full flex-col gap-4 px-5 py-10 lg:px-80">
        <Stepper activeStep={activeStep} responsive={false}>
          {steps.map((step, index) => (
            <StepperItem
              index={index}
              key={index}
              {...step}
              additionalClassName={{
                button: "bg-zinc-200",
              }}
            >
              {step.children}
            </StepperItem>
          ))}
        </Stepper>
        <div className="flex items-center justify-center gap-2">
          {activeStep === steps.length ? (
            <Step3 />
          ) : (
            <Button
              onClick={isLastStep ? startExploring : nextStep}
              className="rounded-full px-8 text-lg"
            >
              {isLastStep ? "I'm ready to get bookings" : "Next"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
