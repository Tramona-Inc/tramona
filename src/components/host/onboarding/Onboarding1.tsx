"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Icons from lucide-react
import { Link2, CheckCircle2, ArrowRight } from "lucide-react";

// From your design system
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// TRPC / API stuff
import { api } from "@/utils/api";
import { ALL_PROPERTY_PMS } from "@/server/db/schema";

// For forms & calendars
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useZodForm } from "@/utils/useZodForm";
import { z } from "zod";

// Additional UI from your prior code
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectIcon } from "@radix-ui/react-select";
import { CaretSortIcon } from "@radix-ui/react-icons";

// Multi-step wizard (if you still need it)
import HostSignupModal from "./HostSignupModal"; // optional

export default function HostOnboardingPage() {
  const router = useRouter();

  // States for modals & logic
  const [showModal, setShowModal] = useState(false);
  const [dialogType, setDialogType] = useState<
    "assistedListing" | "syncPMS" | null
  >(null);
  const [showHospitablePopup, setShowHospitablePopup] = useState(false);
  const [eventScheduled, setEventScheduled] = useState(false);

  // (If you need the multi-step wizard logic)
  const [showHostSignupModal, setShowHostSignupModal] = useState(false);

  // Calendly
  useCalendlyEventListener({
    onEventScheduled: () => setEventScheduled(true),
  });

  // TRPC queries
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

  // Only if you still want to show a wizard for known hospitable customers
  const { data: isHospitableCustomer } = api.pms.getHospitableCustomer.useQuery(
    undefined,
    {
      onError: (err) => {
        console.error("Error from getHospitableCustomer:", err.message);
      },
    },
  );

  useEffect(() => {
    if (isHospitableCustomer) {
      setShowHostSignupModal(true);
    }
  }, [isHospitableCustomer]);

  const closeModal = () => {
    setShowModal(false);
    setDialogType(null);
    if (eventScheduled) {
      void router.push("/host");
    }
  };

  // Zod form for the PMS sync
  const form = useZodForm({
    schema: z.object({
      pms: z.enum(ALL_PROPERTY_PMS),
      accountId: z.string(),
      apiKey: z.string(),
    }),
  });

  const handleSubmit = form.handleSubmit(async ({ pms, accountId, apiKey }) => {
    const { bearerToken } = await generateBearerToken({ accountId, apiKey });
    await createHostProfile({
      hostawayApiKey: apiKey,
      hostawayAccountId: accountId,
      hostawayBearerToken: bearerToken,
    });
    // Hard reload so the header info updates
    window.location.href = "/host";
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with extra padding for mobile */}
      <div className="container px-4 py-10 pt-24 md:py-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Get started on Tramona
          </h1>
          <p className="mb-12 text-xl text-muted-foreground">
            Join thousands of successful hosts maximizing their Airbnb earnings
          </p>
        </div>

        {/* Keep the “Connect directly with Airbnb” section as before */}
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm md:flex-row md:items-start">
              <div className="self-start rounded-full bg-primary/10 p-2">
                <Link2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Create a host account</h2>
                <p className="mt-1 text-muted-foreground">
                  Connect directly with your Airbnb account to sign up now
                </p>
                <Button
                  onClick={() => setShowHospitablePopup(true)}
                  className="mt-4"
                  size="lg"
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
              <h3 className="mb-2 font-semibold">
                Say goodbye to empty nights
              </h3>
              <p className="text-sm text-muted-foreground">
                Tramona is the perfect supplement to Airbnb, say goodbye to
                empty nights and hello to more bookings
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Easy Integration</h3>
              <p className="text-sm text-muted-foreground">
                Connect directly with
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
              <AccordionTrigger>Can I counter-offer requests?</AccordionTrigger>
              <AccordionContent>
                Yes, you can! Tramona gives you full control over your pricing
                and allows you to negotiate with potential guests.
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
                Hosts typically earn 10-15% more through Tramona. Our smart
                pricing algorithm and booking system help maximize your revenue
                while minimizing vacant nights.
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

        {/* Updated Bottom Section */}
        <div className="mx-auto mt-16 max-w-xl text-center">
          <h3 className="mb-4 text-2xl font-semibold">Any questions?</h3>
          <p className="mb-6 text-muted-foreground">Schedule a call here</p>
          <Button
            size="lg"
            className="px-8"
            onClick={() => {
              // Replace with your own Calendly or scheduling link
              window.open("https://calendly.com/tramona", "_blank");
            }}
          >
            Schedule a Call
          </Button>
        </div>
      </div>

      {/* ============ Dialogs / Modals ============ */}

      {/* Connect with Airbnb popup */}
      <Dialog open={showHospitablePopup} onOpenChange={setShowHospitablePopup}>
        <DialogClose />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with Airbnb</DialogTitle>
          </DialogHeader>
          <div>
            <p>
              <strong>Please Read:</strong>
            </p>
            <p className="pb-6">
              This step will connect with your Airbnb account. The property sync
              process must be completed in one session.{" "}
              <strong>
                If you navigate away, press back, or close this window before
                finishing, the sync will be interrupted.
              </strong>{" "}
              In this case, please contact support to reset your host account if
              needed.
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
                Connect with Airbnb
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* For Sync PMS or Assisted Listing */}
      <Dialog open={showModal} onOpenChange={closeModal}>
        <DialogClose />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "assistedListing"
                ? "Assisted Listing"
                : "Sync with PMS"}
            </DialogTitle>
          </DialogHeader>

          {dialogType === "assistedListing" ? (
            <>
              <p>
                Our team will help you set up your account. Click below to
                schedule a meeting.
              </p>
              <InlineWidget url="https://calendly.com/tramona" />
            </>
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
                            {ALL_PROPERTY_PMS.map((pmsOption) => (
                              <SelectItem key={pmsOption} value={pmsOption}>
                                {pmsOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Account ID" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="API Key" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-4 w-full">
                    Sync with PMS
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* If using the multi-step wizard for recognized Hospitable customers */}
      {showHostSignupModal && (
        <HostSignupModal onCloseAction={() => setShowHostSignupModal(false)} />
      )}
    </div>
  );
}
