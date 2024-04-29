import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/utils/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    noBorder?: boolean; // New prop to remove the border
  }
>(({ className, children, noBorder, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex overflow-x-auto", className)}
    {...props}
  >
    <>
      {children}
      <div className={cn(!noBorder && "flex-1 border-b-4")} />
    </>
  </TabsPrimitive.List>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    count?: number | "blank" | undefined;
    noBorder?: boolean; // New prop to remove the border
  }
>(({ className, onClick, count, noBorder, children, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "group inline-flex items-center justify-center gap-2 whitespace-nowrap p-2 text-sm font-semibold text-muted-foreground hover:bg-muted focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary sm:px-4 sm:py-3 sm:text-base",
        {
          // Conditionally add or remove border
          "border-b-4 data-[state=active]:border-primary": !noBorder,
        },
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        e.currentTarget.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }}
      {...props}
    >
      {children}
      {count !== undefined && (
        <div className="min-w-7 rounded-full bg-zinc-200 px-2 py-0.5 text-sm font-semibold text-zinc-600 group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary">
          {count === "blank" ? <>&nbsp;</> : count}
        </div>
      )}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
