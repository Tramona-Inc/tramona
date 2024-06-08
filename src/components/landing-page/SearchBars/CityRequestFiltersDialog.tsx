import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type CityRequestForm } from "./useCityRequestForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"; 
import { Total } from "../search/MobilePropertyFilter";

export function CityRequestFiltersDialog({
  form,
  curTab,
  children,
}: {
  form: CityRequestForm;
  curTab: number;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div className="">
          <FormField
            control={form.control}
            name={`data.${curTab}.minNumBeds`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Total
                    name="Beds"
                    total={field.value ?? 0}
                    setTotal={field.onChange}
                    size="size-3/5"
                    textSize="text-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`data.${curTab}.minNumBedrooms`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Total
                    name="Bedrooms"
                    total={field.value ?? 0}
                    setTotal={field.onChange}
                    size="size-3/5"
                    textSize="text-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`data.${curTab}.minNumBathrooms`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Total
                    name="Bathrooms"
                    total={field.value ?? 0}
                    setTotal={field.onChange}
                    size="size-3/5"
                    textSize="text-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
