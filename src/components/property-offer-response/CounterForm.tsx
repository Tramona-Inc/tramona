import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/utils/api";
import { daysBetweenDates, formatCurrency } from "@/utils/utils";
import { zodInteger } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Spinner from "../_common/Spinner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
  counterPrice: zodInteger(),
});

export default function CounterForm({
  offerId,
  setOpen,
  counterNightlyPrice,
}: {
  offerId: number;
  setOpen: (open: boolean) => void;
  counterNightlyPrice: number;
}) {
  const { data: session } = useSession();

  const { data, isLoading } = api.biddings.getBidInfo.useQuery({
    bidId: offerId,
  });

  const { mutateAsync } = api.biddings.createCounter.useMutation({
    onSuccess: () => {
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      counterPrice: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (data && session) {
      const newCounter = {
        bidId: offerId,
        propertyId: data.propertyId,
        userId: session.user.id,
        counterAmount:
          values.counterPrice *
          daysBetweenDates(data.checkIn, data.checkOut) *
          100,
      };

      await mutateAsync(newCounter);
    }
  }

  const originalBidPrice = (data?.amount ?? 0) / daysBetweenDates(data?.checkIn ?? new Date(), data?.checkOut ?? new Date());

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1>Original Offer</h1>
            {data && <p>{counterNightlyPrice !== 0 ? formatCurrency(counterNightlyPrice) : formatCurrency(originalBidPrice)} /night</p>}
            <FormField
              control={form.control}
              name="counterPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Counter Price</FormLabel>
                  <FormControl>
                    <Input {...field} prefix={"$"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Confirm Counter</Button>
          </form>
        </Form>
      )}
    </>
  );
}
