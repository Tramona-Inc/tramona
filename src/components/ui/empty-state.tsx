import * as React from "react";

import { cn } from "@/utils/utils";

const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon: React.FC<{ className?: string }>;
  }
>(({ className, icon: Icon, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center text-center",
      className,
    )}
    {...props}
  >
    <div className="rounded-full bg-zinc-200 p-4 text-zinc-600">
      <Icon className="h-10 w-10" />
    </div>
    {children}
  </div>
));
EmptyState.displayName = "EmptyState";

const EmptyStateTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("pt-2 text-2xl font-bold tracking-tight", className)}
    {...props}
  />
));
EmptyStateTitle.displayName = "EmptyStateTitle";

const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-muted-foreground", className)} {...props} />
));
EmptyStateDescription.displayName = "EmptyStateDescription";

const EmptyStateFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 pt-4", className)}
    {...props}
  />
));
EmptyStateFooter.displayName = "EmptEmptyStateFooteryStateButtons";

export { EmptyState, EmptyStateTitle, EmptyStateDescription, EmptyStateFooter };
