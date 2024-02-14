import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateRange } from "@/utils/utils";
import { CalendarIcon } from "lucide-react";
import { type FieldPath, type FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMeasure } from "@uidotdev/usehooks";
import { TextareaHTMLAttributes, useState, type ComponentProps } from "react";
import { Calendar } from "@/components/ui/calendar";

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

export function LPTextArea({
  value,
  defaultValue,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(classNames.input, "px-8 pt-8", className)}
      value={defaultValue ?? value ?? ""}
      {...props}
    />
  );
}

export function LPInput({
  prefix,
  suffix,
  value,
  defaultValue,
  ...props
}: ComponentProps<"input"> & { prefix?: string; suffix?: string }) {
  const [prefixRef, { width: prefixWidth }] = useMeasure();
  const [suffixRef, { width: suffixWidth }] = useMeasure();

  const prefixEl = <p ref={prefixRef}>{prefix}</p>;
  const suffixEl = <p ref={suffixRef}>{suffix}</p>;

  return (
    <div className="relative">
      <input
        autoComplete="off"
        placeholder=""
        value={defaultValue ?? value ?? ""}
        className={classNames.input}
        style={{
          paddingLeft: 32 + (prefixWidth ?? 0),
          // paddingLeft: 32,
          paddingRight: 32 + (suffixWidth ?? 0),
        }}
        {...props}
      />
      <div className="pointer-events-none absolute inset-0 top-4 hidden items-center justify-between px-8 text-white/50 group-focus-within:text-black/50 peer-[&:focus]:flex peer-[&:not(:placeholder-shown)]:flex">
        {prefixEl}
        {suffixEl}
      </div>
    </div>
  );
}

export default function LPDateRangePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Omit<
    React.ComponentProps<typeof FormField<TFieldValues, TName>>,
    "render"
  > & {
    className: string;
    formLabel: string;
  },
) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <LPFormItem className={props.className}>
          <FormLabel className={classNames.buttonLabel({ isFocused: isOpen })}>
            {props.formLabel}
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
