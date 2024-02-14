import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { optional, zodInteger, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { errorToast, successfulRequestToast } from "@/utils/toasts";
import { ALL_PROPERTY_TYPES } from "@/server/db/schema";
import { api } from "@/utils/api";
import { capitalize, cn, getNumNights } from "@/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LPDateRangePicker, {
  LPFormItem,
  LPFormLabel,
  LPInput,
  LPFormMessage,
  classNames,
  LPTextArea,
} from "./components";

const formSchema = z
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
  });

type FormSchema = z.infer<typeof formSchema>;

export default function DesktopSearchBar({
  afterSubmit,
}: {
  afterSubmit?: () => void;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "any",
    },
  });

  const mutation = api.requests.create.useMutation();
  const utils = api.useUtils();
  const router = useRouter();
  const { status } = useSession();

  // const { minNumBedrooms, minNumBeds, propertyType, note } = form.watch();
  // const fmtdFilters = getFmtdFilters({
  //   minNumBedrooms,
  //   minNumBeds,
  //   propertyType: propertyType === "any" ? undefined : propertyType,
  //   note,
  // });

  async function onSubmit(data: FormSchema) {
    const { date: _date, maxNightlyPriceUSD, propertyType, ...restData } = data;
    const checkIn = data.date.from;
    const checkOut = data.date.to;
    const numNights = getNumNights(checkIn, checkOut);

    const newRequest = {
      checkIn: checkIn,
      checkOut: checkOut,
      maxTotalPrice: numNights * maxNightlyPriceUSD * 100,
      propertyType: propertyType === "any" ? undefined : propertyType,
      ...restData,
    };

    if (status === "unauthenticated") {
      localStorage.setItem("unsentRequest", JSON.stringify(newRequest));
      void router.push("/auth/signin").then(() => {
        toast({
          title: `Request saved: ${newRequest.location}`,
          description: "It will be sent after you sign in",
        });
      });
    } else {
      try {
        await mutation.mutateAsync(newRequest).catch(() => {
          throw new Error();
        });
        await utils.requests.invalidate();
        successfulRequestToast(newRequest);
        form.reset();
      } catch (e) {
        errorToast();
      }
    }

    afterSubmit?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-2 rounded-[42px] bg-black/50 p-0.5 backdrop-blur-md lg:grid-cols-11">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <LPFormItem className="col-span-full lg:col-span-4">
                <LPFormLabel>Location</LPFormLabel>
                <FormControl>
                  <LPInput {...field} />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numGuests"
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
            name="maxNightlyPriceUSD"
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
            name="date"
            formLabel="Check in/Check out"
            className="col-span-full lg:col-span-3"
          />

          <div className="col-span-full">
            <FiltersSection form={form} />
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
}: {
  form: ReturnType<typeof useForm<FormSchema>>;
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
            name="minNumBedrooms"
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
            name="minNumBeds"
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
            name="propertyType"
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
            name="note"
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
