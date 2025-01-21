"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useZodForm } from "@/utils/useZodForm";
import { z } from "zod";
import { SelectIcon } from "@radix-ui/react-select";
import { CaretSortIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ALL_PROPERTY_PMS } from "@/server/db/schema";
import { api } from "@/utils/api";
import { Link, X } from "lucide-react";
import { cn } from "@/utils/utils";
import usePopoverStore from "@/utils/store/messagePopoverStore";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  Link2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

// ------------------------------------------------------------------
// A simple Progress Indicator for the multi-step flow
// ------------------------------------------------------------------
function ProgressIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="mb-6 flex w-full flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
      <div className="text-sm font-medium">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Oops, it looks like there was an error creating your host acccount",
    image: null,
    description: "Follow these steps closely so we can get you set up.",
  },
  {
    title: "Start off by clicking Connect my Airbnb Account",
    image: "/assets/images/host-modal/Step1.png",
    description: "This will take you to the Airbnb website.",
  },
  {
    title: "Then scroll down and click allow",
    image: "/assets/images/host-modal/Step2.png",
    description:
      "This allows Tramona to access your Airbnb preferences so you dont have to manually add them.",
  },
  {
    title: "Click connect to finalize the process",
    image: "/assets/images/host-modal/Step3.png",
    description: "After this, you are almost done!",
  },
  {
    title: "Click take me back to Tramona",
    image: "/assets/images/host-modal/Step4.png",
    description:
      "This will bring you to the host dashboard, and you can start hosting!",
  },
];

const totalSteps = steps.length;

export default function Onboarding1({
  onPressNext,
  forHost = false,
}: {
  onPressNext: () => void;
  forHost?: boolean;
}) {
  const router = useRouter();
  const { setOpen } = usePopoverStore();
  const [showModal, setShowModal] = useState(false);
  const [showHospitablePopup, setShowHospitablePopup] = useState(false);
  const [eventScheduled, setEventScheduled] = useState(false);
  const [dialogType, setDialogType] = useState<
    "assistedListing" | "syncPMS" | null
  >(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  useCalendlyEventListener({ onEventScheduled: () => setEventScheduled(true) });

  const [currentStep, setCurrentStep] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState("item-1");
  const { mutateAsync: resetHospitableProfile } =
    api.pms.resetHospitableCustomer.useMutation();

  const handleNextStep = async () => {
    if (currentStep === 0) {
      await resetHospitableProfile();
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (isLastStep) {
      setShowSignupModal(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0]!.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]!.clientX);
  };

  const handleTouchEnd = async () => {
    if (touchStart - touchEnd > 75) {
      await handleNextStep();
    }

    if (touchStart - touchEnd < -75) {
      // Disable swipe gesture for now.
    }
  };

  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.style.transform = `translateX(-${
        (currentStep - 1) * 100
      }%)`;
    }
  }, [currentStep]);

  const openModal = (type: "assistedListing" | "syncPMS") => {
    setDialogType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDialogType(null);
    if (eventScheduled) {
      void router.push("/host");
    }
  };

  const items = [
    {
      id: "1",
      icon: <Link className="text-teal-900" strokeWidth={2} size={30} />,
      title: "Connect directly with Airbnb",
      text: "Connect with your Airbnb account. This is the easiest & preferred way",
      recommended: true,
      onClick: async () => {
        try {
          setShowHospitablePopup(true);
        } catch (error) {
          console.error("An error occurred:", error);
        }
      },
    },
  ];

  const form = useZodForm({
    schema: z.object({
      pms: z.enum(ALL_PROPERTY_PMS),
      accountId: z.string(),
      apiKey: z.string(),
    }),
  });

  const { mutateAsync: createHospitableCustomer } =
    api.pms.createHospitableCustomer.useMutation({
      onSuccess: (res) => {
        void router.push(res.data.return_url);
      },
    });

  const { mutateAsync: generateBearerToken } =
    api.pms.generateHostawayBearerToken.useMutation({
      onSuccess: () => {
        closeModal();
      },
    });

  const { mutateAsync: createHostProfile } =
    api.hosts.upsertHostProfile.useMutation();

  const { data: isHospitableCustomer } =
    api.pms.getHospitableCustomer.useQuery();

  const handleSubmit = form.handleSubmit(async ({ pms, accountId, apiKey }) => {
    const { bearerToken } = await generateBearerToken({ accountId, apiKey }); //hostaway
    console.log(bearerToken);

    await createHostProfile({
      hostawayApiKey: apiKey,
      hostawayAccountId: accountId,
      hostawayBearerToken: bearerToken,
    });
    //Hard reload so header query doesn't redirect user back to why-list
    window.location.href = "/host";
    console.log({ pms, accountId, apiKey });
  });

  useEffect(() => {
    if (isHospitableCustomer) {
      setShowSignupModal(true);
    }
  }, [isHospitableCustomer]);

  const renderStepContent = () => {
    const currentStepData = steps[currentStep - 1];

    if (!currentStepData) {
      return null;
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
          <p className="text-base text-gray-600">
            {currentStepData.description}
          </p>
        </div>
        {currentStepData.image && (
          <div className="relative w-full">
            <div className="overflow-hidden rounded-md border border-gray-300">
              <div className="flex h-auto">
                <div className="w-full flex-shrink-0">
                  <div className="relative h-64 w-full">
                    <Image
                      src={currentStepData.image}
                      alt={`Step ${currentStep}`}
                      className="h-full w-full object-contain"
                      fill
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Only click the button in the flow, do not navigate away from the
                page.
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
          {currentStep !== 1 && (
            <Button
              onClick={handlePrevStep}
              variant="outline"
              disabled={currentStep === 1}
            >
              Back
            </Button>
          )}
          <div
            className={cn(
              "flex justify-end",
              currentStep === 1 ? "w-full" : "",
            )}
          >
            <Button onClick={() => handleNextStep(currentStep === totalSteps)}>
              {currentStep === totalSteps ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full flex-grow lg:grid lg:grid-cols-1">
        <div
          className={cn(
            "flex flex-col justify-center gap-6",
            forHost ? "m-0 items-start" : "my-6 items-center sm:mx-20",
          )}
        >
          <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
            {/* Hero Section */}
            <div className="container px-4 py-16 md:py-24">
              <div className="mx-auto max-w-3xl text-center">
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Get started hosting on Tramona
                </h1>
                <p className="mb-12 text-xl">
                  Hosts can expect to make 10-15% more when using Tramona to
                  book their empty nights earnings
                </p>
              </div>

              {/* Main Card */}
              <Card className="mx-auto max-w-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 rounded-lg border p-4 shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Link2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">
                        Create a host account
                      </h2>
                      <p className="mt-1 text-muted-foreground">
                        When creating an account, you&apos;ll connect directly
                        with Airbnb so ensure all your host settings and
                        preferences are saved
                      </p>
                      <Button
                        className="mt-4"
                        size="lg"
                        onClick={async () => {
                          try {
                            setShowHospitablePopup(true);
                          } catch (error) {
                            console.error("An error occurred:", error);
                          }
                        }}
                      >
                        Connect with Airbnb
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Section */}
              <div className="mx-auto mt-16 max-w-4xl">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">Increase Revenue</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn 10-15% more when using Tramona to book empty nights
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">Smart Pricing</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI automatically adjusts prices based on market demand
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">Easy Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Seamlessly connects with your existing Airbnb listings
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mx-auto mt-16 max-w-2xl">
                <h2 className="mb-6 text-center text-2xl font-bold">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Can I counter-offer requests?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, you can! Tramona gives you full control over your
                      pricing and allows you to negotiate with potential guests.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Do I need to sync my calendar?
                    </AccordionTrigger>
                    <AccordionContent>
                      Only if you want to. Calendar syncing is optional but
                      recommended for the best experience and to avoid double
                      bookings.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Why list on Tramona?</AccordionTrigger>
                    <AccordionContent>
                      Hosts typically earn 10-15% more through Tramona. Our
                      smart pricing algorithm and efficient booking system help
                      maximize your revenue while minimizing vacant nights.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Social Proof */}
              <div className="mx-auto mt-16 max-w-2xl text-center">
                <div className="rounded-xl bg-muted/50 p-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    TRUSTED BY HOSTS WORLDWIDE
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">10k+</span>
                      <span className="text-sm text-muted-foreground">
                        Active Hosts
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">$2M+</span>
                      <span className="text-sm text-muted-foreground">
                        Extra Revenue Generated
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">95%</span>
                      <span className="text-sm text-muted-foreground">
                        Satisfaction Rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="mx-auto mt-16 max-w-xl text-center">
                <h3 className="mb-4 text-2xl font-semibold">
                  Questions about hosting?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Schedule a call with our onboarding team to see how Tramona
                  benefits your business
                </p>
                <Button size="lg" className="px-8" asChild>
                  <a
                    href="https://calendly.com/tramona/call-with-tramona-team"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Schedule a call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {!forHost && <OnboardingFooter isForm={false} />} */}
      <Dialog open={showModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "assistedListing"
                ? "Assisted Listing"
                : "Sync with PMS"}
            </DialogTitle>
          </DialogHeader>
          {dialogType === "assistedListing" ? (
            <div className="space-y-4">
              <p>
                Our team will help you set up your account. Click the button
                below to schedule a meeting with us.
              </p>
              {/* Wrap InlineWidget in a div with a max-width */}
              <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                <InlineWidget url="https://calendly.com/tramona" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Form {...form}>
                <form onSubmit={handleSubmit}>
                  <FormField
                    control={form.control}
                    name="pms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PMS</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a PMS" />
                              <SelectIcon>
                                <CaretSortIcon className="h-4 w-4 opacity-50" />
                              </SelectIcon>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ALL_PROPERTY_PMS.map((PMS) => (
                              <SelectItem key={PMS} value={PMS}>
                                {PMS}
                              </SelectItem>
                            ))}
                            {/* Future options can be added here */}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoFocus
                            placeholder="Account ID"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input {...field} autoFocus placeholder="API Key" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <Button
                    type="submit"
                    //
                    className="mt-4"
                  >
                    Sync with PMS
                  </Button>
                </form>
              </Form>
              {/* <div className="mt-4 flex items-center space-x-2">
                                                    <Image
                                                        src="/assets/icons/help.svg"
                                                        alt="Help"
                                                        width={24}
                                                        height={24}
                                                    />
                                                    <p>
                                                        Have a question?{" "}
                                                        <a href="#" className="text-primary">
                                                            Contact us
                                                        </a>
                                                    </p>
                                                </div> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showHospitablePopup} onOpenChange={setShowHospitablePopup}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Connect with Airbnb</DialogTitle>
          </DialogHeader>
          <div className="">
            <p>
              <strong>Please Read:</strong>
            </p>
            <p className="pb-6">
              For the best host experience,{" "}
              <strong> all host profiles are synced with Airbnb. </strong> This
              way, we can limit the possibility of double bookings, reduce the
              your inputs, and reduce host fruad. The next process must be
              completed in one session.{" "}
              <strong>Please do not navigate away during this process.</strong>
            </p>

            <div className="flex justify-end">
              <Button
                onClick={async () => {
                  try {
                    await createHospitableCustomer();
                  } catch (error) {
                    console.error("An error occurred:", error);
                  }
                }}
              >
                Create my host account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {showSignupModal && (
        <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
          <DialogContent className="w-full max-w-3xl p-8 sm:w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-between">
                  <DialogClose asChild></DialogClose>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center">
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
              <div className="w-full">{renderStepContent()}</div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
