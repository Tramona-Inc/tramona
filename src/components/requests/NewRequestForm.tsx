import { zodResolver } from "@hookform/resolvers/zod";
import { FilterIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { optional, zodInteger, zodString } from "@/utils/zod-utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { errorToast, successfulRequestToast } from "@/utils/toasts";
import { ALL_PROPERTY_TYPES } from "@/server/db/schema";
import { api } from "@/utils/api";
import DateRangePicker from "../form-utils/DateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { capitalize } from "@/utils/utils";

const formSchema = z
  .object({
    location: zodString(),
    maxTotalPriceUSD: zodInteger({ min: 1 }),
    date: z.object({
      from: z.date(),
      to: z.date(),
    }),
    numGuests: zodInteger({ min: 1 }),
    propertyType: z.enum(ALL_PROPERTY_TYPES).optional(),
    minNumBedrooms: optional(zodInteger()),
    minNumBeds: optional(zodInteger()),
    note: optional(zodString()),
  })
  .refine((data) => data.date.to > data.date.from, {
    message: "Must stay for at least 1 night",
    path: ["date"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function NewRequestForm(props: { afterSubmit?: () => void }) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const mutation = api.requests.create.useMutation();

  const { minNumBedrooms, minNumBeds, propertyType, note } = form.watch();
  const fmtdMinNumBedrooms =
    (minNumBedrooms ?? "") === "" ? undefined : `${minNumBedrooms}+ bedrooms`;
  const fmtdMinNumBeds =
    (minNumBeds ?? "") === "" ? undefined : `${minNumBeds}+ beds`;
  const filters = [
    fmtdMinNumBedrooms,
    fmtdMinNumBeds,
    propertyType,
    note,
  ].filter(Boolean);
  const fmtdFilters = filters.length === 0 ? undefined : filters.join(" • ");

  async function onSubmit(data: FormSchema) {
    const { date: _date, maxTotalPriceUSD, ...restData } = data;

    const newRequest = {
      checkIn: data.date.from,
      checkOut: data.date.to,
      maxTotalPrice: maxTotalPriceUSD * 100,
      ...restData,
    };

    try {
      await mutation.mutateAsync(newRequest);
      successfulRequestToast(newRequest);
      props.afterSubmit?.();
    } catch (error) {
      if (error instanceof Error) {
        errorToast(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="col-span-full sm:col-span-1">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxTotalPriceUSD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name your price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Total budget ($USD)"
                  inputMode="decimal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of guests</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DateRangePicker
          control={form.control}
          name="date"
          formLabel="Check in/Check out"
          className="col-span-full sm:col-span-1"
        />

        <FormItem className="col-span-full">
          <FormLabel>Filters (optional)</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={fmtdFilters ? "filledInput" : "emptyInput"}
                className="pl-3"
              >
                <p className="overflow-clip text-ellipsis">
                  {fmtdFilters ? fmtdFilters : "Add filters"}
                </p>
                <FilterIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="top"
              className="grid w-screen max-w-sm grid-cols-2 gap-4 p-2"
            >
              <p className="col-span-full pt-1 text-lg font-semibold">
                Add filters (optional)
              </p>
              <FormField
                control={form.control}
                name="minNumBedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Bedrooms</FormLabel>
                    <FormControl>
                      <Input {...field} inputMode="numeric" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minNumBeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Beds</FormLabel>
                    <FormControl>
                      <Input {...field} inputMode="numeric" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_PROPERTY_TYPES.map((propertyType) => (
                            <SelectItem key={propertyType} value={propertyType}>
                              {capitalize(propertyType)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Additional notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder="e.g. Pet friendly, close to the ocean"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </PopoverContent>
          </Popover>
        </FormItem>

        <Button
          isLoading={form.formState.isSubmitting}
          size="lg"
          type="submit"
          className="col-span-full"
        >
          Request Deal
        </Button>
      </form>
    </Form>
  );
}
