import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { createContext, useContext, useState } from "react";

import { cn } from "@/utils/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useFormContext } from "react-hook-form";

const buttonVariants = cva(
  "inline-flex items-center gap-2 text-center justify-center whitespace-nowrap rounded-md text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-16 rounded-full px-16 text-xl",
        icon: "h-10 w-10",
      },
      variant: {
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:bg-zinc-400 disabled:text-secondary-foreground",
        outline:
          "border border-[#c9c9c9] bg-white text-primary font-normal text-base hover:bg-zinc-100 focus-visible:bg-zinc-200",
        secondary:
          "bg-zinc-100 border border-zinc-300 text-secondary-foreground hover:bg-zinc-200",
        ghost:
          "hover:bg-accent text-zinc-600/90 hover:text-zinc-600 data-[state=open]:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
        emptyInput:
          "w-full bg-accent/70 text-zinc-500 px-3 hover:bg-accent border border-input outline-offset-0 focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50",
        filledInput:
          "w-full bg-primary-foreground px-3 font-normal text-black hover:bg-accent border border-input outline-offset-0 focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50",
        darkPrimary: "bg-black text-white hover:bg-black/80",
        darkOutline: "border-2 border-black hover:bg-zinc-200",
        darkOutlineWhite: "border-2 border-white text-white",
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
        primary:
          "bg-primaryGreen hover:opacity-90 text-[#fafafa] disabled:bg-zinc-400 disabled:text-secondary-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "primary",
    },
  },
);

interface ButtonContextType {
  isLoading: boolean;
}

const ButtonContext = createContext<ButtonContextType | undefined>(undefined);

export const useButtonContext = () => {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error("useButtonContext must be used within a Button");
  }
  return context;
};

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
      tooltip,
      tooltipOptions = {},
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const [isOnClickLoading, setIsOnClickLoading] = useState(false);
    const form = useFormContext();
    const isSubmitButton = props.type === "submit";

    const isLoading =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      isOnClickLoading || (isSubmitButton && form?.formState.isSubmitting);

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsOnClickLoading(true);
      if (onClick) await Promise.resolve(onClick(event));
      setIsOnClickLoading(false);
    };

    const button = (
      <ButtonContext.Provider value={{ isLoading }}>
        <Comp
          className={cn(buttonVariants({ variant, size, className }), "group")}
          ref={ref}
          onClick={handleClick}
          {...props}
          disabled={isLoading || props.disabled}
        >
          {children}
        </Comp>
      </ButtonContext.Provider>
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
