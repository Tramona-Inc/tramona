import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useZodForm } from "@/utils/useZodForm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { zodString } from "@/utils/zod-utils";
import { zodRoomsWithBedsParser } from "@/utils/zodBedsInRooms";

export default function Page() {
  const form = useZodForm({
    schema: z.object({
      bedsInRooms: zodString(),
    }),
  });

  return (
    <div className="px-4 py-32">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const res = zodRoomsWithBedsParser.safeParse(data.bedsInRooms);
            if (!res.success) {
              form.setError("bedsInRooms", {
                message: res.error.issues[0]!.message,
              });
              return;
            }

            toast({
              title: "submitted data:",
              description: JSON.stringify(res.data, null, 2),
            });
          })}
          className="mx-auto max-w-lg space-y-2"
        >
          <FormField
            control={form.control}
            name="bedsInRooms"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Beds in Rooms</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Each line = beds in 1 room, formatted like '1 Queen, 2 Twin'"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Submit</Button>
        </form>
      </Form>
    </div>
  );
}
