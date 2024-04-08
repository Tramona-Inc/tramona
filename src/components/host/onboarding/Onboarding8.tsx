import MainLayout from "@/components/_common/Layout/MainLayout";
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
import { Container } from "@react-email/components";
import { zodString } from "@/utils/zod-utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  propertyName: zodString(),
  about: zodString({ maxLen: Infinity }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Onboarding8() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyName: "",
      about: "",
    },
  });

  return (
    <MainLayout>
      <Container className="my-10">
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
      </Container>
    </MainLayout>
  );
}
