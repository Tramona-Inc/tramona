import Head from "next/head";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { useStepper } from "@/components/ui/use-stepper";
import type { StepperConfig } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import Undone from "@/components/_icons/UndoneIcon";
import Calender from "@/components/_icons/CalenderIcon";
import Piggy from "@/components/_icons/PiggyIcon";
import { fakeLiveDeals } from "@/fake-data/live-deals";
import Image from "next/image";
import { cn, sleep } from "@/utils/utils";
import { useRouter } from "next/router";

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
  return (
    <StepperContentLayout>
      <p className="text-center text-3xl font-bold">
        Welcome to <br /> the New Era of Travel !
      </p>
      <p className="text-center text-xl font-bold">
        Here are some things you <br /> should know about Tramona
      </p>
      <div className="mx-auto flex w-[85%] flex-col gap-4">
        <div className="flex flex-row items-center gap-4">
          <div className="h-30 w-30">
            <Calender />
          </div>
          <p className="">
            Tramona works by matching you with one of the many hosts in our
            network that has a vacancy
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="h-30 w-30">
            <Piggy />
          </div>
          <p className="">
            Because of this, we can guarantee you a price that is not available
            anywhere else. <span className="bg-gold px-1">Make a request</span>{" "}
            and see for yourself
          </p>
        </div>
      </div>
      <div className="my-4 flex flex-1 flex-col gap-4 self-center rounded-lg bg-[#3843D0] p-4">
        {fakeLiveDeals
          .slice(2)
          .map(({ minutesAgo, tramonaPrice, oldPrice }, idx) => (
            <div
              className="flex flex-row gap-4 rounded-lg border-2 bg-white p-4 text-black"
              key={idx}
            >
              <Image
                src={"/assets/images/fake-properties/owners/2.png"}
                alt=""
                className="inset-0 border border-none object-contain object-center"
                width={70}
                height={70}
              />
              <div className="relative grid lg:grid-cols-2">
                <span className="absolute right-[-1rem] top-[-1rem] text-xs text-[#192185]">
                  {minutesAgo}min ago
                </span>
                <div className="flex flex-col items-center justify-center">
                  <p className="font-bold">Tatiana is going to Paris 🇫🇷</p>
                  <p className="text-xs">
                    Tramona Price:{" "}
                    <span className="font-bold text-[#3843D0] lg:text-lg">
                      {tramonaPrice}$/per night
                    </span>{" "}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <s className="text-zinc-400">Old price: {oldPrice}$</s>
                </div>
                <p className="text-xs text-[#3843D0]">
                  {Math.round(
                    100 * (1 - (tramonaPrice ?? 0) / (oldPrice ?? 0)),
                  )}
                  % Off!
                </p>
              </div>
            </div>
          ))}
      </div>
    </StepperContentLayout>
  );
}

function Step2(): JSX.Element {
  return (
    <StepperContentLayout className={"items-center text-center"}>
      <p className="text-l text-center font-bold">
        We have the <span className="bg-gold px-1">same hosts</span> that are on
        sites like Airbnb, VRBO, or Bookings.com, <br /> we just match you with
        one of their vacant dates.
      </p>
      <p>Its basically free money. Try it for yourself.</p>
      <p>
        We will never ask for a credit card or any form of payment, until its
        time to checkout
      </p>
      <Image
        src={"/assets/images/welcome/welcome-step2.png"}
        width={299}
        height={295}
        alt=""
        className="inset-0 my-5 border border-none object-contain object-center"
      />
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
      <Head>Welcome</Head>
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
