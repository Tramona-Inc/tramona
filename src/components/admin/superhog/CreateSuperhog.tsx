import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Separator } from "../../ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  formatDateYearMonthDay,
  generateTimeStamp,
  addDays,
} from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { type AxiosError } from "axios";

//IMPORTANT THERE IS TWO RESERVATION ID. reservationID is a required is a required
//input for the superhog verification API,howerver reservation.id is the primary key of the reservation table in the database
//The reservationID is saved
export default function SuperhogForm() {
  const { toast } = useToast();

  const defaultRequestValues = {
    metadata: {
      timeStamp: generateTimeStamp(),
      echoToken: uuidv4(),
    },
    listing: {
      listingId: "3640",
      listingName: "Padron retreat house",
      address: {
        addressLine1: "Peper street number 32",
        addressLine2: "4b",
        town: "Padron",
        countryIso: "USA",
        postcode: "15900",
      },
      petsAllowed: "True",
    },
    reservation: {
      reservationId: "42",
      checkIn: formatDateYearMonthDay(addDays(new Date(), 1)).toString(),
      checkOut: formatDateYearMonthDay(addDays(new Date(), 2)).toString(),
      channel: "Tramona",
      creationDate: formatDateYearMonthDay(new Date()).toString(),
    },
    guest: {
      firstName: "Peter",
      lastName: "OConnor",
      email: "oconnor@airbnb.com",
      telephoneNumber: "+34695147354",
    },
  };
  const formSchema = z.object({
    metadata: z.object({
      timeStamp: z.string(),
      echoToken: z.string(),
    }),
    listing: z.object({
      listingId: z.string(),
      listingName: z.string(),
      address: z.object({
        addressLine1: z.string(),
        addressLine2: z.string(),
        town: z.string(),
        countryIso: z.string(),
        postcode: z.string(),
      }),
      petsAllowed: z.string(),
    }),
    reservation: z.object({
      reservationId: z.string(),
      checkIn: z.string(),
      checkOut: z.string(),
      channel: z.string(),
      creationDate: z.string(),
    }),
    guest: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      telephoneNumber: z.string(),
    }),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultRequestValues,
  });

  const { mutateAsync: createSuperhogRequest, isLoading: isSubmitting } =
    api.superhog.createSuperhogRequest.useMutation({
      onSuccess: () => {
        toast({
          title: "Superhog verification submitted!",
          description: "Please wait for 1 minute.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Error submitting a request",
        });
      },
    });

  async function handleCreateSuperhogRequest(data: FormSchema) {
    try {
      await createSuperhogRequest(data);
    } catch (error) {
      // Handle the error gracefully here
      const axiosError = error as AxiosError;
      toast({
        variant: "destructive",
        title: "Error",
        description:
          axiosError.message ||
          "An error occurred while submitting the request.",
      });
    }
  }

  const onSubmit = async (data: FormSchema) => {
    await handleCreateSuperhogRequest(data);
  };

  return (
    <Card className="m-12">
      <div className="flex flex-col items-center justify-center">
        <CardHeader className="my-5 text-3xl font-bold text-primary">
          Superhog verification form
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="metadata.timeStamp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Time Stamp
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Time stamp of the request is automatic
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metadata.echoToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Echo Token
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        random token to identify the request
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="listing.listingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Listing name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="listing.listingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Listing Id (Property Id)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Input an existing property id
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="listing.address.addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Address Line1
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="listing.address.addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Address Line2
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="listing.address.town"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Town/City
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="listing.address.countryIso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Country ISO
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="listing.address.postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-primary">
                      Post Code
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Required</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="listing.petsAllowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Pets allowed
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="True" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="True">Yes</SelectItem>
                            <SelectItem value="False">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>True/false</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="listing.address.countryIso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Country ISO
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="reservation.reservationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Superhog Reservation Id (Trip Id)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Required/Input a valid trip id
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reservation.channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Channel
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>required Tramona/airbnb</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="reservation.checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Check in
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>year/month/day</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reservation.checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Check out
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>year/month/day</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="reservation.creationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-primary">
                      Creation Date
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>year/month/day</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="guest.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Guest First Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guest.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Guest Last Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-center justify-around gap-x-10">
                <FormField
                  control={form.control}
                  name="guest.telephoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Guest Telephone Number
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Make sure to the country code ex: +1
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guest.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Guest Email
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Required</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">
                {" "}
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
}
