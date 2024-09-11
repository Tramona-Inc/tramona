import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { zodInteger } from "@/utils/zod-utils";
const formSchema = z.object({
  tripId: zodInteger({ min: 1 }),
  propertyId: zodInteger({ min: 1 }),
  customerId: z.string(),
  setupIntentId: z.string(),
  amount: zodInteger({ min: 3 }),
  description: z.string(),
});

export default function CreateAdditionalamountForm() {
  const { mutateAsync: amountTraveler, isLoading } =
    api.stripe.chargeForDamagesOrMisc.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripId: 0,
      customerId: "",
      setupIntentId: "",
      amount: 100,
      propertyId: 0,
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const parsedData = {
      ...data,
      tripId:
        typeof data.tripId === "string" ? parseInt(data.tripId) : data.tripId,
      amount:
        typeof data.amount === "string" ? parseInt(data.amount) : data.amount,
      propertyId:
        typeof data.propertyId === "string"
          ? parseInt(data.propertyId)
          : data.propertyId,
    };
    console.log(data);
    await amountTraveler(parsedData);
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            <div className="flex flex-row gap-x-6">
              <FormField
                control={form.control}
                name="tripId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Trip ID </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Trip Id" type="number" />
                    </FormControl>
                    <FormDescription>Enter the trip Id </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Property ID </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Property ID"
                        type="number"
                      />
                    </FormControl>
                    <FormDescription>Enter the Property Id </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Stripe Customer Id</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Stripe Customer Id"
                      />
                    </FormControl>
                    <FormDescription>
                      {" "}
                      Enter the Stripe customer ID{" "}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="setupIntentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setup intent ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="PM ID" />
                    </FormControl>
                    <FormDescription>
                      {" "}
                      Enter the users Setup intent ID id{" "}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to charge</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="$0.00" />
                    </FormControl>
                    <FormDescription>
                      {" "}
                      Enter the Amount to charge the traveler with cents- dont
                      use a decimal{" "}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter Description"
                    />
                  </FormControl>
                  <FormDescription>
                    {" "}
                    Describe the reason for the Charge{" "}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isLoading ? "Processing" : "Charge Traveler"}{" "}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
