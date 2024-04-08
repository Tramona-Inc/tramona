import MainLayout from "@/components/_common/Layout/MainLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@react-email/components";
import { zodString } from "@/utils/zod-utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  pets: z.boolean(),
  smoking: z.boolean(),
  additionalComments: zodString(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Onboarding9() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pets: false,
      smoking: false,
      additionalComments: "",
    },
  });

  return (
    <MainLayout>
      <Container className="my-10">
        <h1 className="mb-8 text-3xl font-semibold">Any house rules?</h1>
        <Form {...form}>
          <div className="space-y-4">
            {/* TO DO: FIX */}
            <FormField
              control={form.control}
              name="pets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-primary">
                    Are pets allowed?
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <div className="w-2/5 rounded-sm border-2 p-2">
                        <Checkbox id="pets" />
                        <label htmlFor="pets" className="ps-2">
                          Yes
                        </label>
                      </div>
                      <div className="w-2/5 rounded-sm border-2 p-2">
                        <Checkbox id="pets" />
                        <label htmlFor="pets" className="ps-2">
                          No
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smoking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-primary">
                    Is smoking allowed?
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <div className="w-2/5 rounded-sm border-2 p-2">
                        <Checkbox id="pets" />
                        <label htmlFor="pets" className="ps-2">
                          Yes
                        </label>
                      </div>
                      <div className="w-2/5 rounded-sm border-2 p-2">
                        <Checkbox id="pets" />
                        <label htmlFor="pets" className="ps-2">
                          No
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-primary">
                    Anything you&apos;d like to add?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-y"
                      rows={10}
                      placeholder="Quiet time after 11 pm, no smoking"
                    />
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
