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
  
  export function OptionalFilter({
    form,
    curTab,
    children,
  }: {
    form: CityRequestForm;
    curTab: number;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col">
        <div className="hidden lg:flex pb-1 text-xs font-semibold">Optional</div>
        <div className="grid lg:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name={`data.${curTab}.minNumBeds`}
            render={({ field }) => (
              <FormItem className="rounded-md border pl-2 bg-white">
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
              <FormItem className="rounded-md border pl-2 bg-white">
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
              <FormItem className="rounded-md border pl-2 bg-white">
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
    );
  }
  