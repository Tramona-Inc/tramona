import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn, useIsSm } from "@/utils/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  NestedDrawer,
} from "./drawer";

// const Dialog = DialogPrimitive.Root;

function Dialog({
  nested = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> &
  React.ComponentProps<typeof Drawer> & {
    nested?: boolean;
  }) {
  return useIsSm() ? (
    <DialogPrimitive.Root {...props} />
  ) : nested ? (
    <NestedDrawer {...props} />
  ) : (
    <Drawer {...props} />
  );
}
// Dialog.displayName = DialogPrimitive.Root.displayName;

// const DialogTrigger = DialogPrimitive.Trigger;

function DialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return useIsSm() ? (
    <DialogPrimitive.Trigger {...props} />
  ) : (
    <DrawerTrigger {...props} />
  );
}

// DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

// const DialogPortal = DialogPrimitive.Portal;

function DialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>,
) {
  return useIsSm() ? (
    <DialogPrimitive.Portal {...props} />
  ) : (
    <DrawerPortal {...props} />
  );
}

// DialogPortal.displayName = DialogPrimitive.Portal.displayName;

// const DialogClose = DialogPrimitive.Close;

function DialogClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>,
) {
  return useIsSm() ? (
    <DialogPrimitive.Close {...props} />
  ) : (
    <DrawerClose {...props} />
  );
}

// DialogClose.displayName = DialogPrimitive.Close.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(
  ({ className, ...props }, ref) =>
    useIsSm() ? (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 grid place-items-center overflow-auto bg-background/70 px-4 py-16 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
      />
    ) : null, // <DrawerOverlay ref={ref} {...props} /> // its a long story
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content & typeof DrawerContent>,
  React.ComponentPropsWithoutRef<
    typeof DialogPrimitive.Content & typeof DrawerContent
  >
>(({ className, children, ...props }, ref) =>
  useIsSm() ? (
    <DialogPortal>
      <DialogOverlay>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "relative w-full max-w-xl rounded-xl border bg-background p-6 shadow-lg outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className,
          )}
          onCloseAutoFocus={(e) => e.preventDefault()}
          {...props}
        >
          <div className="space-y-4">{children}</div>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 opacity-70 ring-offset-background hover:bg-accent hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  ) : (
    <DrawerContent className={className} ref={ref} {...props}>
      {children}
    </DrawerContent>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) =>
  useIsSm() ? (
    <div className={cn("space-y-1.5", className)} {...props} />
  ) : (
    <DrawerHeader className={className} {...props} />
  );
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) =>
  useIsSm() ? (
    <div className={cn("flex justify-end gap-2", className)} {...props} />
  ) : (
    <DrawerFooter className={className} {...props} />
  );
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) =>
  useIsSm() ? (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-xl font-bold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  ) : (
    <DrawerTitle className={className} ref={ref} {...props} />
  ),
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) =>
  useIsSm() ? (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("leading-tight text-muted-foreground", className)}
      {...props}
    />
  ) : (
    <DrawerDescription className={className} ref={ref} {...props} />
  ),
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
