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
        <div className="flex flex-col">
          <div className="pb-1 text-xs font-semibold">Optional</div>
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name={`data.${curTab}.minNumBeds`}
              render={({ field }) => (
                <FormItem className="rounded-md border border-input pl-2">
                  <FormControl>
                    <Total
                      name="Beds"
                      total={field.value ?? 0}
                      setTotal={field.onChange}
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
                <FormItem className="rounded-md border border-input pl-2">
                  <FormControl>
                    <Total
                      name="Bedrooms"
                      total={field.value ?? 0}
                      setTotal={field.onChange}
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
                <FormItem className="rounded-md border border-input pl-2">
                  <FormControl>
                    <Total
                      name="Bathrooms"
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
