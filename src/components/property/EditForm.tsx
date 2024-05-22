import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import DateRangePicker from "../_common/DateRangePicker";
import { Form } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  date: z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  }),
  price: z.number(),
  guests: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditForm({
  offerId,
  propertyId,
  open,
  onOpenChange,
}: {
  offerId: number;
  propertyId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 1,
      guests: 1,
    },
  });

  async function onSubmit(values: FormSchema) {
    // Reset session if on new date
    console.log("Called");
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dates</FormLabel>
                <FormControl>
                  <DateRangePicker
                    {...field}
                    label={""}
                    propertyId={propertyId}
                    className="col-span-full sm:col-span-1"
                    disablePast
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guests</FormLabel>
                <FormControl>
                  <Input />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
