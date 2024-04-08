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

const formSchema = z.object({
  propertyName: zodString(),
  about: zodString({ maxLen: Infinity }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Onboarding8() {
  const title = useHostOnboarding((state) => state.listing.title);
  const setTitle = useHostOnboarding((state) => state.setTitle);

  const description = useHostOnboarding((state) => state.listing.description);
  const setDescription = useHostOnboarding((state) => state.setDescription);

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

  return (
    <>
      <div className="container my-10 flex flex-grow flex-col justify-center">
        <h1 className="mb-8 text-3xl font-bold">Describe your listing</h1>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="propertyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-primary">
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
                  <FormLabel className="text-lg font-bold text-primary">
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

      <OnboardingFooter
        handleNext={form.handleSubmit(handleFormSubmit)}
        isFormValid={form.formState.isValid}
        isForm={true}
      />
    </>
  );
}
