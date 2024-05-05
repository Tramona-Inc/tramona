import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
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
  InfoIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import LPDateRangePicker, {
  AirbnbLinkDialog,
  AirbnbLinkPopover,
  classNames,
  DesktopGuestsPicker,
  LPFormItem,
  LPFormLabel,
  LPFormMessage,
  LPInput,
  LPLocationInput,
} from "./components";
import { SelectIcon } from "@radix-ui/react-select";
import { Info } from "../../email-templates/EmailComponentsWithoutHost";

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
          minNumBedrooms: optional(zodInteger()),
          minNumBeds: optional(zodInteger()),
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
    // <>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data.data))}
        className="space-y-2"
        key={curTab} // rerender on tab changes (idk why i have to do this myself)
      >
        {mode == "request" && (
          <div className="flex flex-wrap gap-1">
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
        <div className="flex-col rounded-3xl bg-white pb-6 backdrop-blur-md">
          <div className="flex flex-row items-center gap-x-2">
            <LPLocationInput
              control={form.control}
              name={`data.${curTab}.location`}
              formLabel="Location"
              className=" relative h-[66px] rounded-lg border-2 border-border 2xl:pr-24"
            />

            <LPDateRangePicker
              control={form.control}
              name={`data.${curTab}.date`}
              formLabel="Check in/Check out"
              className="h-[66px] rounded-lg border-2 border-border pr-2 lg:pr-9 2xl:pr-36"
            />

            <div className=" z-20 flex h-[66px] flex-row items-center justify-start rounded-md border-2 border-border px-4">
              <UsersRoundIcon className="z-20 mr-[-23px] mt-4 h-5 w-5" />
              <div className=" z-10 flex flex-row items-center 2xl:mr-20">
                <FormField
                  control={form.control}
                  name={`data.${curTab}.numGuests`}
                  render={({ field }) => (
                    <LPFormItem className=" z-10">
                      <LPFormLabel className="z-20 mb-10 ml-[-32px] mt-[-7px] whitespace-nowrap text-xs xl:text-sm">
                        Number of guests
                      </LPFormLabel>
                      <FormControl>
                        <LPInput
                          {...field}
                          inputMode="numeric"
                          placeholder="Add guests"
                          className="z-10 ml-1 h-16 text-xs xl:text-sm "
                        />
                      </FormControl>
                      <LPFormMessage className="mt-2" />
                    </LPFormItem>
                  )}
                />
              </div>
            </div>

            <div className=" flex h-[66px] flex-row items-center justify-start rounded-md border-2 border-border px-2">
              <DollarSignIcon className="z-50 mr-[-23px] mt-4 h-5 w-5" />
              <div className="z-10 flex flex-row items-center 2xl:mr-20">
                <FormField
                  control={form.control}
                  name={`data.${curTab}.maxNightlyPriceUSD`}
                  render={({ field }) => (
                    <LPFormItem className=" z-10">
                      <LPFormLabel className="z-20 ml-[-28px] mt-[-7px] text-sm ">
                        Price range
                      </LPFormLabel>
                      <FormControl>
                        <LPInput
                          {...field}
                          inputMode="decimal"
                          placeholder="Price per night"
                          className="z-10 h-16 text-xs xl:text-sm"
                        />
                      </FormControl>
                      <LPFormMessage className="mt-2" />
                    </LPFormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                disabled={form.formState.isSubmitting}
                type="button"
                variant="default"
                onClick={form.handleSubmit((data) =>
                  checkPriceEstimation(data.data),
                )}
                size="lg"
                className=" rounded-lg py-8 font-semibold"
              >
                {mode === "search" ? "Search" : "Submit request"}
              </Button>
            </div>
          </div>
          {mode === "request" && (
            <div className="flex flex-col gap-y-4">
              <div className="flex w-11/12 flex-row justify-between">
                <div className="flex w-10/12 items-center pt-3 text-xs text-[#004236] 2xl:text-sm">
                  Instead of just seeing listed prices, requesting a deal lets
                  you set your budget, and we&apos;ll match you with hosts who
                  have properties in the city and accept your price. This way,
                  you can find the perfect place to stay within your means!
                </div>
                <div className="flex flex-row items-center p-3">
                  <Filter size={22} strokeWidth={1.5} />
                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="whitespace-nowrap rounded-full bg-white/10 py-1 pl-1 text-sm font-medium text-primary hover:bg-white/20"
                  >
                    {isExpanded ? "Hide filters" : "Add filters"}
                  </button>
                </div>
              </div>
              <FiltersSection
                form={form}
                curTab={curTab}
                isExpanded={isExpanded}
              />
              <div className="flex flex-col">
                {/* <AirbnbLinkDialog parentForm={form} curTab={curTab} /> */}
                <AirbnbLinkPopover parentForm={form} curTab={curTab} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Have a property you are eyeing, input the Airbnb link here.
                </p>
              </div>
            </div>
          )}
        </div>

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
{
  /* <form onSubmit={(event) => handleSubmit(event)} className="mt-4">
        <input
          type="text"
          value={airbnbUrl}
          onChange={(event) => setAirbnbUrl(event.target.value)}
          placeholder="Enter Airbnb URL"
          className="border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:border-indigo-500"
          disabled={loading} // Disable input field while loading
        />
        <button type="submit" className="bg-indigo-500 text-white rounded-md px-4 py-2 focus:outline-none hover:bg-indigo-600" disabled={loading}>
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
        {combinedScrapedData && <div className="ml-4">Scraped Price: {combinedScrapedData}</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form> */
}
{
  /* </> */
}

// const FiltersButton = forwardRef<
//   HTMLButtonElement,
//   { fmtdFilters: string | undefined }
// >(({ fmtdFilters, ...props }, ref) => (
//   <Button
//     type="button"
//     variant={fmtdFilters ? "filledInput" : "emptyInput"}
//     className="pl-3"
//     {...props}
//     ref={ref}
//   >
//     <p className="overflow-clip text-ellipsis">
//       {fmtdFilters ?? "Add filters"}
//     </p>
//     <FilterIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
//   </Button>
// ));

// FiltersButton.displayName = "FiltersButton";

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
      <div className=" After the flow what elsex-3 grid max-w-fit grid-cols-2 grid-rows-1 justify-start lg:grid-cols-4  lg:justify-start">
        <FormField
          control={form.control}
          name={`data.${curTab}.roomType`}
          render={({ field }) => (
            <LPFormItem className="col-span-1 border-none bg-white text-base">
              <Select
                onValueChange={field.onChange}
                open={roomTypeDDIsOpen}
                onOpenChange={setRoomTypeDDIsOpen}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl border-2 border-border bg-white">
                    <SelectValue
                      className="SelectValue"
                      placeholder="Type of place"
                    />
                    <SelectIcon>
                      <ChevronDown className="h-4 w-4" />
                    </SelectIcon>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {ALL_PROPERTY_ROOM_TYPES.map((roomType) => (
                    <SelectItem key={roomType} value={roomType}>
                      {roomType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <LPFormMessage className="mt-2" />
            </LPFormItem>
          )}
        />
        {/* Beds Bathroom Bedrooms filter */}
        <FormField
          control={form.control}
          name={`data.${curTab}.minNumBedrooms`}
          render={({ field }) => (
            <LPFormItem>
              <FormControl>
                <DesktopGuestsPicker name="numOfBeds" className="text-sm" />
              </FormControl>
              <LPFormMessage className="mt-2" />
            </LPFormItem>
          )}
        />
        {/* <FormField
              control={form.control}
              name={`data.${curTab}.minNumBeds`}
              render={({ field }) => (
                <LPFormItem>
                  <LPFormLabel>Beds</LPFormLabel>
                  <FormControl>
                    <LPInput {...field} inputMode="numeric" suffix="or more" />
                  </FormControl>
                  <LPFormMessage className="mt-2" />
                </LPFormItem>
              )}
            /> */}

        <FormField
          control={form.control}
          name={`data.${curTab}.note`}
          render={({ field }) => (
            <LPFormItem className="relative z-20 col-span-2 h-11 rounded-lg border-2 border-border">
              <FormControl>
                <LPInput
                  {...field}
                  placeholder="Additional notes"
                  className=" mt-[-3px] h-8 text-sm"
                />
              </FormControl>
              <LPFormMessage className="z-10 mt-5" />
            </LPFormItem>
          )}
        />
      </div>
    )
  );
}
