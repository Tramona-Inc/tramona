import { formatCurrency } from "@/utils/utils";
import { zodInteger } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, UsersRoundIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { type FormSchema } from "../landing-page/SearchBar/DesktopSearchBar";
import { Card } from "../ui/card";
import ErrorMsg from "../ui/ErrorMsg";
import { Form } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  numGuests: zodInteger({ min: 1 }),
});

export default function BiddingForm({ price }: { price: number }) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(data: FormSchema) {
    let url: string | null = null;
  }

  return (
    <Card className="">
      <div>
        <h2 className="flex items-center text-3xl font-semibold">
          {formatCurrency(price)}
          <span className="ml-2 py-0 text-sm font-normal text-gray-500">
            per night
          </span>
        </h2>
        <p className="text-sm font-medium text-black">
          {/* Original price: {formatCurrency(originalTotal / numNights)} */}
        </p>
        <div className="my-6 grid grid-cols-2 gap-1">
          <div>
            <div className="inline-flex items-center justify-start rounded-full border border-gray-300 px-10 py-0 py-2 md:rounded-3xl md:px-4 lg:rounded-full lg:px-6">
              <CalendarDays />
              <div className="ml-2">
                <p className="text-sm text-gray-600">Check in</p>
                {/* <p className="text-base font-bold">{checkInDate}</p> */}
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center justify-start rounded-full border border-gray-300 px-10 py-2 md:rounded-3xl md:px-4 lg:rounded-full lg:px-6">
              <CalendarDays />
              <div className="ml-2">
                <p className="text-sm text-gray-600">Check out</p>
                {/* <p className="font-bold">{checkOutDate}</p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="inline-flex w-full items-center rounded-full border border-gray-300 px-8 py-2 md:rounded-3xl md:px-4 lg:rounded-full lg:px-6">
          <UsersRoundIcon />
          <div className="ml-2">
            <p className="text-sm text-gray-600">Guests</p>
            <p className="font-bold">
              {/* {plural(request.numGuests, "Guest")} */}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4 py-0 text-muted-foreground">
        <div className="-space-y-1 text-black">
          <div className="flex justify-between py-2">
            <p className="font-medium">
              {/* {formatCurrency(offerNightlyPrice)} &times; {numNights}{" "} */}
              nights
            </p>
            <p className="ms-1 font-medium">
              {/* {formatCurrency(offer.totalPrice)} */}
            </p>
          </div>
          <div className="flex justify-between py-2">
            <p className="font-medium">Service fee</p>
            <p className="font-medium">
              {/* {formatCurrency(tramonaServiceFee)} */}
            </p>
          </div>
          <hr className="h-px bg-gray-300 py-0" />
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">Total</p>
          <p className="text-xs text-gray-500">taxes not included.</p>
        </div>
        <p className="font-bold">
          {/* {formatCurrency(offer.totalPrice + tramonaServiceFee + tax)} */}
        </p>
      </div>

      <Form {...form}>
        <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* <LPDateRangePicker
            control={form.control}
            name={`data.date`}
            formLabel="Check in/Check out"
            className="col-span-full lg:col-span-3"
          /> */}
          <Input />
        </form>
      </Form>
    </Card>
  );
}
