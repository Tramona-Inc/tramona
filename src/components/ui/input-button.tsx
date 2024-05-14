import * as React from "react";

import { cn } from "@/utils/utils";
import { useMeasure } from "@uidotdev/usehooks";
import { cva, type VariantProps } from "class-variance-authority";
import { FormLabel } from "./form";
import { labelVariants, overlayVariants } from "./input";

// I customized this inputButton component to support prefixes and suffixes.
// They can be any ReactNode, including strings or JSX elements.
// Prefixes/suffixes of type string are given default styles,
// and for <InputButton type="password">, the suffix is the eyeball button

export type InputButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof inputButtonVariants> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    icon?: React.FC<{ className?: string }>;
    label?: React.ReactNode;
    placeholder?: string;
    value?: string;
  };

const inputButtonVariants = cva(
  "flex items-center text-left w-full hover:bg-zinc-50 rounded-md border-input appearance-none border outline-transparent outline disabled:opacity-50 text-sm text-foreground focus-visible:border-transparent focus-visible:outline focus-visible:outline-ring disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "h-10 bg-zinc-50",
        lpDesktop: "h-16 pt-4",
        lpMobile: "h-12 bg-white",
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
          <FormLabel className={labelVariants({ variant })}>{label}</FormLabel>
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
          {Icon && <Icon className="size-4" />}
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
      </div>
    );
  },
);
InputButton.displayName = "InputButton";

export { InputButton };
