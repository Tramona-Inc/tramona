import ImagesInput from "@/components/_common/ImagesInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from './SaveAndExit';

const formSchema = z.object({
  imageURLs: z
    .string()
    .array()
    .min(5, { message: "Please submit at least 5 photos" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding7() {
  const imageURLs = useHostOnboarding((state) => state.listing.imageUrls);

  console.log(imageURLs);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageURLs: imageURLs,
    },
  });

  const setImageUrls = useHostOnboarding((state) => state.setImageUrls);

  async function handleFormSubmit({ imageURLs }: FormValues) {
    console.log(imageURLs);
    setImageUrls(imageURLs);
  }

  return (
    <>
      <SaveAndExit />
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="px-4 pb-32 pt-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-old my-3 text-3xl">
              Add some photos of your property
            </h1>
            <p className="mb-5 text-muted-foreground">
              Choose at least 5 photos (put your best photos first)
            </p>
            <Form {...form}>
              <form
                className="flex flex-col gap-2"
                onSubmit={form.handleSubmit(handleFormSubmit)}
                noValidate
                autoComplete="off"
              >
                <FormField
                  control={form.control}
                  name="imageURLs"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImagesInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
              </form>
            </Form>
            <div className="my-5 text-center">
              <p className="font-bold">
                Total Uploaded Images:{" "}
                <span className="font-normal">{imageURLs.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <OnboardingFooter isForm={false} />
    </>
  );
}
