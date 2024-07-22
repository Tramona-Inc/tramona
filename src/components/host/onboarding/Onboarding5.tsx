import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
// import ical from 'ical';
import { useHostOnboarding } from '@/utils/store/host-onboarding';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OnboardingFooter from './OnboardingFooter';
import SaveAndExit from './SaveAndExit';

const formSchema = z.object({
  calendarFile: z.instanceof(File, { message: 'Please upload a calendar file' }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function PropertyAvailability({
  editing = false,
  setHandleOnboarding,
}) {
  const [bookedDatez, setBookedDatez] = useState([]);
  const setBookingDates = useHostOnboarding((state) => state.setBookingDates);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue('calendarFile', file);
      // await parseCalendarFile(file);
    }
  };

  // const parseCalendarFile = async (file) => {
  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     const data = event.target.result;
  //     const parsedData = ical.parseICS(data);
  //     const events = Object.values(parsedData).filter((event) => event.type === 'VEVENT');
  //     const dates = events.map((event) => ({
  //       start: event.start,
  //       end: event.end,
  //       summary: event.summary,
  //     }));
  //     setBookingDates(dates);
  //     setBookedDatez(dates);
  //   };
  //   reader.readAsText(file);
  // };

  async function handleFormSubmit(values: FormSchema) {
    // Handle form submission if necessary
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="mt-10 flex flex-col gap-10">
          <h1 className="text-4xl font-bold">
            Upload your iCal or Google Calendar
          </h1>
          <Form {...form}>
            <FormField
              control={form.control}
              name="calendarFile"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold">Calendar File</Label>
                  <Input
                    {...field}
                    type="file"
                    accept=".ics"
                    onChange={handleFileChange}
                  />
                  <FormMessage>
                    {form.formState.errors.calendarFile?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </Form>
          <div>
            <h2 className="text-2xl font-bold">Booked Dates</h2>
            <ul>
              {bookedDatez.map((date, index) => (
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
