import { FormField, FormItem, FormMessage } from "../ui/form";
import { useState } from "react";
import { InputButtonMap } from "../ui/input-button-map";
import { type InputVariant } from "../ui/input";
import { cn } from "@/utils/utils";
import { api } from "@/utils/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PlacesPopover from "./PlacesPopover";
import MapModal from "@/components/map-modal";
import { LocateFixed } from "lucide-react";

export default function PlacesInput({
  className,
  formLabel,
  placeholder,
  variant,
  icon,
  onSave,
  ...props
}: Omit<React.ComponentProps<typeof FormField>, "render"> & {
  className?: string;
  formLabel: string;
  placeholder?: string;
  variant?: InputVariant;
  icon?: React.FC<{ className?: string }>;
  onSave: (location: { lat: number; lng: number; }, radius: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [initialLocation, setInitialLocation] = useState(null);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem
          className={cn(
            "relative",
            className,
          )}
        >
          <div className="flex items-center">
            <div className="flex-grow">
              <PlacesPopover
                open={open}
                setOpen={setOpen}
                value={field.value}
                onValueChange={async (location) => {
                  field.onChange(location);
                  if (location) {
                    const { coordinates } =
                      await utils.offers.getCoordinates.fetch({
                        location,
                      });
                    const { lat, lng } = coordinates.location!;
                    setInitialLocation({ lat, lng });
                  }
                }}
                className="w-96 -translate-y-11 overflow-clip px-0 pt-0"
                trigger={({ value }) => (
                  <InputButtonMap
                    withClearBtn
                    variant={variant}
                    label={formLabel}
                    placeholder={placeholder}
                    value={value}
                    setValue={field.onChange}
                    type="button"
                    role="combobox"
                    icon={icon}
                    className="bg-white"
                    onSave={onSave}
                    initialLocation={initialLocation}
                    setInitialLocation={setInitialLocation}
                  >
                    {value ? value : "Enter your destination"}
                  </InputButtonMap>
                )}
              />
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}
