import Head from "next/head";

import Undone from "@/components/_icons/UndoneIcon";
import { Button } from "@/components/ui/button";
import type { StepperConfig } from "@/components/ui/stepper";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { useStepper } from "@/components/ui/use-stepper";

import MainLayout from "@/components/_common/Layout/MainLayout";
import ReferralCodeDialog from "@/components/sign-up/ReferralCodeDialog";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import { Lightbulb, MessageCircle, Wallet } from "lucide-react";
import router from "next/router";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";

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
      <div className="my-3 flex flex-col gap-8 text-center">
        <h1 className="text-4xl font-bold lg:text-5xl">Welcome to Tramona!</h1>
        <p className="text-xl font-bold lg:text-2xl">
          Where you can find travel deals by bidding on rentals.
        </p>
        <p className="text-xl font-bold">At Tramona, you can</p>
      </div>

      <div className="my-8 grid grid-cols-3 gap-4 text-center font-semibold">
        <div className="flex flex-col items-center space-y-4">
          <div className=" text-teal-700">
            <Wallet size={50} />
          </div>
          <p>Set your budget and request deals from relevant properties.</p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <MessageCircle size={50} />
          <p>
            Negotiate directly with hosts to find a price that works for you
            both.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Wallet size={50} />
          <p>Avoid hidden fees with transparent pricing.</p>
        </div>
      </div>
    </StepperContentLayout>
  );
}

function Step2(): JSX.Element {
  const { data } = api.users.myReferralCode.useQuery();

  return (
    <StepperContentLayout className="container gap-4 text-balance">
      <div className="flex flex-col gap-10 text-center">
        <h1 className="text-4xl font-bold lg:text-5xl">How it works</h1>
        <p className="text-lg font-medium lg:text-xl">
          We offer a generous 30% base profit split with people you bring to the
          platform.
        </p>
      </div>

      <div className="my-6 flex flex-col items-center gap-4 font-medium text-zinc-500">
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
      <h1 className="text-4xl font-bold lg:text-5xl">Start traveling now</h1>
      <p className="text-xl font-semibold lg:text-2xl">
        And get properties out of your budget, for your budget
      </p>
      <div className="my-5 flex justify-center">
        <MyTripsEmptySvg />
      </div>
      <div className="flex">
        <Lightbulb />
        <p className="ps-2">
          <span className="font-bold">Remember</span> : All offers you make are
          binding. If a Host accepts your offer, your card will be charged.
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
        <div className="my-5 flex justify-end">
          {isLastStep ? (
            <div className="flex gap-3">
              <Button
                size="lg"
                className="border-teal-900 bg-transparent font-semibold text-primary hover:bg-transparent"
              >
                Back
              </Button>
              <Button
                size="lg"
                // asChild
                className="rounded-lg bg-teal-900 font-semibold hover:bg-teal-950"
                onClick={() => router.push("/")}
              >
                {/* <Link href="/dashboard"> */}
                Start Traveling
                {/* </Link> */}
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                size="lg"
                className="rounded-lg border border-teal-900 bg-white font-semibold text-primary hover:bg-transparent"
              >
                Skip
              </Button>
              <Button
                size="lg"
                onClick={nextStep}
                className="rounded-lg bg-teal-900 font-semibold hover:bg-teal-950"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
