import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import MainLayout from "@/components/_common/Layout/MainLayout";
import { Container } from "@react-email/components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ImagesInput from "@/components/_common/ImagesInput";

const formSchema = z.object({
  imageURLs: z
    .string()
    .array()
    .min(5, { message: "Please submit at least 5 photos" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding7() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageURLs: [],
    },
  });

  async function handleFormSubmit({ imageURLs }: FormValues) {
    console.log(imageURLs);
  }

  return (
    <MainLayout>
      <div className="px-4 pb-32 pt-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="my-3 text-3xl font-semibold">
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
        </div>
      </div>
    </MainLayout>
  );
}
