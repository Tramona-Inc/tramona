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
import { Textarea } from "@/components/ui/textarea";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { useEffect, useState } from "react";

const formSchema = z.object({
  propertyName: zodString(),
  about: zodString({ maxLen: Infinity }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Onboarding8({
  editing = false,
  setHandleOnboarding,
}: {
  editing?: boolean;
  setHandleOnboarding?: (handle: () => void) => void;
}) {
  const title = useHostOnboarding((state) => state.listing.title);
  const setTitle = useHostOnboarding((state) => state.setTitle);

  const description = useHostOnboarding((state) => state.listing.description);
  const setDescription = useHostOnboarding((state) => state.setDescription);

  const [error, setError] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyName: title,
      about: description,
    },
  });

  async function handleFormSubmit(values: FormSchema) {
    console.log(values);
    setTitle(values.propertyName);
    setDescription(values.about);
  }

  function handleError() {
    setError(true);
  }

  const handleSubmit = form.handleSubmit(handleFormSubmit);

  useEffect(() => {
    setHandleOnboarding?.(() => handleSubmit);
  }, [handleSubmit, setHandleOnboarding]);

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="container my-10 flex flex-grow flex-col justify-center">
        <h1 className="mb-3 text-3xl font-bold">Describe your listing</h1>
        {error && (
          <p className="text-red-500">Please fill out all required fields</p>
        )}
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="propertyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-foreground">
                    Create a title
                  </FormLabel>
                  <FormDescription>
                    Keep it short and descriptive.
                  </FormDescription>
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
                <FormItem>
                  <FormLabel className="text-lg font-bold text-foreground">
                    Create your description
                  </FormLabel>
                  <FormDescription>
                    Share what makes your place unique.
                  </FormDescription>
                  <FormControl>
                    <Textarea {...field} className="resize-y" rows={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>

      {!editing && (
        <OnboardingFooter
          handleNext={form.handleSubmit(handleFormSubmit)}
          isFormValid={form.formState.isValid}
          isForm={true}
          handleError={handleError}
        />
      )}
    </>
  );
}
