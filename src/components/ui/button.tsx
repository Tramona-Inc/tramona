import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const buttonVariants = cva(
  "inline-flex items-center gap-2 text-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-primary bg-background text-primary hover:bg-zinc-200 focus-visible:bg-zinc-200",
        secondary:
          "bg-zinc-100 border border-zinc-300 text-secondary-foreground hover:bg-zinc-200",
        ghost: "hover:bg-accent text-zinc-800",
        link: "text-primary underline-offset-4 hover:underline",
        emptyInput:
          "w-full bg-accent/70 text-zinc-500 px-3 hover:bg-accent border border-input outline-offset-0 focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50",
        filledInput:
          "w-full bg-primary-foreground px-3 font-normal text-black hover:bg-accent border border-input outline-offset-0 focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50",
        darkPrimary: "bg-black text-white hover:bg-black/80",
        darkOutline: "border-2 border-black hover:bg-zinc-200",
        darkOutlineWhite: "border-2 border-white text-white",
        gold: "bg-gold text-black hover:bg-gold/90",
        white: "bg-white text-black hover:bg-zinc-200",
        wrapper:
          "hover:bg-accent hover:text-accent-foreground gap-0 -m-1 h-auto rounded-full p-1",
        outlineLight:
          "hover:border-black flex flex-row items-center gap-5 rounded-[12px] border-[2px] p-6 px-7 transition-all",
        outlineMinimal:
          "hover:border-black flex flex-row items-center gap-5 rounded-lg border-[2px] p-2 transition-all",
        increment:
          "rounded-full border-2 flex items-center justify-center hover:border-black transition-all duration-200",
        underline: "hover:bg-accent text-zinc-800 underline",
        greenPrimary: "bg-[#004236] text-white font-bold",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  tooltip?: React.ReactNode;
  tooltipOptions?: React.ComponentProps<typeof TooltipContent>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      tooltip,
      tooltipOptions = {},
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const button = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "group")}
        ref={ref}
        {...props}
        disabled={isLoading || props.disabled}
      >
        {children}
      </Comp>
    );
    return tooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent {...tooltipOptions}>{tooltip}</TooltipContent>
      </Tooltip>
    ) : (
      button
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
