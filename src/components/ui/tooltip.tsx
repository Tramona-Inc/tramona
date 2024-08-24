import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { type VariantProps, cva } from "class-variance-authority";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipVariants = cva(
  "z-[100] font-medium overflow-hidden pointer-events-none shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        inverted: "bg-background text-foreground",
      },
      size: {
        sm: "px-2 py-1 text-xs rounded",
        md: "px-3 py-1.5 text-sm rounded",
        lg: "px-4 py-2 text-base rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipVariants>
>(({ className, variant, size, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    collisionPadding={8}
    className={tooltipVariants({ variant, size, className })}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
