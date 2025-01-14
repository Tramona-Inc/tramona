import * as React from "react";

import { cn } from "@/utils/utils";
import { useMeasure } from "@uidotdev/usehooks";
import { cva, type VariantProps } from "class-variance-authority";
import { labelVariants, overlayVariants } from "./input";
import { XIcon } from "lucide-react";

// a lot of this code is copy pasted from input, so make sure to keep them in sync (or refactor if u want)

// this is a button that looks like an input field and has the same variants as the input component.
// it can be used as a trigger for date pickers, and is also used in
// the PlacesInput component to trigger the PlacesPopover, for example.

export type InputButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof inputButtonVariants> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    icon?: React.FC<{ className?: string }>;
    label?: React.ReactNode;
    placeholder?: string;
    value?: string;
  } & (
    | {
        setValue?: (value: undefined) => void;
        withClearBtn?: false;
      }
    | { setValue: (value: undefined) => void; withClearBtn: true }
  );

const inputButtonVariants = cva(
  "flex items-center text-left w-full hover:bg-white rounded-md border-input appearance-none border outline-transparent outline disabled:opacity-50 text-sm text-foreground focus-visible:border-transparent focus-visible:outline focus-visible:outline-ring disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "h-10 bg-white",
        lpDesktop: "h-16 pt-4",
        lpMobile: "h-12 bg-white",
        lpDesktopSearch: "h-16 pt-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const InputButton = React.forwardRef<HTMLButtonElement, InputButtonProps>(
  (
    {
      className,
      value,
      prefix,
      suffix,
      icon: Icon,
      placeholder,
      variant,
      label,
      setValue,
      withClearBtn = false,
      ...props
    },
    ref,
  ) => {
    const [prefixRef, { width: prefixWidth }] = useMeasure();
    const [suffixRef, { width: suffixWidth }] = useMeasure();

    const prefixEl = (
      <div
        ref={prefixRef}
        className={typeof prefix === "string" ? "text-muted-foreground" : ""}
      >
        {prefix}
      </div>
    );

    const suffixEl = (
      <div
        ref={suffixRef}
        className={
          typeof suffix === "string" ? "text-sm text-muted-foreground" : ""
        }
      >
        {suffix}
      </div>
    );

    const showPrefixSuffix = !!value;
    const showingPlaceholder = !value;

    return (
      <div className="relative">
        {label && (
          <p className={cn(labelVariants({ variant }), "pointer-events-none")}>
            {label}
          </p>
        )}
        <button
          type="button"
          className={cn(
            "peer",
            inputButtonVariants({ variant }),
            showingPlaceholder && "text-muted-foreground",
            className,
          )}
          style={{
            paddingLeft: 12 + (prefixWidth ?? 0) + (Icon ? 22 : 0),
            paddingRight: 12 + (suffixWidth ?? 0),
          }}
          ref={ref}
          {...props}
        >
          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          <div className="line-clamp-1">{(value || placeholder) ?? ""}</div>
        </button>
        <div className={overlayVariants({ variant })}>
          {Icon && <Icon className="h-4 w-4" />}
          <div
            className={cn(
              "flex-1 items-baseline justify-between",
              showPrefixSuffix ? "flex" : "hidden",
            )}
          >
            {prefixEl}
            {suffixEl}
          </div>
        </div>
        {withClearBtn && value && (
          <button
            type="button"
            className="absolute bottom-1/2 right-2 translate-y-1/2 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setValue?.(undefined);
            }}
            aria-label="Clear date"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  },
);
InputButton.displayName = "InputButton";

export { InputButton };
