import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { useZodForm } from "@/utils/useZodForm";
import { zodNumber } from "@/utils/zod-utils";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { type Property, type Request } from "@/server/db/schema";
import { formatCurrency, getNumNights } from "@/utils/utils";

export default function AcceptCityRequestDialog({
  open,
  setOpen,
  request,
  property,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  request: Pick<Request, "id" | "checkIn" | "checkOut" | "maxTotalPrice">;
  property: Pick<Property, "id">;
}) {
  const { mutateAsync: createOffer } =
    api.offers.acceptCityRequest.useMutation();

  const form = useZodForm({
    schema: z.object({ price: zodNumber() }),
  });
  const handleSubmit = form.handleSubmit(async ({ price }) => {
    await createOffer({
      totalPrice: price * 100,
      propertyId: property.id,
      requestId: request.id,
    })
      .then(() => {
        toast({
          title: "Successfully sent offer!",
          description:
            "You will receive a notification when the traveller books",
        });
        setOpen(false);
      })
      .catch(() => errorToast());
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make an offer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-base text-foreground">
                    Offer price (nightly)
                  </FormLabel>
                  <FormDescription>
                    Traveller requested{" "}
                    {formatCurrency(
                      request.maxTotalPrice /
                        getNumNights(request.checkIn, request.checkOut),
                    )}
                    /night or under
                  </FormDescription>
                  <div className="h-1"></div>
                  <FormControl>
                    <Input
                      {...field}
                      autoFocus
                      inputMode="decimal"
                      prefix="$"
                      suffix="/night"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button asChild variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Make offer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
