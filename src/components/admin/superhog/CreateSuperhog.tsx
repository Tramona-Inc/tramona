"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { env } from "@/env";
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
import { generateGUID } from "@/utils/utils";
export default function SuperhogForm() {
  //for current time stamp
  const date = new Date();
  const milliseconds = Math.round(date.getMilliseconds() / 10); // Round to 2 decimal places
  const formattedMilliseconds = milliseconds.toString().padStart(2, "0"); // Ensure 2 digits

  const formattedTimestamp: string =
    date.toISOString().slice(0, -5) + "." + formattedMilliseconds;

  const defaultRequestValues = {
    metadata: {
      timeStamp: formattedTimestamp,
      echoToken: generateGUID(),
    },
    listing: {
      listingId: "asda3466",
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
      reservationId: "02389ax2547a",
      checkIn: "2024-05-24",
      checkOut: "2024-06-24",
      channel: "airbnb",
      creationDate: "2023-12-19",
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
  const mutation = (data: FormSchema) => {
    api.superhog.createSuperhogRequest.useMutation().mutateAsync(data);
  };

  const onSubmit = async (data: FormSchema) => {
    console.log(data);
    // mutation(data);
  };

  return (
    <Card className="m-12">
      <div className="flex flex-col items-center justify-center">
        <CardHeader className="my-5 text-3xl font-bold text-primary">
          Superhog verification form
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-row items-center justify-around gap-x-3">
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
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        random token to identify the request
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-center justify-around gap-x-3">
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
                        Listing Id / Property Id
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
              </div>
              <div className="flex flex-row items-center justify-around gap-x-3">
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
              <div className="flex flex-row items-center justify-around gap-x-3">
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
              <div className="flex flex-row items-center justify-around gap-x-3">
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
              <div className="flex flex-row items-center justify-around gap-x-3">
                <FormField
                  control={form.control}
                  name="reservation.reservationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">
                        Reservation Id
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
              <div className="flex flex-row items-center justify-around gap-x-3">
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
              <div className="flex flex-row items-center justify-around gap-x-3">
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
              <div className="flex flex-row items-center justify-around gap-x-3">
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
                        Make sure to the country code ex "+1"{" "}
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

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
}
