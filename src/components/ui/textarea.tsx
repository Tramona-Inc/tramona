import * as React from "react";

import { cn } from "@/utils/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, defaultValue, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-primary-foreground px-3 py-2 text-sm text-black placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-auto",
          className,
        )}
        ref={ref}
        value={defaultValue ?? value ?? ""}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
