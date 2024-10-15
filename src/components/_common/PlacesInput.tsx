import { FormField, FormItem, FormMessage } from "../ui/form";
import { useState } from "react";
import { type InputVariant } from "../ui/input";
import { InputButton } from "../ui/input-button";
import { cn } from "@/utils/utils";
import { api } from "@/utils/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PlacesPopover from "./PlacesPopover";
import { LocateFixed } from "lucide-react";
import { Button } from "../ui/button";
import { MapModal } from "./MapModal";
import { FieldValues } from "react-hook-form";

/**
 * pass setRadius and setLatLng to show the map pin
 */
export default function PlacesInput<TFieldValues extends FieldValues>({
  className,
  formLabel,
  placeholder,
  variant,
  icon,
  radius,
  setRadius,
  latLng,
  setLatLng,
  ...props
}: Omit<React.ComponentProps<typeof FormField<TFieldValues>>, "render"> & {
  className?: string;
  formLabel?: string;
  placeholder?: string;
  variant?: InputVariant;
  icon?: React.FC<{ className?: string }>;
  radius?: number;
  setRadius?: (radius?: number) => void;
  latLng?: { lat: number; lng: number };
  setLatLng?: (latLng: { lat: number; lng: number }) => void;
}) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  return (
    <FormField
      {...props}
      render={({ field }) => {
        const fieldIsFilled = !!field.value;
        const showMapPin =
          fieldIsFilled && !!latLng && !!setLatLng && !!setRadius;

        const mapPin = !showMapPin ? null : (
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" size="icon" variant="secondary">
                <LocateFixed className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <MapModal
                latLng={latLng}
                setLatLng={setLatLng}
                radius={radius}
                setRadius={setRadius}
              />
            </DialogContent>
          </Dialog>
        );

        return (
          <FormItem className={cn("relative", className)}>
            <div className="flex items-center">
              <div className="flex-grow">
                <PlacesPopover
                  open={open}
                  setOpen={setOpen}
                  value={field.value as string}
                  onValueChange={async (location) => {
                    field.onChange(location);
                    const { coordinates } =
                      await utils.offers.getCoordinates.fetch({ location });
                    const { lat, lng } = coordinates.location!;
                    setLatLng?.({ lat, lng });
                  }}
                  className="w-96 -translate-y-11 overflow-clip px-0 pt-0"
                  trigger={({ value }) => (
                    <InputButton
                      withClearBtn
                      variant={variant}
                      label={formLabel}
                      placeholder={placeholder}
                      value={value}
                      setValue={field.onChange}
                      type="button"
                      role="combobox"
                      icon={icon}
                      className={cn("bg-white", className)}
                    >
                      {value ? value : "Enter your destination"}
                    </InputButton>
                  )}
                />
                <FormMessage />
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
                {mapPin}
              </div>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
