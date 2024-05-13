import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useBidding } from "@/utils/store/bidding";
import { cn, formatCurrency, getNumNights, plural } from "@/utils/utils";
import { zodInteger } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DateRangePicker from "../_common/DateRangePicker";
import MakeBid from "../landing-page/bidding/MakeBid";
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
import { ChevronLeft } from 'lucide-react';

const formSchema = z.object({
  date: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
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
  const [open, setOpen] = useState(false);

  const propertyIdBids = useBidding((state) => state.propertyIdBids);
  const alreadyBid = propertyIdBids.includes(propertyId);
  const [step, setStep] = useState(alreadyBid ? 1 : 0);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const formValues = form.watch();
  const numNights = formValues.date
    ? getNumNights(formValues.date.from, formValues.date.to)
    : 0;
  const totalNightlyPrice = price * numNights;

  async function onSubmit(data: FormSchema) {
    let url: string | null = null;
  }

  return (
    <Card>
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
            className="rounded-full"
            propertyId={propertyId}
          />

          <FormField
            control={form.control}
            name="numGuests"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    className="rounded-full"
                    suffix={"Guests"}
                    placeholder="Guests"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between">
            <p>
              {formatCurrency(price)} &times; {plural(numNights, "night")}
            </p>
            <p>{formatCurrency(totalNightlyPrice)}</p>
          </div>

          <Separator />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                type={"submit"}
                className="w-full rounded-xl"
                disabled={!form.formState.isValid}
              >
                Make Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="flex sm:max-w-lg md:max-w-fit md:px-36 md:py-10">
              {step !== 0 && (
                <Button
                  variant={"ghost"}
                  className={cn("absolute left-1 top-0 md:left-4 md:top-4")}
                  onClick={() => {
                    if (step - 1 > -1) {
                      setStep(step - 1);
                    }
                  }}
                >
                  <ChevronLeft />
                </Button>
              )}
              <MakeBid propertyId={propertyId} />
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </Card>
  );
}
