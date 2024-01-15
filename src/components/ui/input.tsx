import * as React from "react";

import { cn } from "@/utils/utils";
import { useState } from "react";
import VisibleIcon from "../icons/VisibleIcon";
import HiddenIcon from "../icons/HiddenIcon";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, defaultValue, ...props }, ref) => {
    const [showingPassword, setShowingPassword] = useState(false);
    return type === "password" ? (
      <div className="relative">
        <input
          type={showingPassword ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-primary-foreground px-3 py-2 text-sm text-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-auto",
            className,
          )}
          ref={ref}
          value={defaultValue ?? value ?? ""}
          {...props}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShowingPassword(!showingPassword);
          }}
          className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full text-zinc-600 hover:bg-black/10 focus-visible:bg-black/10"
        >
          {showingPassword ? <VisibleIcon /> : <HiddenIcon />}
        </button>
      </div>
    ) : (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-primary-foreground px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-auto",
          className,
        )}
        ref={ref}
        autoComplete="off"
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
