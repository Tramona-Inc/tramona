import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/utils/api";
import { formatCurrency, getNumNights } from "@/utils/utils";
import { zodInteger } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Spinner from "../_common/Spinner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";

const formSchema = z.object({
  counterPrice: zodInteger(),
});

function CounterForm({
  offerId,
  setOpen,
}: {
  offerId: number;
  setOpen: (open: boolean) => void;
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
          values.counterPrice * getNumNights(data.checkIn, data.checkOut) * 100,
      };

      await mutateAsync(newCounter);
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1>Original Offer</h1>
            {data && (
              <p>
                {formatCurrency(
                  data.amount / getNumNights(data.checkIn, data.checkOut),
                )}{" "}
                /night
              </p>
            )}
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

export function PropertyOfferCounterDialog({
  offerId,
  open,
  setOpen,
}: {
  offerId: number;
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Counter Offer</DialogTitle>
        </DialogHeader>
        <CounterForm offerId={offerId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
