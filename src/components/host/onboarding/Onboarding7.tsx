import ImagesInput from "@/components/_common/ImagesInput";
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
import SaveAndExit from "./SaveAndExit";
import { useEffect, useState } from "react";

const formSchema = z.object({
  imageURLs: z
    .string()
    .array()
    .min(5, { message: "Please submit at least 5 photos" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding7({
  editing = false,
  setHandleOnboarding,
}: {
  editing?: boolean;
  setHandleOnboarding?: (handle: () => void) => void;
}) {
  const initialImageUrls = useHostOnboarding(
    (state) => state.listing.imageUrls,
  );
  const [error, setError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageURLs: initialImageUrls,
    },
  });

  const imageUrls = form.watch().imageURLs;

  const setImageUrls = useHostOnboarding((state) => state.setImageUrls);

  async function handleFormSubmit({ imageURLs }: FormValues) {
    setImageUrls(imageURLs);
  }

  function handleError() {
    setError(true);
  }

  useEffect(() => {
    setHandleOnboarding &&
      setHandleOnboarding(() => form.handleSubmit(handleFormSubmit));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, form.formState, setHandleOnboarding]);

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mb-5 flex w-full flex-grow flex-col items-center justify-center gap-5 max-lg:container">
        <div className="px-4 pb-32 pt-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="my-3 text-3xl font-bold">
              Add some photos of your property
            </h1>
            {error && (
              <p className="text-red-500">Please upload at least 5 photos</p>
            )}
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

                {/* <Button type="submit">Submit</Button> */}
              </form>
            </Form>
            <div className="my-5 text-center">
              <p className="font-bold">
                Total Uploaded Images:{" "}
                <span className="font-normal">{imageUrls.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {!editing && (
        <OnboardingFooter
          handleNext={form.handleSubmit(handleFormSubmit)}
          isFormValid={form.formState.isValid || initialImageUrls.length >= 5}
          isForm={true}
          handleError={handleError}
        />
      )}
    </>
  );
}
