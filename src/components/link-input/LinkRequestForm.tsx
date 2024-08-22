import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LinkConfirmation from "@/components/landing-page/SearchBars/LinkConfirmation";
import { Link2, Loader2Icon } from "lucide-react";
import {
  type LinkRequestData,
  useLinkRequestForm,
} from "../landing-page/SearchBars/useLinkRequestForm";
import TestScraperConfirmation from "../landing-page/SearchBars/TestScraperConfirmation";

export default function LinkRequestForm() {
  const [openLinkConfirmationDialog, setOpenLinkConfirmationDialog] =
    useState(false);

  // const [data, setData] = useState<LinkRequestData>();
  const [calendarData, setCalendarData] = useState<string[]>([]);

  const { form, onSubmit } = useLinkRequestForm({
    setCalendarData,
    afterSubmit() {
      setOpenLinkConfirmationDialog(true);
    },
  });

  useEffect(() => {
    if (form.formState.isValid && !form.formState.isSubmitting) {
      void onSubmit();
    }
  }, [form.formState.isValid, form.formState.isSubmitting, onSubmit]);

  console.log(calendarData);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      label="Airbnb link"
                      variant="lpDesktop"
                      placeholder="Paste link here"
                      icon={Link2}
                      disabled={form.formState.isSubmitting}
                    />
                    <div className="absolute right-2 top-2">
                      {form.formState.isSubmitting && (
                        <Loader2Icon className="h-4 w-4 animate-[spin_0.4s_linear_infinite]" />
                      )}
                    </div>
                    {/* TODO: fix this hack (required showing up after submission) */}
                    {form.formState.errors.url?.message !== "Required" && (
                      <FormMessage className="absolute right-2 top-1" />
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      {/* {data && (
        <LinkConfirmation
          open={openLinkConfirmationDialog}
          setOpen={setOpenLinkConfirmationDialog}
          property={data.property}
          request={data.request}
          originalPrice={data.originalPrice}
        />
      )} */}
      {calendarData.length > 0 && (
        <TestScraperConfirmation open={openLinkConfirmationDialog} setOpen={setOpenLinkConfirmationDialog} availableDates={calendarData} />
        )}
    </div>
  );
}
