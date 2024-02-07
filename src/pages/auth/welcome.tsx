import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { Stepper, StepperItem } from "@/components/ui/stepper";
import { useStepper } from "@/components/ui/use-stepper";
import type { StepperConfig } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import Undone from "@/components/_icons/UndoneIcon";
import { CalendarCheck, BadgeDollarSign, PiggyBank } from "lucide-react";
import OfferCard from "@/components/offer-card/OfferCard";
import { liveFeedOffers } from "@/components/offer-card/data";

import { cn, sleep } from "@/utils/utils";
import { api } from "@/utils/api";

function StepperContentLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | null;
}): JSX.Element {
  return (
    <div className={cn("mt-2 flex flex-col gap-4 self-center", className)}>
      {children}
    </div>
  );
}

function Step1(): JSX.Element {
  // Get 3 offers with the highest discount %
  const offers = liveFeedOffers
    .filter((offer) => offer.discountPercent > 30)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 3);

  return (
    <StepperContentLayout className="container gap-4 text-balance">
      <div className="flex flex-col gap-10 text-center">
        <h1 className="text-4xl font-bold lg:text-5xl">
          Welcome to the New Era of Travel!
        </h1>
        <p className="text-xl font-bold lg:text-2xl">
          Here are some things you should know about Tramona
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 text-pretty lg:gap-4">
        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <CalendarCheck className="h-8 w-8 text-primary lg:h-10 lg:w-10" />
          </div>
          <p className="font-medium lg:text-lg">
            Tramona works by matching you with one of the many hosts in our
            network that has a vacancy.
          </p>
        </div>

        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <BadgeDollarSign className="h-8 w-8 text-primary lg:h-10 lg:w-10" />
          </div>
          <p className="font-medium lg:text-lg">
            We also talk to the host directly, avoiding those nasty fees other
            companies add on.
          </p>
        </div>

        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <PiggyBank className="h-8 w-8 text-primary lg:h-10 lg:w-10" />
          </div>
          <p className="font-medium lg:text-lg">
            Because of this, we can guarantee you a price that is not available
            anywhere else. <mark className="bg-gold px-1">Make a request</mark>{" "}
            and see for yourself.
          </p>
        </div>
      </div>

      <div className="my-4 flex min-w-full flex-1 flex-col space-y-4 self-center rounded-3xl bg-primary p-4 md:min-w-[400px] lg:min-w-[500px] xl:min-w-[600px]">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </StepperContentLayout>
  );
}

function Step2(): JSX.Element {
  const { data } = api.users.myReferralCode.useQuery();

  return (
    <StepperContentLayout className="container gap-4 text-balance">
      <div className="flex flex-col gap-10 text-center">
        <h1 className="text-4xl font-bold lg:text-5xl">Invite your friends!</h1>
        <p className="text-lg font-medium lg:text-xl">
          We offer a generous <mark className="bg-gold px-1">30%</mark> base
          profit split with people you bring to the platform.
        </p>
      </div>

      <div className="my-10 flex flex-col items-center gap-4 font-medium text-zinc-500">
        <p className="text-lg lg:text-xl">Here is your referral code</p>
        <p className="text-sm font-normal lg:text-base">
          Share your code and start earning on other peoples travel
        </p>

        <p className="my-4 rounded-md border-2 px-10 py-4 text-5xl tracking-widest lg:text-7xl">
          {data?.referralCode ?? "..."}
        </p>

        <p className="lg:text-lg">
          This can also be found in your profile page
        </p>
      </div>
    </StepperContentLayout>
  );
}

function Step3(): JSX.Element {
  return (
    <StepperContentLayout
      className={"text-l items-center text-center font-bold"}
    >
      <p>We have a global feed and a personal feed.</p>
      <p>
        You can see where your friends are going, deals other people have
        gotten, <br /> or just find inspiration for yourself
      </p>
      <Image
        src={"/assets/images/welcome/welcome-step3.png"}
        width={325}
        height={214}
        alt=""
        className="inset-0 my-5 border border-none object-contain object-center"
      />
    </StepperContentLayout>
  );
}

function Step4(): JSX.Element {
  return (
    <StepperContentLayout className={"items-center text-center"}>
      <p className="text-3xl font-bold">Let&apos;s Grow & Earn Together</p>
      <p className="text-l font-bold">
        We built Tramona for the sole benefit of travelers and hosts, our
        referral program is no different.
      </p>
      <p>
        To show this, we offer a generous{" "}
        <span className="bg-gold px-1">30%</span> base revenue split with people
        you bring to the platform.
      </p>
      <Image
        src={"/assets/images/welcome/welcome-step4.png"}
        width={330}
        height={118}
        alt=""
        className="inset-0 my-5 border border-none object-contain object-center"
      />
    </StepperContentLayout>
  );
}

function Step5(): JSX.Element {
  return (
    <StepperContentLayout className={"items-center text-center"}>
      <p className="text-l font-bold">
        We want to increase the the amount people travel, its that simple.
      </p>
      <p className="bg-gold px-1">Submit a request and see how it works. </p>
      <Image
        src={"/assets/images/welcome/welcome-step5.png"}
        width={202}
        height={300}
        alt=""
        className="inset-0 my-5 border border-none object-contain object-center"
      />
    </StepperContentLayout>
  );
}

const steps = [
  { label: "", icon: <Undone />, children: <Step1 /> },
  { label: "", icon: <Undone />, children: <Step2 /> },
  { label: "", icon: <Undone />, children: <Step3 /> },
  { label: "", icon: <Undone />, children: <Step4 /> },
  { label: "", icon: <Undone />, children: <Step5 /> },
] satisfies StepperConfig[];

export default function Welcome() {
  const { nextStep, activeStep, isLastStep } = useStepper({
    initialStep: 0,
    steps,
  });

  const router = useRouter();

  const startExploring = () => {
    nextStep();
    sleep(2000)
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
      <div className="mx-auto flex w-full flex-col gap-4 px-5 py-10 lg:px-80">
        <Stepper activeStep={activeStep} responsive={false}>
          {steps.map((step, index) => (
            <StepperItem
              index={index}
              key={index}
              {...step}
              additionalClassName={{
                button: "bg-[#9CA3AF]",
              }}
            >
              {step.children}
            </StepperItem>
          ))}
        </Stepper>
        <div className="flex items-center justify-center gap-2">
          {activeStep === steps.length ? (
            <Step5 />
          ) : (
            <Button
              onClick={isLastStep ? startExploring : nextStep}
              className="rounded-full px-8"
            >
              {isLastStep ? "Start Exploring" : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
