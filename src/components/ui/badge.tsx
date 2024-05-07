import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full whitespace-nowrap font-semibold",
  {
    variants: {
      variant: {
        primary: "bg-primary/20 text-primary",
        secondary: "bg-zinc-200 text-zinc-600 font-medium",
        red: "bg-red-100 border border-red-300 text-red-800",
        green: "bg-green-100 border border-green-300 text-green-800",
        yellow: "bg-yellow-100 border border-yellow-300 text-yellow-800",
        blue: "bg-blue-100 border border-blue-300 text-blue-800",
        gray: "bg-zinc-100 border border-zinc-300 text-zinc-700",
        lightGray: "bg-white text-[#4D535F]",
        solidRed: "bg-red-600 text-white",
        skeleton: "bg-accent animate-pulse",
      },
      size: {
        sm: "text-xs px-1.5 h-5 gap-0.5 font-medium",
        md: "text-sm px-2.5 h-6 gap-1",
        lg: "text-base px-3 h-8 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({
  className,
  variant,
  size,
  children,
  icon,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size }),
        icon && "pl-1.5",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
