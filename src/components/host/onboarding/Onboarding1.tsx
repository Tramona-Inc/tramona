import CardSelect from "@/components/_common/CardSelect";
import AssistedListing from "@/components/_icons/AssistedListing";
import ManuallyAdd from "@/components/_icons/ManuallyAdd";
import { useRouter } from "next/router";
import Image from "next/image";
import OnboardingFooter from "./OnboardingFooter";
import { useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { zodString } from "@/utils/zod-utils";
import { z } from "zod";
import { SelectIcon } from "@radix-ui/react-select";
import { CaretSortIcon } from "@radix-ui/react-icons";

import { accounts, ALL_PROPERTY_PMS } from "@/server/db/schema";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { api } from "@/utils/api";
export default function Onboarding1({
  onPressNext,
}: {
  onPressNext: () => void;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [eventScheduled, setEventScheduled] = useState(false);
  const [dialogType, setDialogType] = useState<
    "assistedListing" | "syncPMS" | null
  >(null);

  useCalendlyEventListener({ onEventScheduled: () => setEventScheduled(true) });

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
      icon: <ManuallyAdd />,
      title: "Manually Add",
      text: "Complete a simple step-by-step process to add your property information",
      onClick: onPressNext,
    },
    {
      id: "2",
      icon: <AssistedListing />,
      title: "Assisted Listing",
      text: "Have the Tramona onboarding team set up my account.",
      onClick: () => openModal("assistedListing"),
    },
    {
      id: "3",
      icon: <AssistedListing />,
      title: "Sync with PMS",
      text: "Do you use a PMS? Easily sync your properties to Tramona.",
      onClick: () => openModal("syncPMS"),
    },
  ];

  const form = useZodForm({
    schema: z.object({
      pms: z.enum(ALL_PROPERTY_PMS),
      accountId: z.string(),
      apiKey: z.string(),
    }),
  });


  const { mutateAsync: generateBearerToken } = api.pms.generateHostawayBearerToken.useMutation({
    onSuccess: () => {
      closeModal();
    },
  });

  const { mutateAsync: createHostProfile } = api.users.createHostProfile.useMutation({});


  const handleSubmit = form.handleSubmit(async ({ pms, accountId, apiKey }) => {
    const {bearerToken} = await generateBearerToken({ accountId, apiKey });
    console.log(bearerToken);
    createHostProfile({
      hostawayApiKey: apiKey,
      hostawayAccountId: accountId,
      hostawayBearerToken: bearerToken,
    });
    void router.push("/host");
    console.log({ pms, accountId, apiKey });
  });

  return (
    <>
      <div className="w-full flex-grow max-sm:container lg:grid lg:grid-cols-2">
        <div className="hidden flex-grow bg-muted lg:block">
          <Image
            src="/assets/images/host-onboarding.png"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center justify-center sm:mx-20">
          <h1 className="mb-16 flex flex-col pt-8 text-4xl font-semibold">
            It&apos;s easy to list your
            <span>property on Tramona</span>
          </h1>

          <div className="flex flex-col gap-10">
            {items.map((item) => (
              <CardSelect
                key={item.title}
                title={item.title}
                text={item.text}
                onClick={item.onClick}
              >
                {item.icon}
              </CardSelect>
            ))}
          </div>
        </div>
      </div>

      <OnboardingFooter isForm={false} />
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
                Our team will help you set up your account. Click the button
                below to schedule a meeting with us.
              </p>
              <InlineWidget url="https://calendly.com/tramona" />
            </>
          ) : (
            <>
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
                      // disabled={form.formState.isSubmitting}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
