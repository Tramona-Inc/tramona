import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { useBidding } from "@/utils/store/bidding";
import { formatCurrency } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DateRangePicker from "../../_common/DateRangePicker";
import MakeBid from "../../landing-page/bidding/MakeBid";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Form } from "../../ui/form";

const formSchema = z.object({
  date: z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  }),
  // numGuests: zodInteger({ min: 1 }),
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

  const displayUserBid = useBidding((state) => state.displayUserBid);
  const setDisplayUserBid = useBidding((state) => state.setDisplayUserBid);

  useEffect(() => {
    if (displayUserBid) {
      setOpen(true);
      setDisplayUserBid(false);
    }
  }, [displayUserBid, setDisplayUserBid]);

  const propertyIdBids = useBidding((state) => state.propertyIdBids);
  const alreadyBid = propertyIdBids.includes(propertyId);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const resetSession = useBidding((state) => state.resetSession);
  const setDate = useBidding((state) => state.setDate);

  async function onSubmit(values: FormSchema) {
    // Reset session if on new date
    console.log("Called");
    resetSession();
    // setGuest(values.numGuests);
    setDate(values.date.from, values.date.to);
    setOpen(true);
  }

  return (
    <Card>
      <h3 className="font-semibold">Price on Airbnb:</h3>
      <h1 className="flex items-center text-3xl font-semibold">
        {formatCurrency(price * AVG_AIRBNB_MARKUP)}
        <span className="ml-2 py-0 text-sm font-normal text-gray-500">
          per night
        </span>
      </h1>
      {/* <h3 className="font-semibold">
        Price on Airbnb: {formatCurrency(price * AVG_AIRBNB_MARKUP)}
      </h3> */}
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
                <FormControl>
                  <DateRangePicker
                    {...field}
                    disablePast
                    propertyId={propertyId}
                    alreadyBid={alreadyBid}
                    className="col-span-full sm:col-span-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            {/* Removed trigger to have control on open and close */}
            <div>
              {/* {alreadyBid ? (
                <Button
                  type={"submit"}
                  className={"w-full rounded-xl"}
                  disabled={alreadyBid}
                >
                  Already Bid
                </Button>
              ) : ( */}
              <Button
                type={"submit"}
                className={`w-full rounded-xl ${!form.formState.isValid && "bg-black"}`}
                // disabled={!form.formState.isValid}
              >
                Make Offer
              </Button>
              {/* )} */}
            </div>
            <DialogContent className="flex sm:max-w-lg md:max-w-fit md:px-36 md:py-10">
              <MakeBid propertyId={propertyId} setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </Card>
  );
}
