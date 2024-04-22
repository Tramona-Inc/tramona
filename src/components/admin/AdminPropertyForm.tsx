import {
  ALL_PROPERTY_ROOM_TYPES,
  ALL_PROPERTY_TYPES,
} from "@/server/db/schema/tables/properties";
import { zodInteger, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ErrorMsg from "../ui/ErrorMsg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import TagSelect from "../_common/TagSelect";
import { ALL_PROPERTY_AMENITIES } from "@/server/db/schema/tables/propertyAmenities";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import ImagesInput from "../_common/ImagesInput";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { capitalize } from "@/utils/utils";

const formSchema = z.object({
  hostId: zodString(),

  propertyType: z.enum(ALL_PROPERTY_TYPES),
  roomType: z.enum(ALL_PROPERTY_ROOM_TYPES),

  maxNumGuests: zodInteger({ min: 1 }),
  numBeds: zodInteger({ min: 1 }),
  numBedrooms: zodInteger({ min: 1 }),
  numBathrooms: zodInteger({ min: 1 }),

  address: z.string().max(1000),

  checkInInfo: z.string(),
  checkInTime: z.string(),
  checkOutTime: z.string(),

  amenities: z.string().array(),

  otherAmenities: z.string().array(),

  imageUrls: z
    .string()
    .array()
    .min(5, { message: "Please submit at least 5 photos" }),
  name: z.string().max(255),
  about: z.string(),

  petsAllowed: z.enum(["yes", "no"]).transform((s) => s === "yes"),
  smokingAllowed: z.enum(["yes", "no"]).transform((s) => s === "yes"),

  otherHouseRules: z.string().max(1000).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function AdminPropertyForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { otherAmenities: [] },
  });

  const { mutateAsync: createProperty } =
    api.properties.createForHost.useMutation();

  async function onSubmit(data: FormSchema) {
    const res = await createProperty(data);
    switch (res.status) {
      case "host not found":
        form.setError(
          "hostId",
          {
            message: "Host with this id not found, please try again",
          },
          { shouldFocus: true },
        );
        break;

      case "user not a host":
        form.setError(
          "hostId",
          {
            message: "The user with this id isn't a host, please try again",
          },
          { shouldFocus: true },
        );
        break;

      case "success":
        toast({
          title: `Successfully created property${res.hostName ? ` for ${res.hostName}` : ""}`,
        });
        break;
    }
  }

  return (
    <Form {...form}>
      <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
      {/* {JSON.stringify(form.formState.errors, null, 2)} to check for form state errors */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 rounded-xl border bg-white p-4"
      >
        <FormField
          control={form.control}
          name="hostId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host Id</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="roomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ALL_PROPERTY_ROOM_TYPES.map((roomType) => (
                    <SelectItem key={roomType} value={roomType}>
                      {capitalize(roomType)}
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
              <FormLabel>Max Number of Guests</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" type="number" />
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
              <FormLabel>Number of Beds</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" type="number" />
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
              <FormLabel>Number of Bedrooms</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numBathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Bathrooms</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkInInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Check In Info (How will the guests check in?)
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkInTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check In Time</FormLabel>
              <Input
                {...field}
                type="time"
                placeholder="Check in time"
                className="p-5"
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkOutTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check Out Time</FormLabel>
              <Input
                {...field}
                type="time"
                placeholder="Check out time"
                className="p-5"
              />
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
        {/* <FormField
          control={form.control}
          name="otherAmenities"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Other Amenities</FormLabel>
              <FormControl>
                {amenityCategories.map((category) =>
                  category.amenities.map((amenity) => {
                    amenity;
                  }),
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Add some photos of the property</FormLabel>
              <FormControl>
                <ImagesInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Property name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="petsAllowed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are pets allowed?</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex flex-row gap-10 pt-2"
                  onValueChange={field.onChange}
                >
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="yes" />
                    Yes
                  </Label>
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="no" />
                    No
                  </Label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smokingAllowed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is smoking allowed?</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex flex-row gap-10 pt-2"
                  onValueChange={field.onChange}
                >
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="yes" />
                    Yes
                  </Label>
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="no" />
                    No
                  </Label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otherHouseRules"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Other House Rules (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="col-span-full"
          disabled={form.formState.isSubmitting}
        >
          Upload Property
        </Button>
      </form>
    </Form>
  );
}
