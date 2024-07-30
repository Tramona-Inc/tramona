import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useHostOnboarding } from '@/utils/store/host-onboarding';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OnboardingFooter from './OnboardingFooter';
import SaveAndExit from './SaveAndExit';

const formSchema = z.object({
  iCalUrl: z.string().url('Please enter a valid URL'),
});

type FormSchema = z.infer<typeof formSchema>;

export default function PropertyAvailability({
  editing = false,
}) {
  const [bookedDates, setBookedDates] = useState([]);
  const setBookingDates = useHostOnboarding((state) => state.setBookingDates);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  async function handleFormSubmit(values: FormSchema) {
    try {
      // Send the iCal URL to your backend for processing
      const response = await axios.post('/api/calendar-sync', { iCalUrl: values.iCalUrl, propertyId: 5033 });
      const dates = response.data.dates;
      setBookingDates(dates);
      setBookedDates(dates);
    } catch (error) {
      console.error('Error syncing calendar:', error);
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="mt-10 flex flex-col gap-10">
          <h1 className="text-4xl font-bold">
            Enter your iCal URL
          </h1>
          <Form {...form}>
            <FormField
              control={form.control}
              name="iCalUrl"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold">iCal URL</Label>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://example.com/calendar.ics"
                  />
                  <FormMessage>
                    {form.formState.errors.iCalUrl?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </Form>
          <div>
            <h2 className="text-2xl font-bold">Booked Dates</h2>
            <ul>
              {bookedDates.map((date, index) => (
                <li key={index}>
                  {date.summary} from {new Date(date.start).toLocaleString()} to {new Date(date.end).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {!editing && (
        <OnboardingFooter
          handleNext={form.handleSubmit(handleFormSubmit)}
          isFormValid={form.formState.isValid}
          isForm={true}
        />
      )}
    </>
  );
}