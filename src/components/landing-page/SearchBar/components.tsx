import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateRange } from "@/utils/utils";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { type FieldPath, type FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMeasure } from "@uidotdev/usehooks";
import { useState, type ComponentProps, forwardRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import PlacesPopover from "@/components/_common/PlacesPopover";

// LP is short for landing page

export const classNames = {
  wrapper: "group relative",

  label:
    "pointer-events-none absolute left-8 top-3 z-10 text-sm font-semibold text-white group-focus-within:text-black",

  // like label but for buttons
  buttonLabel: ({ isFocused }: { isFocused: boolean }) =>
    cn(
      "pointer-events-none absolute left-8 top-3 z-10 text-sm font-semibold text-white",
      isFocused && "text-black",
    ),

  errorMsg: "pointer-events-none absolute left-8 top-14 z-10",

  input:
    "peer block h-20 w-full rounded-full bg-transparent pt-4 text-white placeholder:text-white/50 hover:bg-white/10 focus:bg-white focus:outline-none focus:text-black placeholder:focus:text-black/50",

  // like input but for buttons
  button: ({
    isPlaceholder,
    isFocused,
  }: {
    isPlaceholder: boolean;
    isFocused: boolean;
  }) =>
    cn(
      "peer flex h-20 w-full border-none rounded-full pt-4 px-8",
      isFocused ? "bg-white" : "bg-transparent hover:bg-white/10",
      isPlaceholder
        ? cn("text-white/50", isFocused && "text-black/50")
        : cn("text-white", isFocused && "text-black"),
    ),
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

  const prefixEl = <p ref={prefixRef}>{prefix}</p>;
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
//   value,
//   defaultValue,
//   className,
//   ...props
// }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
//   return (
//     <textarea
//       className={cn(classNames.input, "px-8 pt-8", className)}
//       value={defaultValue ?? value ?? ""}
//       {...props}
//     />
//   );
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
          <FormLabel className={classNames.buttonLabel({ isFocused: isOpen })}>
            {formLabel}
          </FormLabel>

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
                  classNames.button({
                    isPlaceholder: !field.value,
                    isFocused: isOpen,
                  }),
                  "flex items-center text-left",
                )}
              >
                <p className="flex-1 truncate">
                  {value ?? "Enter your destination"}
                </p>
                <MapPinIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </button>
            )}
          />
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
          <FormLabel className={classNames.buttonLabel({ isFocused: isOpen })}>
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
                  "flex items-center",
                )}
              >
                {field.value
                  ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    formatDateRange(field.value.from, field.value.to)
                  : "Select dates"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 backdrop-blur-md"
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
          <LPFormMessage />
        </LPFormItem>
      )}
    />
  );
}
