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
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { options as propertyTypeOptions } from "../host/onboarding/Onboarding2";

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

  imageUrls: z.string().array(),
  name: z.string().max(255),
  about: z.string(),

  petsAllowed: z.string(),
  smokingAllowed: z.string(),

  otherHouseRules: z.string().max(1000).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function AdminPropertyForm({
  afterSubmit,
}: {
  afterSubmit?: () => void;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const { mutateAsync: adminInsertProperty } =
    api.properties.adminInsertProperty.useMutation({
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Property successfully listed",
        });
        void router.push("/host/properties");
      },
    });

  async function onSubmit(data: FormSchema) {
    console.log("form submitted");
    await adminInsertProperty({
      hostId: data.hostId,
      propertyType: data.propertyType,
      roomType: data.roomType,
      maxNumGuests: data.maxNumGuests,
      numBeds: data.numBeds,
      numBedrooms: data.numBedrooms,
      numBathrooms: data.numBathrooms,
      address: data.address,
      checkInInfo: data.checkInInfo,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      amenities: data.amenities,
      otherAmenities: data.otherAmenities,
      imageUrls: data.imageUrls,
      name: data.name,
      about: data.about,
      petsAllowed: data.petsAllowed === "true" ? true : false,
      smokingAllowed: data.smokingAllowed === "true" ? true : false,
      otherHouseRules: data.otherHouseRules ?? undefined,
    });
  }

  return (
    <Form {...form}>
      <h1 className="my-3 text-center text-xl font-bold">
        Admin Property Upload Form
      </h1>
      <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
      {JSON.stringify(form.formState.errors, null, 2)}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container grid grid-cols-2 gap-4"
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
              <FormControl>
                <Input {...field} />
              </FormControl>
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
              <FormControl>
                <Input {...field} />
              </FormControl>
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
              <FormLabel>Check In Info</FormLabel>
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
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkOutTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check Out Time</FormLabel>
              <FormControl>
                <Input {...field} />
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
          name="imageUrls"
          render={({ field }) => (
            <FormItem className="col-span-full">
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
                <div className="flex flex-row items-center space-x-4">
                  <RadioGroup
                    className="flex flex-row gap-10"
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="allowed">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="allowed">No</Label>
                    </div>
                  </RadioGroup>
                </div>
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
                <div className="flex flex-row items-center space-x-4">
                  <RadioGroup
                    className="flex flex-row gap-10"
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="allowed">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="allowed">No</Label>
                    </div>
                  </RadioGroup>
                </div>
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
              <FormLabel>Other House Rules</FormLabel>
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
