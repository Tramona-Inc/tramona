import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { getNumNights, getPropertyId } from '@/utils/utils';

const formSchema = z.object({
  userName: z.string().min(1, "User name is required"),
  userProfilePicUrl: z.union([z.literal(""), z.string().trim().url("Must be a valid URL")]), 
  checkIn: z.string().min(1, "Start date is required"),
  checkOut: z.string().min(1, "End date is required"),
  propertyUrl: z.string().trim().url("Must be a valid URL"),
  entryCreationTime: z.string().min(1, "Offer creation time is required"),
  nightlyPrice: z.number().min(1, "Nightly price must be at least 1"),
  originalNightlyPrice: z.number().min(1, "Nightly price must be at least 1"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateBookingForm({ afterSubmit }: { afterSubmit?: () => void }) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      userProfilePicUrl: "",
      checkIn: "",
      checkOut: "",
      propertyUrl: "",
      entryCreationTime: new Date().toISOString().slice(0, 19), // Set default to current date
      nightlyPrice: 0,
      originalNightlyPrice: 0,
    },
  });

  function onSubmit(data: FormSchema) {
    const formattedData = {
        ...data,
        entryCreationTime: new Date(data.entryCreationTime).toISOString(),
        maxTotalPrice: data.nightlyPrice * getNumNights(data.checkIn, data.checkOut),
        propertyId: getPropertyId(data.propertyUrl),
    };
    console.log(formattedData);
    // TODO send the data to backend
    afterSubmit?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
        control={form.control}
        name="userProfilePicUrl"
        render={({ field }) => (
            <FormItem className="col-span-full">
            <FormLabel>User Profile Pic URL (Optional)</FormLabel>
            <FormControl>
                <Input {...field} type="url" placeholder="https://example.com/profile-pic.jpg" />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
          control={form.control}
          name="checkIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Travel Start Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkOut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Travel End Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        
        <FormField
          control={form.control}
          name="nightlyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nightly Price</FormLabel>
              <FormControl>
                <Input {...field} type="number" inputMode="decimal" prefix="$" onChange={(e) => field.onChange(parseFloat(e.target.value))}/>
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
              <FormLabel>Original Nightly Price</FormLabel>
              <FormControl>
                <Input {...field} type="number" inputMode="decimal" prefix="$" onChange={(e) => field.onChange(parseFloat(e.target.value))}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
        control={form.control}
        name="propertyUrl"
        render={({ field }) => (
            <FormItem className="col-span-full">
            <FormLabel>Tramona Property URL</FormLabel>
            <FormControl>
                <Input {...field} type="url" placeholder="https://www.tramona.com/property/4959" />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

    <FormField
          control={form.control}
          name="entryCreationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel> CreatedAt (By default current time)</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" step="1"/>
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
          Confirm Offer
        </Button>
      </form>
    </Form>
  );
}