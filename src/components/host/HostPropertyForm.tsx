import { Input } from "@/components/ui/input";
import { ALL_PROPERTY_TYPES, propertyInsertSchema } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

import { capitalize } from "@/utils/utils";
import { type z } from "zod";
import ErrorMsg from "../ui/ErrorMsg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const formSchema = propertyInsertSchema;

type FormSchema = z.infer<typeof formSchema>;

export default function HostPropertyForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hostName: "",
      address: "",
      areaDescription: "",
    },
  });

  function onSubmit() {
    return null;
  }

  return (
    <>
      <Form {...form}>
        <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Property name</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="originalNightlyPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property&apos;s original price (nightly)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    inputMode="decimal"
                    prefix="$"
                    suffix="/night"
                  />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALL_PROPERTY_TYPES.map((propertyType) => (
                      <SelectItem key={propertyType} value={propertyType}>
                        {capitalize(propertyType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxNumGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (max # of guests)</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numBeds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beds</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numBedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avgRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average rating</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="decimal" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numRatings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of ratings</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  {/* <TagSelect
                    options={ALL_PROPERTY_AMENITIES}
                    onChange={field.onChange}
                    value={field.value}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="standoutAmenities"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Standout Amenities</FormLabel>
                <FormControl>
                  {/* <TagSelect
                    options={ALL_PROPERTY_STANDOUT_AMENITIES}
                    onChange={field.onChange}
                    value={field.value}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyItems"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Safety Items</FormLabel>
                <FormControl>
                  {/* <TagSelect
                    options={ALL_PROPERTY_SAFETY_ITEMS}
                    onChange={field.onChange}
                    value={field.value}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>About property</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-y" rows={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Address (optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="text" value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkInInfo"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Check In Info (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    className="resize-y"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areaDescription"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Area Description (optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="text" value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            size="lg"
            type="submit"
            className="col-span-full"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
