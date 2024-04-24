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
import TransparentPricingIcon from "@/components/_icons/TransparentPricingIcon";
import WalletIcon from "@/components/_icons/WalletIcon";
import SupportIcon from "@/components/_icons/SupportIcon";
import CircleIcon from "@/components/_icons/CircleIcon";
import BounceIcon from "@/components/_icons/BounceIcon";
import NoGpsIcon from "@/components/_icons/NoGpsIcon";
import BeachIcon from "@/components/_icons/BeachIcon";
import BeachIconMini from "@/components/_icons/BeachIconMini";

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
      <div className="my-3 flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold lg:text-5xl">Welcome to Tramona!</h1>
        <p className="text-xl font-semibold lg:text-2xl">
          Where you can find travel deals by bidding on rentals.
        </p>
        <p className="text-2xl font-bold">At Tramona, you can</p>
      </div>

      <div className="grid grid-cols-3 place-items-center gap-4">
        <WalletIcon />
        <SupportIcon />
        <TransparentPricingIcon />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-lg font-semibold">
        <p>Set your budget and request deals from relevant properties.</p>
        <p>
          Negotiate directly with hosts to find a price that works for you both.
        </p>
        <p>Avoid hidden fees with transparent pricing.</p>
      </div>
    </StepperContentLayout>
  );
}

function Step2(): JSX.Element {
  return (
    <StepperContentLayout className="container gap-4">
      <div className="mb-3 text-center">
        <h1 className="text-4xl font-bold lg:text-5xl">How it works</h1>
      </div>

      <div className="relative grid grid-cols-7 space-y-10">
        <div className=" absolute -left-32 bottom-10 rotate-12">
          <BounceIcon />
        </div>
        <div className="col-span-4 flex gap-4">
          <div className="relative">
            <CircleIcon />
            <div className="absolute -left-3 -top-12">
              <NoGpsIcon />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Make a request</h2>
            <p>
              Have a city and budget in mind? We&rsquo;ll do the rest and find
              the perfect place for you.
            </p>
          </div>
        </div>
        <div className="col-span-2 col-start-2 col-end-6 flex gap-4">
          <div>
            <CircleIcon />
          </div>
          <div>
            <h2 className="text-xl font-bold">Make an offer</h2>
            <p>
              Found a property you love? Let the host know you&rsquo;re
              interested by submitting an offer.
            </p>
          </div>
        </div>
        <div className="col-start-3 col-end-7 flex gap-4">
          <div>
            <CircleIcon />
          </div>
          <div>
            <h2 className="text-xl font-bold">Negotiate</h2>
            <p>
              Work with the host to tailor the price to suit your budget and
              needs.
            </p>
          </div>
        </div>
        <div className="col-start-4 col-end-8 flex gap-4">
          <div className="relative">
            <CircleIcon />
            <div className="absolute -left-8 -top-14">
              <BeachIconMini />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Get Ready to Travel</h2>
            <p>
              Once you&rsquo;ve negotiated with the host and finalized the
              details, it&rsquo;s time to prepare for your trip!
            </p>
          </div>
        </div>
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
      <div className="flex justify-center">
        <BeachIcon />
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
