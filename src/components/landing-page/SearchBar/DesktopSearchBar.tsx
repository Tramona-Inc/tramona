import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  ALL_PROPERTY_ROOM_TYPES,
  MAX_REQUEST_GROUP_SIZE,
} from "@/server/db/schema";
import { api } from "@/utils/api";
import { errorToast, successfulRequestToast } from "@/utils/toasts";
import { cn, formatCurrency, getNumNights } from "@/utils/utils";
import { optional, zodInteger, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PlusIcon,
  XIcon,
  Filter,
  UsersRoundIcon,
  DollarSignIcon,
  ChevronDown,
  NotebookIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LPDateRangePicker, {
  LPFormItem,
  LPFormLabel,
  LPFormMessage,
  LPInput,
  LPLocationInput,
} from "./components";
import { CounterInput } from "@/components/_common/CounterInput";

const formSchema = z.object({
  data: z
    .array(
      z
        .object({
          location: zodString(),
          maxNightlyPriceUSD: zodInteger({ min: 1 }),
          date: z.object({
            from: z.date(),
            to: z.date(),
          }),
          numGuests: zodInteger({ min: 1 }),
          airbnbLink: optional(zodString({ maxLen: 500 })),
          roomType: z.enum([...ALL_PROPERTY_ROOM_TYPES, "any"]),
          minNumBedrooms: z.number(),
          minNumBeds: z.number(),
          minNumBathrooms: z.number(),
          note: optional(zodString()),
        })
        .refine((data) => data.date.to > data.date.from, {
          message: "Must stay for at least 1 night",
          path: ["date"],
        }),
    )
    .min(1),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function DesktopSearchBar({
  afterSubmit,
  mode,
}: {
  afterSubmit?: () => void;
  mode: "search" | "request";
}) {
  const utils = api.useUtils();

  const defaultValues: Partial<FormSchema["data"][number]> = {
    roomType: "any",
    minNumBedrooms: 1,
    minNumBeds: 1,
    minNumBathrooms: 1,
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: [defaultValues],
    },
    reValidateMode: "onBlur",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDescription, setDialogDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [curTab, setCurTab] = useState(0);

  const mutation = api.requests.createMultiple.useMutation();
  const router = useRouter();
  const { status } = useSession();

  const { data } = form.watch();
  const numTabs = data.length;

  const tabsWithErrors =
    form.formState.errors.data
      ?.map?.((error, index) => (error ? index : null))
      .filter((i): i is number => i !== null) ?? [];

  let shouldOpenDialog = false;

  async function checkPriceEstimation(data: FormSchema["data"]) {
    const newRequests = data.map((request) => {
      const { date: _date, maxNightlyPriceUSD, location, numGuests } = request;
      const checkIn = request.date.from;
      const checkOut = request.date.to;

      return {
        checkIn,
        checkOut,
        location,
        numGuests,
        maxNightlyPriceUSD,
      };
    });

    // Check for prices
    await Promise.all(
      newRequests.map(async (request) => {
        const averageNightlyPrice =
          await utils.misc.getAverageNightlyPrice.fetch({
            checkIn: request.checkIn,
            checkOut: request.checkOut,
            location: request.location,
            numGuests: request.numGuests,
          });

        const requestedPrice: number = request.maxNightlyPriceUSD;
        const priceDifference: number = averageNightlyPrice - requestedPrice;
        const priceDiffPercent = (priceDifference / averageNightlyPrice) * 100;

        if (request.maxNightlyPriceUSD < averageNightlyPrice) {
          if (priceDiffPercent > 30) {
            // If the price difference is greater than 30%
            setDialogDescription(
              `The average nightly price is ${formatCurrency(averageNightlyPrice * 100)}. You are requesting ${formatCurrency(request.maxNightlyPriceUSD * 100)}, which is ${priceDiffPercent.toFixed(0)}% less than the average. There may be high chances of not getting an offer at all. Do you still want to submit your request?`,
            );
            shouldOpenDialog = true;
          } else if (priceDiffPercent >= 24 && priceDiffPercent <= 30) {
            // If the price difference is between 24% and 30%
            setDialogDescription(
              `The average nightly price is ${formatCurrency(averageNightlyPrice * 100)}. You are requesting ${formatCurrency(request.maxNightlyPriceUSD * 100)}, which is ${priceDiffPercent.toFixed(0)}% less than the average. There may be a small chance of getting offers. Do you still want to submit your request?`,
            );
            shouldOpenDialog = true;
          }
        }
      }),
    );

    if (shouldOpenDialog) {
      setDialogOpen(true);
    } else {
      void onSubmit(data);
    }
  }

  async function onSubmit(data: FormSchema["data"]) {
    const newRequests = data.map((request) => {
      const {
        date: _date,
        maxNightlyPriceUSD,
        roomType,
        ...restData
      } = request;
      const checkIn = request.date.from;
      const checkOut = request.date.to;
      const numNights = getNumNights(checkIn, checkOut);

      return {
        checkIn: checkIn,
        checkOut: checkOut,
        maxTotalPrice: Math.round(numNights * maxNightlyPriceUSD * 100),
        roomType: roomType === "any" ? undefined : roomType,
        ...restData,
      };
    });

    if (status === "unauthenticated") {
      localStorage.setItem("unsentRequests", JSON.stringify(newRequests));
      void router.push("/auth/signin").then(() => {
        if (newRequests.length === 1) {
          toast({
            title: `Request saved: ${newRequests[0]!.location}`,
            description: "It will be sent after you sign in",
          });
        } else {
          toast({
            title: `Saved ${newRequests.length} requests`,
            description: "They will be sent after you sign in",
          });
        }
      });
    } else {
      try {
        await mutation.mutateAsync(newRequests).catch(() => {
          throw new Error();
        });

        // we need to do this instead of form.reset() since i
        // worked around needing to give defaultValues to useForm
        form.reset();
        form.setValue("data", [defaultValues] as FormSchema["data"]);
        setCurTab(0);

        if (newRequests.length === 1) {
          successfulRequestToast(newRequests[0]!);
        } else {
          toast({
            title: `Successfully submitted ${newRequests.length} requests!`,
            description: "Please check your phone for a confirmation text",
          });
        }
      } catch (e) {
        errorToast();
      }
    }

    setDialogOpen(false);
    afterSubmit?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data.data))}
        key={curTab} // rerender on tab changes (idk why i have to do this myself)
      >
        {mode == "request" && (
          <div className="flex flex-wrap gap-1 pb-2">
            {Array.from({ length: numTabs }).map((_, i) => {
              const isSelected = curTab === i;
              const hasErrors = tabsWithErrors.includes(i);
              const showX = isSelected && numTabs > 1;

              // buttons in buttons arent allowed, so we only show the x button
              // on the tab when the tab is selected, and make the tab a div instead
              // of a button when its selected
              const Comp = showX ? "div" : "button";

              return (
                <Comp
                  key={i}
                  type="button"
                  onClick={showX ? undefined : () => setCurTab(i)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium backdrop-blur-md",
                    hasErrors && "pr-3",
                    isSelected
                      ? "border border-gray-200 bg-white text-black"
                      : "bg-white text-primary hover:bg-neutral-600/60",
                    showX && "pr-2",
                  )}
                >
                  Trip {i + 1}
                  {hasErrors && (
                    <div className="rounded-full bg-red-400 px-1 text-xs font-medium text-black">
                      Errors
                    </div>
                  )}
                  {showX && (
                    <button
                      type="button"
                      onClick={() => {
                        if (curTab === numTabs - 1) {
                          setCurTab(numTabs - 2);
                        }
                        form.setValue(
                          "data",
                          data.filter((_, j) => j !== i),
                        );
                      }}
                      className="rounded-full p-1 hover:bg-black/10 active:bg-black/20"
                    >
                      <XIcon className="size-3" />
                    </button>
                  )}
                </Comp>
              );
            })}
            {numTabs < MAX_REQUEST_GROUP_SIZE && (
              <button
                key=""
                type="button"
                onClick={() => {
                  setCurTab(numTabs);
                  form.setValue("data", [
                    ...data,
                    defaultValues as FormSchema["data"][number],
                  ]);
                  // form.setFocus(`data.${data.length - 1}.location`);
                }}
                className="inline-flex items-center gap-1 rounded-full border-primary bg-accent p-2 pr-4 text-sm font-medium text-primary backdrop-blur-md hover:bg-neutral-600/60"
              >
                <PlusIcon className="size-4" />
                Add a trip
              </button>
            )}
          </div>
        )}

        <div className="flex h-16 gap-2">
          <LPLocationInput
            control={form.control}
            name={`data.${curTab}.location`}
            formLabel="Location"
            className="flex-1"
          />

          <LPDateRangePicker
            control={form.control}
            name={`data.${curTab}.date`}
            formLabel="Check in/Check out"
            className="flex-1"
          />

          <FormField
            control={form.control}
            name={`data.${curTab}.numGuests`}
            render={({ field }) => (
              <LPFormItem className="flex-1">
                <LPFormLabel>Number of guests</LPFormLabel>
                <FormControl>
                  <LPInput
                    {...field}
                    inputMode="numeric"
                    placeholder="Add guests"
                    icon={<UsersRoundIcon className="size-4" />}
                  />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`data.${curTab}.maxNightlyPriceUSD`}
            render={({ field }) => (
              <LPFormItem className="flex-1">
                <LPFormLabel>Maximum price</LPFormLabel>
                <FormControl>
                  <LPInput
                    {...field}
                    inputMode="decimal"
                    placeholder="Price per night"
                    icon={<DollarSignIcon className="size-4" />}
                  />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="button"
            variant="default"
            onClick={form.handleSubmit((data) =>
              checkPriceEstimation(data.data),
            )}
            size="lg"
            className="rounded-md bg-teal-900 py-8 font-semibold hover:bg-teal-950"
          >
            {mode === "search" ? "Search" : "Submit request"}
          </Button>
        </div>
        {mode === "request" && (
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-row justify-between pt-8">
              <div className="flex items-center text-xs text-muted-foreground 2xl:text-sm">
                Instead of just seeing listed prices, requesting a deal lets you
                set your budget, and we&apos;ll match you with hosts who have
                properties in the city and accept your price. This way, you can
                find the perfect place to stay within your means!
              </div>
              {/* <Button
                type="button"
                variant="ghost"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <Filter size={22} strokeWidth={1.5} />
                {isExpanded ? "Hide filters" : "Add filters"}
              </Button> */}
            </div>
            <FiltersSection
              form={form}
              curTab={curTab}
              isExpanded={isExpanded}
            />
            <div className="flex flex-col">
              {/* <AirbnbLinkDialog parentForm={form} curTab={curTab} /> */}
              {/* <AirbnbLinkPopover parentForm={form} curTab={curTab} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Have a property you are eyeing, input the Airbnb link here.
                </p> */}
            </div>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                onClick={form.handleSubmit((data) => onSubmit(data.data))}
                disabled={form.formState.isSubmitting}
                className="rounded-full"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}

function FiltersSection({
  form,
  curTab,
  isExpanded,
}: {
  form: ReturnType<typeof useForm<FormSchema>>;
  curTab: number;
  isExpanded: boolean;
}) {
  // DD is short for dropdown
  const [roomTypeDDIsOpen, setRoomTypeDDIsOpen] = useState(false);

  return (
    isExpanded && (
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name={`data.${curTab}.roomType`}
          render={({ field }) => (
            <LPFormItem>
              <Select
                onValueChange={field.onChange}
                open={roomTypeDDIsOpen}
                onOpenChange={setRoomTypeDDIsOpen}
              >
                <FormControl>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type of place" />
                    <ChevronDown className="size-4" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ALL_PROPERTY_ROOM_TYPES.map((roomType) => (
                    <SelectItem key={roomType} value={roomType}>
                      {roomType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <LPFormMessage />
            </LPFormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`data.${curTab}.minNumBedrooms`}
          render={({ field }) => (
            <LPFormItem>
              <LPFormLabel>Bedrooms</LPFormLabel>
              <FormControl>
                <CounterInput value={field.value} setValue={field.onChange} />
              </FormControl>
              <LPFormMessage className="mt-2" />
            </LPFormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`data.${curTab}.note`}
          render={({ field }) => (
            <LPFormItem>
              <FormControl>
                <LPFormLabel>Additional notes</LPFormLabel>
                <LPInput
                  {...field}
                  icon={<NotebookIcon className="size-4" />}
                />
              </FormControl>
              <LPFormMessage />
            </LPFormItem>
          )}
        />
      </div>
    )
  );
}
