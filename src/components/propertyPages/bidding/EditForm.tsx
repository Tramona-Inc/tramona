import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import { errorToast } from "@/utils/toasts";
import { zodNumber } from "@/utils/zod-utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DateRangePicker from "../../_common/DateRangePicker";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import { Input } from "../../ui/input";
import { toast } from "../../ui/use-toast";

const formSchema = z.object({
  date: z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  }),
  price: zodNumber(),
  guests: zodNumber(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditForm({
  offerId,
  propertyId,
  originalNightlyBiddingOffer,
  checkIn,
  checkOut,
  guests,
  onOpenChange,
}: {
  offerId: number;
  propertyId: number;
  checkIn: Date;
  checkOut: Date;
  originalNightlyBiddingOffer: number;
  guests: number;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: {
        from: checkIn,
        to: checkOut,
      },
      price: originalNightlyBiddingOffer / 100,
      guests: guests,
    },
  });

  const { mutateAsync } = api.biddings.edit.useMutation({
    onSuccess: () => {
      toast({ title: "Offer successfully updated" });
      onOpenChange(false);
    },
    onError: () => {
      errorToast();
    },
  });

  async function onSubmit(values: FormSchema) {
    const insertValues = {
      offerId,
      nightlyPrice: values.price,
      guests: values.guests,
      date: values.date,
    };

    await mutateAsync(insertValues);
  }

  const propertyIdBids = useBidding((state) => state.propertyIdBids);
  const alreadyBid = propertyIdBids.includes(propertyId);

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
                    propertyId={propertyId}
                    className="col-span-full sm:col-span-1"
                    disablePast
                    alreadyBid={alreadyBid}
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
                  <Input
                    {...field}
                    inputMode="decimal"
                    prefix="$"
                    suffix="/night"
                  />
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
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update</Button>
        </form>
      </Form>
    </div>
  );
}
