import Head from "next/head";
import { useRouter } from "next/router";

import Undone from "@/components/_icons/UndoneIcon";
import OfferCard from "@/components/offer-card/OfferCard";
import { liveFeedOffers } from "@/components/offer-card/data";
import { Button } from "@/components/ui/button";
import type { StepperConfig } from "@/components/ui/stepper";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { useStepper } from "@/components/ui/use-stepper";
import { BadgeDollarSign, CalendarCheck, PiggyBank } from "lucide-react";

import MainLayout from "@/components/_common/Layout/MainLayout";
import ReferralCodeDialog from "@/components/sign-up/ReferralCodeDialog";
import { api } from "@/utils/api";
import { cn, sleep } from "@/utils/utils";
import Link from "next/link";

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
    <StepperContentLayout className="container gap-4 text-balance text-center">
      <h1 className="text-4xl font-bold lg:text-5xl">Become a host</h1>
      <div className="my-10 space-y-10 self-center font-medium lg:max-w-[600px]">
        <p className="text-xl lg:text-2xl">
          Sign up in the menu to start to get offers sent directly to you,
          however you prefer.
        </p>
        <p className="text-lg lg:text-xl">
          You will get requests in your area sent directly to you.{" "}
          <mark className="bg-gold px-1">Make more money</mark> and{" "}
          <mark className="bg-gold px-1">reduce vacancies!</mark>
        </p>
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

  return (
    <MainLayout type="auth">
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
          ) : isLastStep ? (
            <Button asChild className="rounded-full">
              <Link href="/dashboard">Make a request now</Link>
            </Button>
          ) : (
            <Button onClick={nextStep} className="rounded-full px-8">
              Continue
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
