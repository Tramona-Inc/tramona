import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary/20 text-primary",
        secondary: "bg-zinc-200 text-zinc-600",
        red: "bg-red-200 text-red-800",
        green: "bg-green-200 text-green-800",
        yellow: "bg-yellow-200 text-yellow-800",
        blue: "bg-blue-200 text-blue-800",
        new: "bg-[#BBF6CE] text-[#126431]",
        pending: "text-[#764B01]  bg-[#FEEE8A] ",
      },
      size: {
        sm: "text-xs px-1.5 py-0.5 gap-0.5",
        md: "text-sm px-2.5 py-0.5 gap-1",
        lg: "text-base px-3 py-1 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
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
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
