import * as React from "react";

import { cn } from "@/utils/utils";
import { useMeasure } from "@uidotdev/usehooks";
import { useState } from "react";
import Clock from "../_icons/Clock";
import HiddenIcon from "../_icons/HiddenIcon";
import VisibleIcon from "../_icons/VisibleIcon";

// I customized this input component to support prefixes and suffixes.
// They can be any ReactNode, including strings or JSX elements.
// Prefixes/suffixes of type string are given default styles,
// and for <Input type="password">, the suffix is the eyeball button

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      value,
      defaultValue,
      prefix,
      suffix,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const inputClassNames =
      "flex h-10 w-full rounded-md appearance-none border border-input outline-transparent outline bg-primary-foreground py-2 text-sm text-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed";

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
          typeof suffix === "string" ? "text-sm text-muted-foreground" : ""
        }
      >
        {type === "password" ? suffix ?? passwordEyeballButton : suffix}
      </div>
    );

    return (
      <div className="relative">
        <input
          type={
            type === "password" ? (showingPassword ? "text" : "password") : type
          }
          className={cn("peer", inputClassNames, className)}
          style={{
            paddingLeft: 12 + (prefixWidth ?? 0),
            paddingRight: 12 + (suffixWidth ?? 0),
          }}
          ref={ref}
          value={defaultValue ?? value ?? ""} // removes the need for lots of empty-string defaults for react-hook-form
          autoComplete="off"
          placeholder={placeholder ?? ""} // so i can use placeholder-shown
          {...props}
        />
        {type === "clock" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-2">
            <Clock />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-between px-3 py-2 peer-[&:focus]:flex peer-[&:not(:placeholder-shown)]:flex">
          {prefixEl}
          {suffixEl}
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
