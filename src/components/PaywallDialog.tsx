import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Stepper, StepperItem, type StepperConfig } from "./ui/stepper";
import { useStepper } from "./ui/use-stepper";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Link from "next/link";

const steps = [
  {
    label: "Unlimited Offers",
    description:
      "With Tramona Lisa, when you request deals, you can get matched with an unlimited number of hosts. You’re no longer stuck with only one free offer per request!",
    // icon: <Check />,
  },
  {
    label: "Exclusive",
    description:
      "Unlock special promotions, discounts, and exclusive offers that are reserved for premium subscribers. Enjoy added value to your stay through unique perks negotiated on your behalf. Our customers save more than they spend on the Tramona Lisa Membership.",
    // icon: <Discount />,
  },
  {
    label: "Travel More",
    description:
      "Join to unlock more travel opportunities tailored to your preferences, empowering you to explore the world exactly the way you want to.",
    // icon: <Airplane />,
  },
] satisfies StepperConfig[];

export default function PaywallDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    nextStep,
    prevStep,
    activeStep,
    isDisabledStep,
    isLastStep,
    isOptionalStep,
  } = useStepper({
    initialStep: 0,
    steps,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[95vh] space-y-4 overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-center">
            You must join Tramona Lisa to access this offer !
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-3">
          <Stepper orientation="vertical" activeStep={activeStep}>
            {steps.map((step, i) => (
              <StepperItem
                index={i}
                key={i}
                {...step}
                additionalClassName={{
                  label: "text-[#ffcc00] text-lg font-bold",
                }}
              >
                {/* <div className='w-full rounded-lg bg-slate-100 p-4 text-slate-900 dark:bg-slate-300'>
									<p>Step {i + 1} content</p>
								</div> */}
              </StepperItem>
            ))}
          </Stepper>

          <Separator />
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <p>Annual: $300/year&nbsp; • &nbsp;Monthly: $40/month</p>
            <p>Cancel anytime</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {activeStep === steps.length ? (
              <Link href={"/pricing"}>
                <Button className="w-60">Continue</Button>
              </Link>
            ) : (
              <>
                <Button disabled={isDisabledStep} onClick={prevStep}>
                  Prev
                </Button>
                <Button onClick={nextStep}>
                  {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
                </Button>
              </>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            or pay per unlock
          </p>
          <p className="text-center text-sm italic text-muted-foreground">
            * &nbsp;we cannot guarantee availability since properties are listen
            on multiple platforms. The offer is available at the time of upload
            to your account
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
