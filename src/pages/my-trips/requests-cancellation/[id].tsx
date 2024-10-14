import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  message: z.string().min(2, {
    message: "Please add a message",
  }),
});

export default function TripDetailsPage() {
  const router = useRouter();
  const tripId = parseInt(router.query.id as string);
  const session = useSession();
  const { data: trip } = api.trips.getMyTripsPageDetails.useQuery(
    {
      tripId: tripId,
    },
    {
      enabled: router.isReady,
    },
  );
  const slackMutation = api.twilio.sendSlack.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await slackMutation.mutateAsync({
      isProductionOnly: false,
      message: [
        `*${session.data?.user.email} requested a trip refund`,
        `for ${tripId} with the message of`,
        `*${data.message}*`,
      ].join("\n"),
    });
    console.log(data);
  }

  return (
    <DashboardLayout>
      <Head>
        <title>My Trips | Tramona</title>
      </Head>

      <Card className="h-screen">
        <CardHeader>
          {" "}
          <h1 className="text-center text-3xl font-bold">
            Request Cancellation
          </h1>
        </CardHeader>
        <CardContent>
          {trip ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto flex w-1/2 flex-col gap-y-4"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide as much detail as possible so we can process your request quickly."
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mx-auto w-2/3">
                  {" "}
                  Request Cancellation{" "}
                </Button>
              </form>
            </Form>
          ) : (
            <Spinner />
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
