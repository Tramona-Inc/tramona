import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchBarForm } from "./useSearchBarForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DesktopSearchTab() {
  const { form, onSubmit } = useSearchBarForm();

  const locations = [
    "Hawaii, USA",
    "Arizona, USA",
    "California, USA",
    "Florida, USA",
    "New York, USA",
    "Texas, USA",
    "Colorado, USA",
    "Washington, USA",
    "Oregon, USA",
    "Nevada, USA",
    "Italy",
    "France",
    "Spain",
    "Germany",
    "United Kingdom",
    "Australia",
    "Japan",
    "China",
    "South Korea",
    // need to change these locations
  ];

  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  const handleLocationClick = async (location: string) => {
    setSelectedLocation(location);
    form.setValue("location", location);

    // avoids type error by passing a synthetic event
    const syntheticEvent = {
      target: form.getValues(),
    } as React.BaseSyntheticEvent;

    try {
      await onSubmit(syntheticEvent);
    } catch (error) {
      console.error("Error selecting location:", error);
    }

  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <div className="mb-4 flex items-center justify-between overflow-x-scroll scrollbar-hide">
          {locations.map((location) => (
            <Button
              variant={"ghost"}
              key={location}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                selectedLocation === location
                  ? "text-black underline underline-offset-8 hover:bg-transparent"
                  : "text-gray-500 hover:bg-transparent"
              }`}
              onClick={() => handleLocationClick(location)}
            >
              {location.split(",")[0]}
            </Button>
          ))}
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

//   return (
//     <Form {...form}>
//       <form onSubmit={onSubmit} className="flex h-16 items-stretch gap-2">
//         {/* <PlacesInput
//           control={form.control}
//           name="location"
//           formLabel="Location"
//           variant="lpDesktop"
//           placeholder="Select a location"
//           icon={MapPinIcon}
//           className="grow-[3] basis-40"
//         /> */}
//         <FormField
//           control={form.control}
//           name="location"
//           render={({ field }) => (
//             <FormItem className="grow basis-32">
//               <FormLabel className="text-sm font-bold text-primary">
//                 Location
//               </FormLabel>
//               <FormControl>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a location" />
//                       <SelectIcon>
//                         <CaretSortIcon className="h-4 w-4 opacity-50" />
//                       </SelectIcon>
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {scrapedLocations.map((location) => (
//                       <SelectItem key={location} value={location}>
//                         {capitalize(location)}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
{
  /* <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="grow basis-32">
              <FormControl>
                <DateRangeInput
                  {...field}
                  label="Check in/out"
                  icon={Users2Icon}
                  variant="lpDesktop"
                  disablePast
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */
}
{
  /* <FormField
          control={form.control}
          name="numGuests"
          render={({ field }) => (
            <FormItem className="grow basis-32">
              <FormControl>
                <Input
                  {...field}
                  label="Guests"
                  placeholder="Add guests"
                  icon={Users2Icon}
                  variant="lpDesktop"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxNightlyPriceUSD"
          render={({ field }) => (
            <FormItem className="grow basis-40">
              <FormControl>
                <Input
                  {...field}
                  label="Maximum price"
                  placeholder="Price per night"
                  suffix="/night"
                  icon={DollarSignIcon}
                  variant="lpDesktop"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */
}
//         <Button
//           type="submit"
//           size="lg"
//           disabled={form.formState.isSubmitting}
//           className="h-16 bg-teal-900 hover:bg-teal-950"
//         >
//           Search
//         </Button>
//       </form>
//     </Form>
//   );
// }
