import * as React from "react";

import { cn } from "@/utils/utils";
import { useMeasure } from "@uidotdev/usehooks";
import { useState } from "react";
import HiddenIcon from "../_icons/HiddenIcon";
import VisibleIcon from "../_icons/VisibleIcon";
import { cva, type VariantProps } from "class-variance-authority";
import { FormLabel } from "./form";
import { Slot } from "@radix-ui/react-slot";

// I customized this input component to support prefixes and suffixes.
// They can be any ReactNode, including strings or JSX elements.
// Prefixes/suffixes of type string are given default styles,
// and for <Input type="password">, the suffix is the eyeball button

// make sure to keep this in sync wiwth input-button.tsx (or refactor if u want)

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    icon?: React.FC<{ className?: string }>;
    label?: React.ReactNode;
    withClearBtn?: boolean;
  };

export type InputVariant = NonNullable<InputProps["variant"]>;

const inputVariants = cva(
  "flex items-center w-full rounded-md appearance-none border outline-transparent outline file:border-0 file:bg-transparent border-input file:text-sm file:font-medium disabled:opacity-50 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-black focus-visible:outline-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "h-10 bg-white",
        lpDesktop: "h-16 pt-4",
        lpMobile: "h-12 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const overlayVariants = cva(
  "flex items-center pointer-events-none absolute inset-x-0 bottom-0 px-3",
  {
    variants: {
      variant: {
        default: "h-10",
        lpDesktop: "h-12",
        lpMobile: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const labelVariants = cva("", {
  variants: {
    variant: {
      default: "text-sm font-medium text-muted-foreground pb-1",
      lpDesktop: "text-xs text-foreground font-bold absolute left-2 top-1",
      lpMobile: "text-sm text-foreground pb-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      value,
      defaultValue,
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

    const [showingPassword, setShowingPassword] = useState(false);

    const passwordEyeballButton = (
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          setShowingPassword(!showingPassword);
        }}
        onMouseDown={(e) => e.preventDefault()}
        onMouseUp={(e) => e.preventDefault()}
        className="pointer-events-auto absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full text-zinc-600 hover:bg-black/10 focus-visible:bg-black/10"
      >
        {showingPassword ? <VisibleIcon /> : <HiddenIcon />}
      </button>
    );
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
          typeof suffix === "string" ? "text-xs text-muted-foreground" : ""
        }
      >
        {type === "password" ? (suffix ?? passwordEyeballButton) : suffix}
      </div>
    );

    const [focused, setFocused] = useState(false);
    const showingPrefixSuffix = (!placeholder && focused) || value;

    return (
      <div className="relative">
        {label && (
          <FormLabel className={labelVariants({ variant })}>{label}</FormLabel>
        )}
        {/* https://www.radix-ui.com/primitives/docs/utilities/slot#event-handlers */}
        <Slot onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <input
            type={
              type === "password"
                ? showingPassword
                  ? "text"
                  : "password"
                : type
            }
            className={cn("peer", inputVariants({ variant }), className)}
            style={{
              paddingLeft: 12 + (prefixWidth ?? 0) + (Icon ? 22 : 0),
              paddingRight: 12 + (suffixWidth ?? 0),
            }}
            ref={ref}
            value={defaultValue ?? value ?? ""} // removes the need for lots of empty-string defaults for react-hook-form
            autoComplete="off"
            placeholder={placeholder ?? ""} // so we can use placeholder-shown
            {...props}
          />
        </Slot>
        <div className={overlayVariants({ variant })}>
          {Icon && <Icon className="h-4 w-4" />}
          <div
            className={cn(
              "flex-1 items-baseline justify-between",
              showingPrefixSuffix ? "flex" : "hidden",
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
Input.displayName = "Input";

export { Input };
