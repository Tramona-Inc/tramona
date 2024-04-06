import MainLayout from "@/components/_common/Layout/MainLayout";
import { Container } from "@react-email/components";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhotosDropzone from "@/components/_common/PhotosDropzone";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  imageURLs: z.string().array(),
  moreImageURLs: z.string().array(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding7() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageURLs: [],
      moreImageURLs: [],
    },
  });

  async function handleFormSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <MainLayout>
      <Container className="my-10">
        <h1 className="my-3 text-3xl font-bold">
          Add some photos of your property
        </h1>
        <p className="mb-5 text-muted-foreground">Choose at least 5 photos</p>
        <PhotosDropzone
          control={form.control}
          name="imageURLs"
          minPhotosRequired={5}
        />
      </Container>
    </MainLayout>
  );
}
