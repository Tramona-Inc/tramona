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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ALL_PROPERTY_PMS } from "@/server/db/schema";
import { api } from "@/utils/api";
import { Home } from "lucide-react";

export default function Onboarding1({
  onPressNext,
}: {
  onPressNext: () => void;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showHospitablePopup, setShowHospitablePopup] = useState(false);
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
      icon: <Home size={50} />,
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
    {
      id: "2",
      icon: <AssistedListing />,
      title: "PMS",
      text: "Connect with our PMS partners for effortless signup.",
      onClick: () => openModal("syncPMS"),
    },
    {
      id: "3",
      icon: <ManuallyAdd />,
      title: "You Add",
      text: "Manually list your properties",
      onClick: onPressNext,
    },
    {
      id: "4",
      icon: <AssistedListing />,
      title: "We Add",
      text: "Have the Tramona onboarding team set up your account.",
      onClick: () => openModal("assistedListing"),
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
    api.users.upsertHostProfile.useMutation();

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
    void router.push("/host");
    console.log({ pms, accountId, apiKey });
  });

  return (
    <>
      <div className="w-full flex-grow max-sm:container lg:grid lg:grid-cols-1">
        {/* <div className="hidden flex-grow bg-muted lg:block">
          <Image
            src="/assets/images/host-onboarding.png"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover"
          />
        </div> */}

        <div className="my-6 flex flex-col items-center gap-6 sm:mx-20">
          <h1 className="text-center text-2xl font-semibold sm:text-4xl lg:text-3xl xl:text-4xl">
            Get started on Tramona
          </h1>
          <div className="flex flex-col gap-4">
            {items.map((item) =>
              item.id === "1" ? (
                !isHospitableCustomer && (
                  <CardSelect
                    key={item.id}
                    title={item.title}
                    text={item.text}
                    onClick={item.onClick}
                    recommended={item.recommended}
                  >
                    {item.icon}
                  </CardSelect>
                )
              ) : (
                <CardSelect
                  key={item.title}
                  title={item.title}
                  text={item.text}
                  onClick={item.onClick}
                >
                  {item.icon}
                </CardSelect>
              ),
            )}
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
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showHospitablePopup} onOpenChange={setShowHospitablePopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with Airbnb</DialogTitle>
          </DialogHeader>
          <div className="">
            <p>
              <strong>Please Read:</strong>
            </p>
            <p className="pb-6">
              This next step will connect with your Airbnb account. The property
              sync process must be completed in one session.{" "}
              <strong>
                If you navigate away, press back, or close this window before
                finishing, the sync will be interrupted.
              </strong>{" "}
              In this case, please send us a message and we will be in touch
              shortly to reset your host account.
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
    </>
  );
}
