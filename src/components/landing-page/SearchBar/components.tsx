import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateRange } from "@/utils/utils";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ChevronDown,
  MapPinIcon,
  Minus,
  Plus,
  SearchIcon,
  UsersIcon,
  X,
} from "lucide-react";
import {
  useForm,
  type FieldPath,
  type FieldValues,
  ControllerRenderProps,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMeasure } from "@uidotdev/usehooks";
import {
  useState,
  type ComponentProps,
  forwardRef,
  ReactElement,
  ReactNode,
} from "react";
import { Calendar } from "@/components/ui/calendar";
import PlacesPopover from "@/components/_common/PlacesPopover";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { type FormSchema as ParentFormSchema } from "./DesktopSearchBar";
import { TRPCError } from "@trpc/server";
import { errorToast } from "@/utils/toasts";
import { Separator } from "@/components/ui/separator";

// LP is short for landing page

export const classNames = {
  wrapper: "group relative",

  label:
    "pointer-events-none absolute left-8 top-3 z-10 text-sm font-semibold text-primary group-focus-within:text-primary",

  // like label but for buttons
  buttonLabel: ({ isFocused }: { isFocused: boolean }) =>
    cn(
      "pointer-events-none absolute left-8 top-3 z-10 text-sm font-semibold text-primary",
      isFocused && "text-black",
    ),

  errorMsg: "pointer-events-none absolute left-8 top-14 z-10",

  input:
    "peer block h-12 w-full rounded-full bg-transparent pt-4 text-primary placeholder:text-muted-foreground hover:bg-white/10  focus:outline-none focus:text-black placeholder:focus:text-black/50",

  // like input but for buttons
  button: ({
    isPlaceholder,
    isFocused,
  }: {
    isPlaceholder: boolean;
    isFocused: boolean;
  }) =>
    cn(
      "peer flex h-20 w-full   pt-4 px-8",
      isFocused ? "bg-white" : "bg-transparent hover:bg-white/10",
      isPlaceholder
        ? cn("text-muted-foreground", isFocused && "text-black/50")
        : cn("text-primary", isFocused && "text-black"),
    ),
  mobileButton: ({
    isPlaceholder,
    isFocused,
  }: {
    isPlaceholder: boolean;
    isFocused: boolean;
  }) =>
    cn(
      "peer flex h-10 w-full border border-gray/50 rounded-full p-6",
      isFocused ? "bg-white" : "bg-white hover:bg-white/75",
      isPlaceholder
        ? cn("text-black/75", isFocused && "text-black/50")
        : cn("text-black", isFocused && "text-black"),
    ),
  mobileErrorMsg: "pointer-events-none my-1",
};

export function LPFormLabel({
  className,
  ...props
}: ComponentProps<typeof FormLabel>) {
  return <FormLabel className={cn(classNames.label, className)} {...props} />;
}

export function LPFormMessage({
  className,
  ...props
}: ComponentProps<typeof FormMessage>) {
  return (
    <FormMessage className={cn(classNames.errorMsg, className)} {...props} />
  );
}

export function LPFormItem({
  className,
  ...props
}: ComponentProps<typeof FormItem>) {
  return <FormItem className={cn(classNames.wrapper, className)} {...props} />;
}

export const LPInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    prefix?: string;
    suffix?: string;
  }
>(function LPInput(
  { className, value, defaultValue, prefix, suffix, placeholder, ...props },
  ref,
) {
  const [prefixRef, { width: prefixWidth }] = useMeasure();
  const [suffixRef, { width: suffixWidth }] = useMeasure();

  const prefixEl = <div ref={prefixRef}>{prefix}</div>;
  const suffixEl = <p ref={suffixRef}>{suffix}</p>;

  return (
    <div className="relative">
      <input
        autoComplete="off"
        placeholder={placeholder ?? ""}
        value={defaultValue ?? value ?? ""}
        className={cn(classNames.input, className)}
        style={{
          paddingLeft: 32 + (prefixWidth ?? 0),
          paddingRight: 32 + (suffixWidth ?? 0),
        }}
        ref={ref}
        {...props}
      />
      <div className="pointer-events-none absolute inset-0 top-4 hidden items-center justify-between px-8 text-white/50 group-focus-within:text-black/50 peer-[&:focus]:flex peer-[&:not(:placeholder-shown)]:flex">
        {prefixEl}
        {suffixEl}
      </div>
    </div>
  );
});

// export function LPTextArea({
// value,
// defaultValue,
// className,
// ...props
// }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
// return (
// <textarea
// className={cn(classNames.input, "px-8 pt-8", className)}
// value={defaultValue ?? value ?? ""}
// {...props}
// />
// );
// }

export function LPLocationInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  formLabel,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className: string;
  formLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <LPFormItem className={className}>
          <FormLabel
            className={`ml-[-15px] mt-[-5px] ${classNames.buttonLabel({ isFocused: isOpen })}`}
          >
            {formLabel}
          </FormLabel>

          <PlacesPopover
            open={isOpen}
            setOpen={setIsOpen}
            value={field.value}
            onValueChange={field.onChange}
            className=" w-60 -translate-y-14 overflow-clip px-0 pt-0 2xl:w-80"
            trigger={({ value, disabled }) => (
              <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                  classNames.button({
                    isPlaceholder: !field.value,
                    isFocused: isOpen,
                  }),
                  "flex items-center text-left",
                )}
              >
                <MapPinIcon className="mx-auto mb-4 ml-[-16px] h-5 w-5 text-primary" />
                <p className="mb-4 ml-2 flex-1 truncate text-xs xl:text-sm">
                  {value ?? "Enter your destination"}
                </p>
              </button>
            )}
          />
          <LPFormMessage className="mt-2" />
        </LPFormItem>
      )}
    />
  );
}

export default function LPDateRangePicker<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  formLabel,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className: string;
  formLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <LPFormItem className={className}>
          <FormLabel
            className={`ml-[-15px] mt-[-5px] ${classNames.buttonLabel({ isFocused: isOpen })}`}
          >
            {formLabel}
          </FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  classNames.button({
                    isPlaceholder: !field.value,
                    isFocused: isOpen,
                  }),
                  "mb-4 flex items-center text-sm",
                )}
              >
                <CalendarIcon className="mb-4 ml-[-15px] mr-3 h-5 w-5 text-primary" />
                {field.value ? (
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  <p className="mb-4">
                    {formatDateRange(field.value.from, field.value.to)}
                  </p>
                ) : (
                  <p className="mb-4 whitespace-nowrap text-xs xl:text-sm">
                    Select dates
                  </p>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto -translate-y-8 p-0 backdrop-blur-md"
              align="start"
              side="top"
            >
              <Calendar
                mode="range"
                selected={field.value}
                onSelect={(e) => {
                  if (e?.from && e.to === undefined) {
                    e.to = e.from;
                  }
                  field.onChange(e);
                }}
                disabled={(date) => date < new Date()}
                numberOfMonths={1}
                showOutsideDays={true}
              />
            </PopoverContent>
          </Popover>
          <LPFormMessage className="mt-2" />
        </LPFormItem>
      )}
    />
  );
}

export function DesktopGuestsPicker<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [numGuests, setNumGuests] = useState(1);
  const [numRooms, setNumRooms] = useState(1);
  const [numBathrooms, setNumBathrooms] = useState(1);
  const [numBeds, setNumBeds] = useState(1);

  function onClick(
    adjustment: number,
    field: ControllerRenderProps<TFieldValues, TName>,
  ) {
    const guests = Math.max(1, Math.min(10, numGuests + adjustment));
    const rooms = Math.max(1, Math.min(10, numRooms + adjustment));
    const bathrooms = Math.max(1, Math.min(10, numBathrooms + adjustment));
    const beds = Math.max(1, Math.min(10, numBeds + adjustment));

    setNumGuests(guests);
    field.onChange(guests);
    setNumGuests(rooms);
    field.onChange(rooms);
    setNumBathrooms(bathrooms);
    field.onChange(bathrooms);
    setNumBeds(beds);
    field.onChange(beds);
  }

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                className={`border-xl focus:primary mx-2 h-11 rounded-xl border-2 border-border px-3 text-sm ${field.value ? "text-primary" : "text-muted-foreground"}`}
              >
                {field.value
                  ? `Beds(${field.value}) Bathrooms(${field.value}) Bedrooms(${field.value})`
                  : "Beds (Any) Bathrooms(Any) Bedrooms(Any)"}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full bg-white p-0 tracking-tight"
              align="start"
              side="bottom"
            >
              <div className=" flex w-96 flex-col items-center gap-y-3 bg-white px-6 py-4">
                <div className="flex w-full items-center justify-between gap-y-2 space-x-2 bg-white">
                  Beds
                  <div className="flex flex-row gap-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 shrink-0 rounded-full border-2"
                      onClick={() => onClick(-1, field)}
                      disabled={numGuests <= 1}
                    >
                      <Minus className="h-6 w-6" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="text-center">
                      <div className="font-bold tracking-tighter">
                        {numGuests}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 shrink-0 rounded-full"
                      onClick={() => onClick(1, field)}
                      disabled={numGuests >= 10}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-y-2 space-x-2 bg-white">
                  Bathrooms
                  <div className="flex flex-row gap-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 shrink-0 rounded-full border-2"
                      onClick={() => onClick(-1, field)}
                      disabled={numGuests <= 1}
                    >
                      <Minus className="h-6 w-6" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="text-center">
                      <div className="font-bold tracking-tighter">
                        {numGuests}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 shrink-0 rounded-full"
                      onClick={() => onClick(1, field)}
                      disabled={numGuests >= 10}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-y-2 space-x-2 bg-white">
                  Bedrooms
                  <div className="flex flex-row gap-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 shrink-0 rounded-full border-2"
                      onClick={() => onClick(-1, field)}
                      disabled={numGuests <= 1}
                    >
                      <Minus className="h-6 w-6" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="text-center">
                      <div className="font-bold tracking-tighter">
                        {numGuests}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 shrink-0 rounded-full"
                      onClick={() => onClick(1, field)}
                      disabled={numGuests >= 10}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                </div>
                <Separator className="my-2 w-full" />
                <Button className="mx-2 w-full">Done</Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}
    />
  );
}

export function MobileLocationInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  formLabel,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className: string;
  formLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <>
          <FormLabel className="text-black">{formLabel}</FormLabel>

          <PlacesPopover
            open={isOpen}
            setOpen={setIsOpen}
            value={field.value}
            onValueChange={field.onChange}
            className="w-96 -translate-y-14 overflow-clip px-0 pt-0"
            trigger={({ value, disabled }) => (
              <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                  classNames.mobileButton({
                    isPlaceholder: !field.value,
                    isFocused: isOpen,
                  }),
                  "flex items-center text-left",
                )}
              >
                <SearchIcon className="mr-3 h-5 w-5 shrink-0" />
                <p className="flex-1 truncate">
                  {value ?? "Enter your destination"}
                </p>
              </button>
            )}
          />
          <MobileFormMessage />
        </>
      )}
    />
  );
}

export function MobileDateRangePicker<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  formLabel,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className: string;
  formLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <>
          <FormLabel className="text-black">{formLabel}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  classNames.mobileButton({
                    isPlaceholder: !field.value,
                    isFocused: isOpen,
                  }),
                  "flex items-center",
                )}
              >
                <CalendarDaysIcon className="mr-3 h-5 w-5 shrink-0" />
                {field.value
                  ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    formatDateRange(field.value.from, field.value.to)
                  : "Select dates"}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 backdrop-blur-md"
              align="center"
              side="top"
            >
              <Calendar
                mode="range"
                selected={field.value}
                onSelect={(e) => {
                  if (e?.from && e.to === undefined) {
                    e.to = e.from;
                  }
                  field.onChange(e);
                }}
                disabled={(date) => date < new Date()}
                numberOfMonths={1}
                showOutsideDays={true}
              />
            </PopoverContent>
          </Popover>
          <MobileFormMessage />
        </>
      )}
    />
  );
}

export function MobileGuestsPicker<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  formLabel,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className: string;
  formLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [numGuests, setNumGuests] = useState(1);

  function onClick(
    adjustment: number,
    field: ControllerRenderProps<TFieldValues, TName>,
  ) {
    const guests = Math.max(1, Math.min(10, numGuests + adjustment));

    setNumGuests(guests);
    field.onChange(guests);
  }

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <>
          <FormLabel className="text-black">{formLabel}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  classNames.mobileButton({
                    isPlaceholder: !field.value,
                    isFocused: isOpen,
                  }),
                  "flex items-center",
                )}
              >
                <UsersIcon className="mr-3 h-5 w-5 shrink-0" />
                {field.value ?? "Add guests"}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 backdrop-blur-md"
              align="start"
              side="bottom"
            >
              <div className="flex items-center justify-between space-x-2">
                Guests
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(-1, field)}
                  disabled={numGuests <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="font-bold tracking-tighter">{numGuests}</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(1, field)}
                  disabled={numGuests >= 10}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <MobileFormMessage />
        </>
      )}
    />
  );
}
export function MobilePriceInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  formLabel,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className: string;
  formLabel: string;
}) {
  const [price, setPrice] = useState(0);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <>
          <FormLabel className="text-black">{formLabel}</FormLabel>
          <LPFormItem></LPFormItem>
          <MobileFormMessage />
        </>
      )}
    />
  );
}
export function MobileFormMessage({
  className,
  ...props
}: ComponentProps<typeof FormMessage>) {
  return (
    <FormMessage
      className={cn(classNames.mobileErrorMsg, className)}
      {...props}
    />
  );
}

export function AirbnbLinkDialog({
  parentForm,
  curTab,
}: {
  parentForm: ReturnType<typeof useForm<ParentFormSchema>>;
  curTab: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const utils = api.useUtils();

  const formSchema = z.object({
    airbnbLink: zodString({ maxLen: 512 }),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    const response = await utils.misc.scrapeUsingLink.fetch({
      url: data.airbnbLink,
    });

    if (response instanceof TRPCError) {
      errorToast("Couldn't retrieve data from AirBnB, please try again.");
    } else {
      parentForm.setValue(`data.${curTab}.airbnbLink`, data.airbnbLink);
      parentForm.setValue(
        `data.${curTab}.maxNightlyPriceUSD`,
        response.nightlyPrice,
      );
      parentForm.setValue(`data.${curTab}.location`, response.propertyName);
      parentForm.setValue(`data.${curTab}.date.from`, response.checkIn);
      parentForm.setValue(`data.${curTab}.date.to`, response.checkOut);
      parentForm.setValue(`data.${curTab}.numGuests`, response.numGuests);

      setDialogOpen(false);
    }
  };

  return (
    <div>
      {parentForm.getValues(`data.${curTab}.airbnbLink`) === undefined ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={() => setDialogOpen(true)}
        >
          Add a Link
          <ChevronDown />
        </Button>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-full text-xs "
          onClick={() => setDialogOpen(true)}
        >
          <X />
          {parentForm.getValues(`data.${curTab}.airbnbLink`)!.substring(0, 50)}
          ...
        </Button>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Add an Airbnb link</DialogTitle>
          <p className="my-2">
            Are you currently eyeing any properties on Airbnb? Enter the link
            below and we will try to get you that exact stay at a discount!
          </p>

          <Form {...form}>
            <form className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name={"airbnbLink"}
                defaultValue={parentForm.getValues(`data.${curTab}.airbnbLink`)}
                render={({ field }) => (
                  <LPFormItem className="">
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter link" />
                    </FormControl>
                    <FormMessage />
                  </LPFormItem>
                )}
              />

              <Button
                type="submit"
                onClick={form.handleSubmit((data) => onSubmit(data))}
                disabled={form.formState.isSubmitting}
                className="rounded-full"
              >
                {form.formState.isSubmitting ? "Crunching data..." : "Add"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function AirbnbLinkPopover({
  parentForm,
  curTab,
}: {
  parentForm: ReturnType<typeof useForm<ParentFormSchema>>;
  curTab: number;
}) {
  const utils = api.useUtils();

  const formSchema = z.object({
    airbnbLink: zodString({ maxLen: 512 }),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    const response = await utils.misc.scrapeUsingLink.fetch({
      url: data.airbnbLink,
    });

    if (response instanceof TRPCError) {
      errorToast("Couldn't retrieve data from AirBnB, please try again.");
    } else {
      parentForm.setValue(`data.${curTab}.airbnbLink`, data.airbnbLink);
      parentForm.setValue(
        `data.${curTab}.maxNightlyPriceUSD`,
        response.nightlyPrice,
      );
      parentForm.setValue(`data.${curTab}.location`, response.propertyName);
      parentForm.setValue(`data.${curTab}.date.from`, response.checkIn);
      parentForm.setValue(`data.${curTab}.date.to`, response.checkOut);
      parentForm.setValue(`data.${curTab}.numGuests`, response.numGuests);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          {parentForm.getValues(`data.${curTab}.airbnbLink`) === undefined ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
            >
              Add a Link
              <ChevronDown />
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full text-xs"
            >
              <X />
              {parentForm
                .getValues(`data.${curTab}.airbnbLink`)!
                .substring(0, 50)}
              ...
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent align="start">
          <Form {...form}>
            <form className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name={"airbnbLink"}
                defaultValue={parentForm.getValues(`data.${curTab}.airbnbLink`)}
                render={({ field }) => (
                  <LPFormItem className="">
                    <FormLabel>
                      <p>Airbnb Link</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter link" />
                    </FormControl>
                    <FormMessage />
                  </LPFormItem>
                )}
              />

              <Button
                type="submit"
                onClick={form.handleSubmit((data) => onSubmit(data))}
                disabled={form.formState.isSubmitting}
                className="rounded-full"
              >
                {form.formState.isSubmitting ? "Crunching data..." : "Add"}
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
