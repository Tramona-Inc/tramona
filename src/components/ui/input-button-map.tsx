/* input-button-map.tsx */
import * as React from "react";
import { cn } from "@/utils/utils";
import { useMeasure } from "@uidotdev/usehooks";
import { cva, type VariantProps } from "class-variance-authority";
import { FormLabel } from "./form";
import { LocateFixed, MapPin } from "lucide-react";
import { labelVariants, overlayVariants } from "./input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MapModal from "../map-modal"; // Ensure the correct import path
import { XIcon } from "lucide-react";
import { set } from "lodash";

export type InputButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof inputButtonVariants> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    icon?: React.FC<{ className?: string }>;
    label?: React.ReactNode;
    placeholder?: string;
    value?: string;
    onSave: (location: { lat: number; lng: number }, radius: number) => void;
    setInitialLocation: (lat: number, lng: number) => void;
    initialLocation: { lat: number; lng: number };
  } & (
    | {
        setValue?: (value: undefined) => void;
        withClearBtn?: false;
      }
    | { setValue: (value: undefined) => void; withClearBtn: true }
  );

const inputButtonVariants = cva(
  "flex items-center text-left w-full hover:bg-zinc-50 rounded-md border-input appearance-none border outline-transparent outline disabled:opacity-50 text-sm text-foreground focus-visible:border-transparent focus-visible:outline focus-visible:outline-ring disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "h-10 bg-zinc-50",
        lpDesktop: "h-16 pt-4",
        lpMobile: "h-12 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const InputButtonMap = React.forwardRef<HTMLButtonElement, InputButtonProps>(
  (
    {
      className,
      value,
      prefix,
      suffix,
      icon: Icon,
      placeholder,
      variant,
      onSave,
      label,
      setValue,
      withClearBtn = false,
      children,
      initialLocation,
      setInitialLocation,
      ...props
    },
    ref,
  ) => {
    const [prefixRef, { width: prefixWidth }] = useMeasure();
    const [suffixRef, { width: suffixWidth }] = useMeasure();
    const [isMapOpen, setIsMapOpen] = React.useState(false);

    const prefixEl = (
      <div
        ref={prefixRef}
        className={typeof prefix === "string" ? "text-muted-foreground" : ""}
      >
        {prefix}
      </div>
    );

    const suffixEl = (
      <div
        ref={suffixRef}
        className={
          typeof suffix === "string" ? "text-sm text-muted-foreground" : ""
        }
      >
        {suffix}
      </div>
    );

    const showPrefixSuffix = !!value;
    const showingPlaceholder = !value;

    return (
      <div className="relative">
        {label && (
          <p className={cn(labelVariants({ variant }), "pointer-events-none")}>
            {label}
          </p>
        )}
        <button
          type="button"
          className={cn(
            "peer",
            inputButtonVariants({ variant }),
            showingPlaceholder && "text-muted-foreground",
            className,
          )}
          style={{
            paddingLeft: 12 + (prefixWidth ?? 0) + (Icon ? 22 : 0),
            paddingRight: 12 + (suffixWidth ?? 0),
          }}
          ref={ref}
          {...props}
        >
          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          <div className="line-clamp-1">{(value || placeholder) ?? ""}</div>
        </button>
        <div className={overlayVariants({ variant })}>
          {Icon && <Icon className="size-4" />}
          <div
            className={cn(
              "flex-1 items-baseline justify-between",
              showPrefixSuffix ? "flex" : "hidden",
            )}
          >
            {prefixEl}
            {suffixEl}
          </div>
        </div>
        {withClearBtn && value && (
          <button
            type="button"
            className="absolute bottom-4 right-12 rounded-full bg-white p-1 hover:bg-zinc-200"
            onClick={() => setValue?.(undefined)}
          >
            <XIcon className="size-4" />
          </button>
        )}

        <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
          <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex items-center rounded-lg border border-[#d9d6d1ff] bg-[#f2f1efff] p-2 hover:bg-gray-200"
                onClick={() => setIsMapOpen(true)}
              >
                <LocateFixed className="h-4 w-4 text-gray-700" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <MapModal
                initialLocation={initialLocation}
                setInitialLocation={setInitialLocation}
                setOpen={setIsMapOpen}
                onSave={onSave}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      //   </div>
      // </div>
    );
  },
);

InputButtonMap.displayName = "InputButtonMap";

export { InputButtonMap };
