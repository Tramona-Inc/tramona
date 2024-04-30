import { formatCurrency, getNumNights } from "@/utils/utils";
import { zodInteger } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DateRangePicker from "../_common/DateRangePicker";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import ErrorMsg from "../ui/ErrorMsg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  numGuests: zodInteger({ min: 1 }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function BiddingForm({
  propertyId,
  price,
}: {
  propertyId: number;
  price: number;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { watch } = form;

  const totalNightlyPrice =
    price *
    getNumNights(
      watch("date.from") ?? new Date(),
      watch("date.to") ?? new Date(),
    );

  async function onSubmit(data: FormSchema) {
    let url: string | null = null;
  }

  return (
    <Card className="">
      <h2 className="flex items-center text-3xl font-semibold">
        {formatCurrency(price)}
        <span className="ml-2 py-0 text-sm font-normal text-gray-500">
          per night
        </span>
      </h2>
      <Form {...form}>
        <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <DateRangePicker
            control={form.control}
            name="date"
            formLabel=""
            className="col-span-full rounded-3xl sm:col-span-1"
            propertyId={propertyId}
          />

          <FormField
            control={form.control}
            name="numGuests"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    className="rounded-3xl"
                    suffix={"Guests"}
                    placeholder="Guests"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex flex-row justify-between">
        <p>
          {formatCurrency(price)} x{" "}
          {getNumNights(
            watch("date.from") ?? new Date(),
            watch("date.to") ?? new Date(),
          )}{" "}
          nights
        </p>
        <p>{formatCurrency(totalNightlyPrice ?? 0)} </p>
      </div>

      <Separator />

      <Button className="rounded-3xl">Make Offer</Button>
    </Card>
  );
}
