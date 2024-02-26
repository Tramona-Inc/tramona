import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ALL_PROPERTY_TYPES } from "@/server/db/schema";
import { api } from "@/utils/api";
import { errorToast, successfulRequestToast } from "@/utils/toasts";
import { capitalize, cn, getNumNights } from "@/utils/utils";
import { optional, zodInteger, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
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
  classNames,
} from "./components";

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
          propertyType: z.enum([...ALL_PROPERTY_TYPES, "any"]),
          minNumBedrooms: optional(zodInteger()),
          minNumBeds: optional(zodInteger()),
          note: optional(zodString()),
        })
        .refine((data) => data.date.to > data.date.from, {
          message: "Must stay for at least 1 night",
          path: ["date"],
        }),
    )
    .nonempty(),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: Partial<FormSchema["data"][number]> = {
  propertyType: "any",
};

export default function DesktopSearchBar({
  afterSubmit,
}: {
  afterSubmit?: () => void;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: [defaultValues],
    },
    context: {
      test: 123,
    },
  });

  const [curTab, setCurTab] = useState(0);
  const MAX_TRIPS = 10;

  const mutation = api.requests.createMultiple.useMutation();
  const utils = api.useUtils();
  const router = useRouter();
  const { status } = useSession();

  const { data } = form.watch();
  const numTabs = data.length;

  const tabsWithErrors =
    form.formState.errors.data
      ?.map?.((error, index) => (error ? index : null))
      .filter((i): i is number => i !== null) ?? [];

  // const { minNumBedrooms, minNumBeds, propertyType, note } = form.watch();
  // const fmtdFilters = getFmtdFilters({
  //   minNumBedrooms,
  //   minNumBeds,
  //   propertyType: propertyType === "any" ? undefined : propertyType,
  //   note,
  // });

  async function onSubmit(data: FormSchema["data"]) {
    const newRequests = data.map((request) => {
      const {
        date: _date,
        maxNightlyPriceUSD,
        propertyType,
        ...restData
      } = request;
      const checkIn = request.date.from;
      const checkOut = request.date.to;
      const numNights = getNumNights(checkIn, checkOut);

      return {
        checkIn: checkIn,
        checkOut: checkOut,
        maxTotalPrice: numNights * maxNightlyPriceUSD * 100,
        propertyType: propertyType === "any" ? undefined : propertyType,
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
        await utils.requests.invalidate();

        // we need to do this instead of form.reset() since i
        // worked around needing to give defaultValues to useForm
        form.setValue("data", [defaultValues] as FormSchema["data"]);
        setCurTab(0);

        if (newRequests.length === 1) {
          successfulRequestToast(newRequests[0]!);
        } else {
          toast({
            title: `Successfully submitted ${newRequests.length} requests`,
          });
        }
      } catch (e) {
        errorToast();
      }
    }

    afterSubmit?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data.data))}
        className="space-y-2"
        key={curTab} // rerender on tab changes (idk why i have to do this myself)
      >
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
                    ? "bg-white text-black"
                    : "bg-black/50 text-white hover:bg-neutral-600/60",
                  showX && "pr-2",
                )}
              >
                Trip {i + 1}
                {hasErrors && (
                  <div className="rounded-full bg-red-400 px-1 text-xs font-medium text-black">
                    errors
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
                        // need `as` since zod nonempty arrays are typed as [T, ...T[]] but filter just returns T[]
                        data.filter((_, j) => j !== i) as FormSchema["data"],
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
          {numTabs < MAX_TRIPS && (
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
              className="inline-flex items-center gap-1 rounded-full bg-black/50 p-2 pr-4 text-sm font-medium text-white backdrop-blur-md hover:bg-neutral-600/60"
            >
              <PlusIcon className="size-4" />
              Add another trip
            </button>
          )}
          {numTabs >= MAX_TRIPS && (
            <div className="text-sm text-red-500">
              Maximum of {MAX_TRIPS} trips reached.
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 rounded-[42px] bg-black/50 p-0.5 backdrop-blur-md lg:grid-cols-11">
          <LPLocationInput
            control={form.control}
            name={`data.${curTab}.location`}
            formLabel="Location"
            className="col-span-full lg:col-span-4"
          />

          <FormField
            control={form.control}
            name={`data.${curTab}.numGuests`}
            render={({ field }) => (
              <LPFormItem className="lg:col-span-2">
                <LPFormLabel>Number of guests</LPFormLabel>
                <FormControl>
                  <LPInput {...field} inputMode="numeric" />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`data.${curTab}.maxNightlyPriceUSD`}
            render={({ field }) => (
              <LPFormItem className="lg:col-span-2">
                <LPFormLabel>Name your price</LPFormLabel>
                <FormControl>
                  <LPInput
                    {...field}
                    inputMode="decimal"
                    prefix="$"
                    suffix="/night"
                  />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />

          <LPDateRangePicker
            control={form.control}
            name={`data.${curTab}.date`}
            formLabel="Check in/Check out"
            className="col-span-full lg:col-span-3"
          />

          <div className="col-span-full">
            <FiltersSection form={form} curTab={curTab} />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            disabled={form.formState.isSubmitting}
            size="lg"
            type="submit"
            variant="white"
            className="rounded-full"
          >
            Request Deal
          </Button>
        </div>
      </form>
    </Form>
  );
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
}: {
  form: ReturnType<typeof useForm<FormSchema>>;
  curTab: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // DD is short for dropdown
  const [propertyTypeDDIsOpen, setPropertyTypeDDIsOpen] = useState(false);

  return (
    <div>
      {isExpanded && (
        <div className="grid grid-cols-2 lg:grid-cols-5">
          <FormField
            control={form.control}
            name={`data.${curTab}.minNumBedrooms`}
            render={({ field }) => (
              <LPFormItem>
                <LPFormLabel>Bedrooms</LPFormLabel>
                <FormControl>
                  <LPInput {...field} inputMode="numeric" suffix="or more" />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`data.${curTab}.minNumBeds`}
            render={({ field }) => (
              <LPFormItem>
                <LPFormLabel>Beds</LPFormLabel>
                <FormControl>
                  <LPInput {...field} inputMode="numeric" suffix="or more" />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`data.${curTab}.propertyType`}
            render={({ field }) => (
              <LPFormItem className="col-span-full lg:col-span-1">
                <FormLabel
                  className={classNames.buttonLabel({
                    isFocused: propertyTypeDDIsOpen,
                  })}
                >
                  Property Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  open={propertyTypeDDIsOpen}
                  onOpenChange={setPropertyTypeDDIsOpen}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        classNames.button({
                          isPlaceholder: field.value === "any",
                          isFocused: propertyTypeDDIsOpen,
                        }),
                        "text-base",
                      )}
                    >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {ALL_PROPERTY_TYPES.map((propertyType) => (
                      <SelectItem key={propertyType} value={propertyType}>
                        {capitalize(propertyType)}
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
            name={`data.${curTab}.note`}
            render={({ field }) => (
              <LPFormItem className="col-span-2">
                <LPFormLabel>Additional notes</LPFormLabel>
                <FormControl>
                  <LPInput
                    {...field}
                    placeholder="e.g. Pet friendly, close to the ocean"
                  />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />
        </div>
      )}
      <div className="flex justify-center p-2">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white hover:bg-white/20"
        >
          {isExpanded ? "Hide filters" : "Add filters (optional)"}
        </button>
      </div>
    </div>
  );
}
