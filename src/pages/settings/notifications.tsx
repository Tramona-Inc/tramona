import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  bidNotification: z.enum(["once a day", "once a week"]),
});

export default function Notifications() {
  const guestForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bidNotification: "once a day",
    },
  });

  const guestOnSubmit = guestForm.handleSubmit((data) => {
    console.log(data);
  });

  const hostForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bidNotification: "once a day",
    },
  });

  const hostOnSubmit = hostForm.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <SettingsLayout>
      <div className="mx-auto max-w-4xl xl:my-8">
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <Link href="/settings" className="inline-block sm:hidden">
            <ChevronLeft />
          </Link>
          <h1 className="text-lg font-bold">Notifications</h1>
          <div className="flex w-full items-center gap-2">
            <Tabs defaultValue="host" className="flex flex-col gap-y-6">
              <TabsList>
                <TabsTrigger value="host">Host</TabsTrigger>
                <TabsTrigger value="guest">Guest</TabsTrigger>
              </TabsList>
              <TabsContent value="host">
                <Form {...hostForm}>
                  <form onSubmit={hostOnSubmit}>
                    <div className="flex flex-col items-center gap-y-3">
                      <p>
                        Receive notification for traveler putting bid on your
                        property
                      </p>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a notification type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="host">Host</SelectItem>
                          <SelectItem value="guest">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="guest">
                <Form {...guestForm}>
                  <form
                    onSubmit={guestOnSubmit}
                    className="flex flex-row gap-x-4 pb-10"
                  >
                    <FormField
                      control={guestForm.control}
                      name="bidNotification"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Bid Acceptance Notification</FormLabel>
                          <FormControl>
                            <Select {...field}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a notification type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="once a day">
                                  Once a day
                                </SelectItem>
                                <SelectItem value="once a week">
                                  Once a week
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Save</Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
