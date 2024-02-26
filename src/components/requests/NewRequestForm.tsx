import { forwardRef, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { optional, zodInteger, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { errorToast, successfulRequestToast } from "@/utils/toasts";
import { ALL_PROPERTY_TYPES } from "@/server/db/schema";
import { api } from "@/utils/api";
import { getFmtdFilters } from "@/utils/formatters";
import { capitalize, getNumNights, plural, useIsDesktop } from "@/utils/utils";
import DateRangePicker from "../_common/DateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  NestedDrawer,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { DialogClose } from "../ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import OTPDialog from "../otp-dialog/OTPDialog";
import { formatPhoneNumber } from "@/utils/formatters";
import PlacesInput from "../_common/PlacesInput";
import { map } from "@trpc/server/observable";
import ErrorMsg from "../ui/ErrorMsg";

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

export default function NewRequestForm({
  afterSubmit,
}: {
  afterSubmit?: () => void;
}) {
  const { status } = useSession();

  const isDesktop = useIsDesktop();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "any",
    },
  });

  const createRequestsMutation = api.requests.create.useMutation();

  const smsMutation = api.twilio.sendSMS.useMutation();

  const utils = api.useUtils();
  const router = useRouter();

  const { minNumBedrooms, minNumBeds, propertyType, note } = form.watch();
  const fmtdFilters = getFmtdFilters({
    minNumBedrooms,
    minNumBeds,
    propertyType: propertyType === "any" ? undefined : propertyType,
    note,
  });

  const invalidFields = Object.keys(form.formState.errors);

  const numFiltersErrors = [
    "minNumBedrooms",
    "minNumBeds",
    "propertyType",
    "note",
  ].filter((field) => invalidFields.includes(field)).length;

  const [toPhoneNumber, setToPhoneNumber] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);

  const [verified, setVerified] = useState<boolean>(false);

  const verifiedRef = useRef<boolean>(verified);

  const waitForVerification = async () => {
    return new Promise<void>((resolve) => {
      if (verifiedRef.current) {
        resolve();
      } else {
        const unsubscribe = () => {
          if (verifiedRef.current) {
            resolve();
            clearInterval(interval);
          }
        };

        const interval = setInterval(unsubscribe, 100);
      }
    });
  };

  useEffect(() => {
    verifiedRef.current = verified;
  }, [verified]);

  async function onSubmit(data: FormSchema) {
    await waitForVerification();

    setOpen(false);

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
      localStorage.setItem("unsentRequests", JSON.stringify(newRequest));
      void router.push("/auth/signin").then(() => {
        toast({
          title: `Request saved: ${newRequest.location}`,
          description: "It will be sent after you sign in",
        });
      });
    } else {
      try {
        await createRequestsMutation.mutateAsync(newRequest).catch(() => {
          throw new Error();
        });
        await smsMutation.mutateAsync({
          msg: "You just submitted a request on Tramona! Reply 'YES' if you're serious about your travel plans and we can send the request to our network of hosts!",
          to: formatPhoneNumber(toPhoneNumber),
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <PlacesInput
          control={form.control}
          name="location"
          formLabel="Location"
          className="col-span-full sm:col-span-1"
        />

        <FormField
          control={form.control}
          name="maxNightlyPriceUSD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name your price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="decimal"
                  prefix="$"
                  suffix="/night"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of guests</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DateRangePicker
          control={form.control}
          name="date"
          formLabel="Check in/Check out"
          className="col-span-full sm:col-span-1"
        />

        <FormItem className="col-span-full">
          <FormLabel>Filters (optional)</FormLabel>
          {isDesktop ? (
            <Popover>
              <PopoverTrigger asChild>
                <FiltersButton fmtdFilters={fmtdFilters} />
              </PopoverTrigger>
              <PopoverContent align="start" side="top" className="w-96 p-2">
                <p className="pb-4 pt-1 text-lg font-semibold">
                  Add filters (optional)
                </p>
                <FiltersSection form={form} />
              </PopoverContent>
            </Popover>
          ) : (
            <NestedDrawer>
              <DrawerTrigger asChild>
                <FiltersButton fmtdFilters={fmtdFilters} />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Add filters (optional)</DrawerTitle>
                </DrawerHeader>
                <FiltersSection form={form} />
                <DrawerFooter>
                  <DialogClose asChild>
                    <Button>Done</Button>
                  </DialogClose>
                </DrawerFooter>
              </DrawerContent>
            </NestedDrawer>
          )}
          <ErrorMsg>
            {numFiltersErrors > 0 && plural(numFiltersErrors, "error")}
          </ErrorMsg>
        </FormItem>

        <Dialog open={open} onOpenChange={setOpen}>
          <Button
            disabled={form.formState.isSubmitting}
            size="lg"
            type="submit"
            className="col-span-full"
            onClick={() => {
              if (form.formState.isValid) {
                setOpen(true);
              }
            }}
          >
            Request Deal
          </Button>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Phone number verification</DialogTitle>
              <DialogDescription>
                I want to receive sms texts through phone
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 p-4 py-4">
              <div className="flex flex-row items-center gap-4">
                <Label>Phone number</Label>
                <Input
                  id="phone-number"
                  value={toPhoneNumber}
                  onChange={(e) => {
                    setToPhoneNumber(e.target.value);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <OTPDialog
                toPhoneNumber={formatPhoneNumber(toPhoneNumber)}
                setVerified={setVerified}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}

const FiltersButton = forwardRef<
  HTMLButtonElement,
  { fmtdFilters: string | undefined }
>(({ fmtdFilters, ...props }, ref) => (
  <Button
    type="button"
    variant={fmtdFilters ? "filledInput" : "emptyInput"}
    {...props}
    ref={ref}
  >
    <p className="overflow-clip text-ellipsis">
      {fmtdFilters ?? "Add filters"}
    </p>
    <FilterIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
  </Button>
));

FiltersButton.displayName = "FiltersButton";

function FiltersSection({
  form,
}: {
  form: ReturnType<typeof useForm<FormSchema>>;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="minNumBedrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Bedrooms</FormLabel>
            <FormControl>
              <Input {...field} inputMode="numeric" suffix="or more" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="minNumBeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Beds</FormLabel>
            <FormControl>
              <Input {...field} inputMode="numeric" suffix="or more" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Property Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="note"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Additional notes</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="resize-none"
                placeholder="e.g. Pet friendly, close to the ocean"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
