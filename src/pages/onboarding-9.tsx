import MainLayout from "@/components/_common/Layout/MainLayout";
import { Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@react-email/components";
import {
  optional,
  zodInteger,
  zodNumber,
  zodString,
  zodUrl,
} from "@/utils/zod-utils";
import { ZodBoolean, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { boolean } from "drizzle-orm/mysql-core";

const formSchema = z.object({
  pets: ZodBoolean,
  smoking: ZodBoolean,
  additionalComments: zodString()
});

type FormSchema = z.infer<typeof formSchema>;

export default function Onboarding9() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pets: '',
      smoking: '',
      additionalComments: ''
    },
  });

  return (
    <MainLayout>
      <Container className="my-10">
        <h1 className="font-bold text-3xl mb-8">Any house rules?</h1>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="pets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-bold text-lg">Are pets allowed?</FormLabel>
                  <FormControl>
                    <div className="flex space-x-4 items-center">
                      <div className="border-2 rounded-sm w-1/4 p-1">
                        <Checkbox id="pets"/>
                          <label htmlFor="pets" className="ps-2">
                            Yes
                          </label>
                      </div>
                      <div className="border-2 rounded-sm w-1/4 p-1">
                        <Checkbox id="pets"/>
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
                  <FormLabel className="text-primary font-bold text-lg">Is smoking allowed?</FormLabel>
                  <FormControl>
                    <div className="flex space-x-4 items-center">
                      <div className="border-2 rounded-sm w-1/4 p-1">
                        <Checkbox id="pets"/>
                          <label htmlFor="pets" className="ps-2">
                            Yes
                          </label>
                      </div>
                      <div className="border-2 rounded-sm w-1/4 p-1">
                        <Checkbox id="pets"/>
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
                  <FormLabel className="text-primary font-bold text-lg">Anything you'd like to add?</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-y" rows={10} placeholder="Quiet time after 11 pm, no smoking"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </Container>
    </MainLayout>
  )
}