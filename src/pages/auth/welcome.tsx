import Head from "next/head";

import Undone from "@/components/_icons/UndoneIcon";
import { Button } from "@/components/ui/button";
import type { StepperConfig } from "@/components/ui/stepper";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { useStepper } from "@/components/ui/use-stepper";

import MainLayout from "@/components/_common/Layout/MainLayout";
import ReferralCodeDialog from "@/components/sign-up/ReferralCodeDialog";
import { cn, useIsMd } from "@/utils/utils";
import { Lightbulb } from "lucide-react";
import router from "next/router";
import TransparentPricingIcon from "@/components/_icons/TransparentPricingIcon";
import WalletIcon from "@/components/_icons/WalletIcon";
import SupportIcon from "@/components/_icons/SupportIcon";
import CircleIcon from "@/components/_icons/CircleIcon";
import BounceIcon from "@/components/_icons/BounceIcon";
import NoGpsIcon from "@/components/_icons/NoGpsIcon";
import BeachIcon from "@/components/_icons/BeachIcon";
import BeachIconMini from "@/components/_icons/BeachIconMini";
import BounceIconMobile from "@/components/_icons/BounceIconMobile";
import { useEffect, useState } from "react";
import CircleIconMobile from "@/components/_icons/CircleIconMobile";
import NoGpsIconMobile from "@/components/_icons/NoGpsIconMobile";
import BeachIconMiniMobile from "@/components/_icons/BeachIconMiniMobile";
import WalletIconMobile from "@/components/_icons/WalletIconMobile";
import SupportIconMobile from "@/components/_icons/SupportIconMobile";
import TransparentPricingIconMobile from "@/components/_icons/TransparentPricingIconMobile";
import BeachIconMobile from "@/components/_icons/BeachIconMobile";

function StepperContentLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | null;
}): JSX.Element {
  return (
    <div className={cn("flex flex-col gap-4 self-center lg:mt-5", className)}>
      {children}
    </div>
  );
}

function Step1(): JSX.Element {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    }

    // Initial call to set isMobile based on current window size
    handleResize();

    // Add event listener to update isMobile state when window is resized
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <StepperContentLayout className="gap-4 lg:container">
      <div className="flex flex-col gap-1 text-center leading-5 lg:gap-4 lg:leading-6">
        <h1 className="text-3xl font-bold lg:text-5xl">Welcome to Tramona!</h1>
        <p className="font-semibold lg:text-2xl">
          Where you can find travel deals by bidding on rentals.
        </p>
        <p className="mt-2 text-xl font-bold lg:text-2xl">
          At Tramona, you can
        </p>
      </div>

      <div className="grid grid-cols-1 text-balance text-center font-semibold leading-4 lg:grid-cols-3 lg:gap-4 lg:text-lg lg:leading-5">
        <div className="h flex place-items-center lg:block">
          {isMobile ? <WalletIconMobile /> : <WalletIcon />}
          <div className="basis-5/6">
            <p>Set your budget and request deals from relevant properties.</p>
          </div>
        </div>
        <div className="flex place-items-center lg:block">
          {isMobile ? <SupportIconMobile /> : <SupportIcon />}
          <div className="basis-5/6">
            <p>
              Negotiate directly with hosts to find a price that works for you
              both.
            </p>
          </div>
        </div>
        <div className="flex place-items-center lg:block">
          {isMobile ? (
            <TransparentPricingIconMobile />
          ) : (
            <TransparentPricingIcon />
          )}
          <div className="basis-5/6">
            <p>Avoid hidden fees with transparent pricing.</p>
          </div>
        </div>
      </div>
    </StepperContentLayout>
  );
}

function Step2(): JSX.Element {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    }

    // Initial call to set isMobile based on current window size
    handleResize();

    // Add event listener to update isMobile state when window is resized
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <StepperContentLayout className="gap-4 lg:container">
      <div className="text-center">
        <h1 className="text-3xl font-bold lg:text-5xl">How it works</h1>
      </div>

      <div className="relative grid grid-cols-1 space-y-9 ps-14 leading-4 lg:grid-cols-7 lg:space-y-10 lg:ps-0 lg:leading-5">
        {isMobile ? (
          <div className="absolute -left-1 top-8">
            <BounceIconMobile />
          </div>
        ) : (
          <div className="absolute -left-44 bottom-16 rotate-12">
            <BounceIcon />
          </div>
        )}

        <div className="col-span-1 flex gap-4 lg:col-span-4">
          <div className="relative">
            {isMobile ? (
              <>
                <CircleIconMobile />
                <div className="absolute -left-14 -top-6">
                  <NoGpsIconMobile />
                </div>
              </>
            ) : (
              <>
                <CircleIcon />
                <div className="absolute -left-3 -top-12">
                  <NoGpsIcon />
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            <h2 className="font-bold lg:text-xl">Make a request</h2>
            <p>
              Have a city and budget in mind? We&rsquo;ll do the rest and find
              the perfect place for you.
            </p>
          </div>
        </div>
        <div className="col-span-1 flex gap-4 lg:col-start-2 lg:col-end-6">
          <div>{isMobile ? <CircleIconMobile /> : <CircleIcon />}</div>
          <div className="space-y-2">
            <h2 className="font-bold lg:text-xl">Make an offer</h2>
            <p>
              Found a property you love? Let the host know you&rsquo;re
              interested by submitting an offer.
            </p>
          </div>
        </div>
        <div className="col-span-1 flex gap-4 lg:col-start-3 lg:col-end-7">
          <div>{isMobile ? <CircleIconMobile /> : <CircleIcon />}</div>
          <div className="space-y-2">
            <h2 className="font-bold lg:text-xl">Negotiate</h2>
            <p>
              Work with the host to tailor the price to suit your budget and
              needs.
            </p>
          </div>
        </div>
        <div className="col-span-1 flex gap-4 lg:col-start-4 lg:col-end-8">
          <div className="relative">
            {isMobile ? (
              <>
                <CircleIconMobile />
                <div className="absolute -left-16 -top-6">
                  <BeachIconMiniMobile />
                </div>
              </>
            ) : (
              <>
                <CircleIcon />
                <div className="absolute -left-8 -top-14">
                  <BeachIconMini />
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            <h2 className="font-bold lg:text-xl">Get Ready to Travel</h2>
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
  const isMobile = !useIsMd();

  return (
    <StepperContentLayout className="gap-4 text-center lg:container">
      <h1 className="text-3xl font-bold lg:text-5xl">Start traveling now</h1>
      <p className="text-lg font-semibold leading-5 lg:text-2xl lg:leading-6">
        And get properties out of your budget, for your budget
      </p>
      <div className="flex justify-center">
        {isMobile ? <BeachIconMobile /> : <BeachIcon />}
      </div>
      <div className="flex justify-center">
        <div>
          <Lightbulb />
        </div>
        <p className="ps-2 text-start leading-4 lg:text-center lg:leading-6">
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
  const { nextStep, activeStep, isLastStep, prevStep, isDisabledStep } =
    useStepper({
      initialStep: 0,
      steps,
    });

  return (
    <MainLayout type="auth">
      <Head>
        <title>Welcome | Tramona</title>
      </Head>

      <ReferralCodeDialog />
      <div className="mx-auto flex min-h-screen-minus-header max-w-3xl flex-col justify-between gap-4 p-4">
        <div>
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
        </div>
        <div className="my-5 flex justify-center lg:justify-end">
          <div className="flex w-full gap-3 lg:w-auto">
            {!isLastStep && (
              <Button
                size="lg"
                className="basis-1/3 rounded-lg border border-teal-900 bg-zinc-100 font-semibold text-primary hover:bg-zinc-200"
                onClick={() => router.push("/")}
              >
                Skip
              </Button>
            )}
            {!isDisabledStep && (
              <Button
                size="lg"
                className="bg-zinc-100 font-semibold text-primary hover:bg-zinc-200"
                onClick={prevStep}
              >
                Back
              </Button>
            )}
            <Button
              size="lg"
              variant="greenPrimary"
              onClick={isLastStep ? () => router.push("/") : nextStep}
              className="flex-1"
            >
              {isLastStep ? "Start Traveling" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
