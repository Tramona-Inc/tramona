import Head from "next/head";

import Undone from "@/components/_icons/UndoneIcon";
import OfferCard from "@/components/offer-card/OfferCard";
import { liveFeedOffers } from "@/components/offer-card/data";
import { Button } from "@/components/ui/button";
import type { StepperConfig } from "@/components/ui/stepper";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { useStepper } from "@/components/ui/use-stepper";

import MainLayout from "@/components/_common/Layout/MainLayout";
import ReferralCodeDialog from "@/components/sign-up/ReferralCodeDialog";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
      <div className="my-3 flex flex-col gap-10 text-center">
        <h1 className="text-4xl font-bold lg:text-5xl">
          Welcome to the New Era of Travel!
        </h1>
        <p className="text-xl font-bold lg:text-2xl">
          Here are some things you should know about Tramona
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 text-pretty rounded-md border-0 bg-zinc-100 py-8 lg:gap-4">
        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <p className="flex h-10 w-10 items-center justify-center rounded-full border bg-black text-2xl font-semibold text-white">
              1
            </p>
          </div>
          <p className="font-medium lg:text-lg">
            Tramona works by matching you with one of the many hosts in our
            network that has a vacancy.
          </p>
        </div>

        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <p className="flex h-10 w-10 items-center justify-center rounded-full border bg-black text-2xl font-semibold text-white">
              2
            </p>
          </div>
          <p className="font-medium lg:text-lg">
            We also talk to the host directly, avoiding those nasty fees other
            companies add on.
          </p>
        </div>

        <div className="flex max-w-[500px] items-center gap-4">
          <div>
            <p className="flex h-10 w-10 items-center justify-center rounded-full border bg-black text-2xl font-semibold text-white">
              3
            </p>
          </div>
          <p className="font-medium lg:text-lg">
            Because of this, we can guarantee you a price that is not available
            anywhere else. Make a request and see for yourself.
          </p>
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
        <h1 className="text-4xl font-bold lg:text-5xl">Invite your friends!</h1>
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
  const offers = liveFeedOffers
    .filter((offer) => offer.discountPercent > 30)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 3);

  return (
    <StepperContentLayout className="container gap-4 text-balance text-center">
      <h1 className="text-4xl font-bold lg:text-5xl">Make a Request</h1>
      <div className="my-4 self-center font-medium lg:max-w-[600px]">
        <p className="text-xl lg:text-2xl">
          Either name your own price or submit a link, and we will get you the
          same property or a similar one at a discount
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
        <div className="flex justify-center">
          {isLastStep ? (
            <Button
              size="lg"
              // asChild
              className="rounded-full pr-4"
              onClick={() => router.push("/dashboard")}
            >
              {/* <Link href="/dashboard"> */}
              Continue to dashboard <ChevronRight className="opacity-80" />
              {/* </Link> */}
            </Button>
          ) : (
            <Button size="lg" onClick={nextStep} className="rounded-full pr-4">
              Next <ChevronRight className="opacity-80" />
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
