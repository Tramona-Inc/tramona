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
  SearchIcon,
  UsersIcon,
  DollarSignIcon,
  X,
} from "lucide-react";
import { useForm, type FieldPath, type FieldValues } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMeasure } from "@uidotdev/usehooks";
import { useState, type ComponentProps, forwardRef } from "react";
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
import { CounterInput } from "@/components/_common/CounterInput";

// LP is short for landing page

export const classNames = {
  wrapper: "group relative",

  label:
    "pointer-events-none absolute left-2 top-2 z-10 text-xs font-bold text-secondary-foreground group-focus-within:text-primary",

  // like label but for buttons
  buttonLabel: ({ isFocused }: { isFocused: boolean }) =>
    cn(
      "pointer-events-none absolute left-8 top-3 z-10 text-xs font-bold text-primary",
      isFocused && "text-black",
    ),

  errorMsg: "pointer-events-none absolute left-8 top-14 z-10",

  input:
    "focus:outline-none text-left block h-16 pt-4 text-sm placeholder:text-muted-foreground px-6 absolute inset-0 text-foreground rounded-md border",

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
      "peer flex h-10 w-full border border-gray/50 rounded-md p-6",
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
    icon: React.ReactNode;
  }
>(function LPInput(
  {
    className,
    value,
    defaultValue,
    prefix,
    suffix,
    placeholder,
    icon,
    ...props
  },
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
      <div className=" pointer-events-none absolute left-2 top-8">{icon}</div>
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
        <LPFormItem className={cn(classNames.wrapper, className)}>
          <FormLabel className={classNames.label}>{formLabel}</FormLabel>
          <PlacesPopover
            open={isOpen}
            setOpen={setIsOpen}
            value={field.value}
            onValueChange={field.onChange}
            className="w-80 -translate-x-1 -translate-y-12 overflow-clip px-0 pt-0 2xl:w-96"
            trigger={({ value, disabled }) => (
              <button
                className={cn(classNames.input, "pl-8")}
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
              >
                <p
                  className={cn(
                    "line-clamp-1",
                    !value && "text-muted-foreground",
                  )}
                >
                  {value ?? "Enter your destination"}
                </p>
              </button>
            )}
          />
          <MapPinIcon className="absolute left-2 top-8 size-4" />
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
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button className="relative block h-16 w-full rounded-md border px-6 pt-4 text-left text-sm">
                <FormLabel className={classNames.label}>{formLabel}</FormLabel>
                <CalendarIcon className="absolute left-2 top-8 size-4" />
                {field.value ? (
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  <p className="pl-4">
                    {formatDateRange(
                      field.value.from as Date,
                      field.value.to as Date,
                    )}
                  </p>
                ) : (
                  <p className="pl-4 text-muted-foreground">Select dates</p>
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
  className?: string;
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
                <UsersIcon className="mr-3 h-5 w-5 shrink-0" />
                {field.value ?? "Add guests"}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" side="bottom">
              <div className="flex items-center justify-between">
                Guests
                <CounterInput value={field.value} setValue={field.onChange} />
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
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <>
          <FormLabel className="text-black">{formLabel}</FormLabel>
          <LPFormItem>
            <div className="flex items-center justify-between space-x-2 rounded-md border bg-white px-4 py-3">
              <DollarSignIcon strokeWidth={1} />
              <div className="flex-1 text-center">
                <input
                  type="decimal"
                  value={field.value}
                  onChange={field.onChange}
                  className="focus-none w-full bg-transparent bg-white text-start placeholder:text-foreground focus:text-black focus:outline-none"
                  placeholder="Price per night"
                />
              </div>
            </div>
          </LPFormItem>
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
              className="rounded-full border-none bg-accent text-xs"
            >
              Add a link
              <ChevronDown size={20} />
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
        <PopoverContent align="start" className="w-96 bg-white ">
          <Form {...form}>
            <form className="flex flex-col gap-4 bg-white">
              <FormField
                control={form.control}
                name={"airbnbLink"}
                defaultValue={parentForm.getValues(`data.${curTab}.airbnbLink`)}
                render={({ field }) => (
                  <LPFormItem className="">
                    <FormLabel>
                      <div className="mb-4 flex  flex-row justify-between">
                        <div className=" h-full items-center text-primary">
                          Airbnb Link
                        </div>
                        <button className="text-[#004236] ">Clear</button>
                      </div>
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
                {form.formState.isSubmitting ? "Crunching data..." : "Done"}
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
