// import { FormField, FormItem, FormMessage } from "../ui/form";

// import { type FieldPath, type FieldValues } from "react-hook-form";
// import PlacesPopover from "./PlacesPopover";
// import { useState } from "react";
// import { type InputVariant } from "../ui/input";
// import { InputButton } from "../ui/input-button";
// import { cn } from "@/utils/utils";
// import { api } from "@/utils/api";

// export default function PlacesInput<
//   TFieldValues extends FieldValues,
//   TName extends FieldPath<TFieldValues>,
// >({
//   className,
//   formLabel,
//   placeholder,
//   variant,
//   icon,
//   mapIcon,
//   setInitialLocation,
//   ...props
// }: Omit<
//   React.ComponentProps<typeof FormField<TFieldValues, TName>>,
//   "render"
// > & {
//   className?: string;
//   formLabel: string;
//   placeholder?: string;
//   variant?: InputVariant;
//   icon?: React.FC<{ className?: string }>;
//   mapIcon?: React.FC<{ className?: string }>;
//   setInitialLocation: (location: { lat: number; lng: number }) => void;
//   }) {
//   const [open, setOpen] = useState(false);
//   const utils = api.useUtils();

//   return (
//     <FormField
//       {...props}
//       render={({ field }) => (
//         <FormItem className={cn("relative", className)}>
//           <PlacesPopover
//             open={open}
//             setOpen={setOpen}
//             value={field.value}
//             onValueChange={async (location) => {
//               field.onChange(location);
//               if (location) {
//                 const { coordinates } = await utils.offers.getCoordinates.fetch(
//                   {
//                     location,
//                   },
//                 );

//                 const { lat, lng } = coordinates.location!;
//                 setInitialLocation({lat: lat, lng: lng});
//               }
//             }}
//             className="w-96 -translate-y-11 overflow-clip px-0 pt-0"
//             trigger={({ value }) => (
//               <InputButton
//                 withClearBtn
//                 variant={variant}
//                 label={formLabel}
//                 placeholder={placeholder}
//                 value={value}
//                 setValue={field.onChange}
//                 type="button"
//                 role="combobox"
//                 // disabled={disabled}
//                 icon={icon}
//                 className="bg-white"
//               >
//                 {value ? value : "Select a location"}
//               </InputButton>
//             )}
//           />
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
/* PlacesInput.tsx */
/* PlacesInput.tsx */
import { FormField, FormItem, FormMessage } from "../ui/form";
import { useState } from "react";
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
  variant?: string;
  icon?: React.ReactNode; // Adjusted to ReactNode
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
            "p-2",
            "bg-white",
            "border",
            "border-[#d9d6d1ff]",
            "rounded-lg",
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

            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
              <DialogTrigger asChild>
                <>
                  <button
                    onClick={() => setIsMapOpen(true)}
                    className="ml-2 rounded-lg border border-[#d9d6d1ff] bg-[#f2f1efff] p-2"
                  >
                    <LocateFixed />
                  </button>
                </>
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
        </FormItem>
      )}
    />
  );
}
