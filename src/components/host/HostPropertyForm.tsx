import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { capitalize } from "@/utils/utils";
import {
  optional,
  zodInteger,
  zodNumber,
  zodString,
  zodUrl,
} from "@/utils/zod-utils";
import { useFieldArray } from "react-hook-form";
import TagSelect from "../_common/TagSelect";
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
import { ALL_PROPERTY_TYPES } from "@/server/db/schema";
import { ALL_PROPERTY_AMENITIES } from "@/server/db/schema/tables/propertyAmenities";
import { SelectIcon } from "@radix-ui/react-select";
import { CaretSortIcon } from "@radix-ui/react-icons";

export const hostPropertyFormSchema = z.object({
  name: zodString(),
  originalNightlyPrice: zodNumber(),
  propertyType: z.enum(ALL_PROPERTY_TYPES),
  maxNumGuests: zodInteger({ min: 1 }),
  numBeds: zodInteger({ min: 1 }),
  numBedrooms: zodInteger({ min: 1 }),
  avgRating: zodNumber({ min: 0, max: 5 }),
  numRatings: zodInteger({ min: 1 }),
  amenities: z.enum(ALL_PROPERTY_AMENITIES).array(),
  about: zodString({ maxLen: Infinity }),
  address: optional(zodString({ maxLen: 1000 })),
  checkInInfo: optional(zodString()),
  areaDescription: optional(zodString({ maxLen: Infinity })),
  imageUrls: z
    .object({ value: zodUrl() })
    .array()
    .transform((arr) => arr.map((o) => o.value)),
});

type FormSchema = z.infer<typeof hostPropertyFormSchema>;

export default function HostPropertyForm({
  setOpen,
}: {
  setOpen: (isOpen: boolean) => void;
}) {
  const form = useForm<
    z.input<typeof hostPropertyFormSchema>,
    unknown,
    FormSchema
  >({
    resolver: zodResolver(hostPropertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      areaDescription: "",
      imageUrls: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      amenities: [],
    },
  });

  const imageUrlInputs = useFieldArray({
    name: "imageUrls",
    control: form.control,
  });

  const { mutateAsync } = api.properties.create.useMutation({
    onSuccess: () => {
      form.reset();
      setOpen(false);

      toast({
        title: "Successfully added property",
        description: "Your property will now get some listings",
      });
    },
    onError: () => {
      errorToast("Couldn't add your property");
    },
  });

  async function onSubmit(values: FormSchema) {
    await mutateAsync(values);
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
                    value={field.value}
                    inputMode="numeric"
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
                      <SelectIcon>
                        <CaretSortIcon className="h-4 w-4 opacity-50" />
                      </SelectIcon>
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
                  <TagSelect
                    options={ALL_PROPERTY_AMENITIES}
                    onChange={field.onChange}
                    value={field.value}
                  />
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

          <FormItem className="col-span-full space-y-1">
            <FormLabel>Image URLs</FormLabel>
            <div className="space-y-2 rounded-md border bg-secondary p-2">
              {imageUrlInputs.fields.map((field, i) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`imageUrls.${i}.value`} // Update this line
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="url"
                          placeholder={`Image URL ${i + 1} (${
                            i === 0
                              ? "primary image"
                              : i < 5
                                ? "required"
                                : "optional"
                          })`}
                          onKeyDown={(e) => {
                            const n = imageUrlInputs.fields.length;

                            switch (e.key) {
                              case "Enter":
                                imageUrlInputs.insert(i + 1, {
                                  value: "",
                                });
                                e.preventDefault();
                                break;
                              case "ArrowDown":
                                form.setFocus(`imageUrls.${(i + 1) % n}.value`);
                                break;
                              case "ArrowUp":
                                form.setFocus(
                                  `imageUrls.${(i + n - 1) % n}.value`,
                                );
                                break;
                              case "Backspace":
                                if (n > 3 && e.currentTarget.value === "") {
                                  imageUrlInputs.remove(i);
                                  form.setFocus(
                                    `imageUrls.${i === n - 1 ? i - 1 : i}.value`,
                                  );
                                }
                                break;
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="emptyInput"
                className="w-full"
                onClick={() => imageUrlInputs.append({ value: "" })}
              >
                Add another image (optional)
              </Button>
            </div>
          </FormItem>

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
