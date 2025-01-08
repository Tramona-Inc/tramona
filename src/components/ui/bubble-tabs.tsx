"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/utils/utils";

const BubbleTabs = TabsPrimitive.Root;

const BubbleTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex gap-x-2 overflow-x-auto", className)}
    {...props}
  />
));
BubbleTabsList.displayName = TabsPrimitive.List.displayName;

const BubbleTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 bg-white px-6 py-1.5 text-base font-medium text-black ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primaryGreen data-[state=active]:bg-white data-[state=active]:text-primaryGreen data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
));
BubbleTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const BubbleTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
BubbleTabsContent.displayName = TabsPrimitive.Content.displayName;

export { BubbleTabs, BubbleTabsList, BubbleTabsTrigger, BubbleTabsContent };
