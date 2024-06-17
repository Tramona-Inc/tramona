import { FormField, FormItem, FormMessage } from "../ui/form";
import { useState } from "react";
import { type InputVariant } from "../ui/input";
import { InputButton } from "../ui/input-button";
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
  onSave: (location: { lat: number; lng: number }, radius: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [initialLocation, setInitialLocation] = useState({lat: 0, lng: 0});

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={cn("relative", className)}>
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
                    className="bg-white"
                  >
                    {value ? value : "Enter your destination"}
                  </InputButton>
                )}
              />
              <FormMessage />
            </div>
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
        </FormItem>
      )}
    />
  );
}
