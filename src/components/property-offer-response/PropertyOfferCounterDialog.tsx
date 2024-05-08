import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodInteger } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const formSchema = z.object({
  counterPrice: zodInteger(),
});

function CounterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      counterPrice: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="counterPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Counter Price</FormLabel>
              <FormControl>
                <Input {...field} prefix={"$"} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
  return <></>;
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
        <Label>Your counter offer price</Label>
        <Input type="number" />
      </DialogContent>
    </Dialog>
  );
}
