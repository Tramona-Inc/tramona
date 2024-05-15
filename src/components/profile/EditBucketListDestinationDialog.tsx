import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { type BucketListDestination } from "@/server/db/schema";
import { api } from "@/utils/api";
import { type DialogState } from "@/utils/dialog";
import { zodNumber, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DateRangePicker from "../_common/DateRangePicker";
import PlacesInput from "../_common/PlacesInput";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";

type Props = {
  state: DialogState;
  destinationData: BucketListDestination;
};

const FormSchema = z
  .object({
    id: zodNumber(),
    location: zodString(),
    dates: z.object({
      from: z.coerce.date(),
      to: z.coerce.date(),
    }),
  })
  .refine((data) => data.dates.to > data.dates.from, {
    message: "Must stay for at least 1 night",
    path: ["dates"],
  });

export default function EditBucketListDestinationDialog({
  state,
  destinationData,
}: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  React.useEffect(() => {
    {
      if (!destinationData) return;
      form.reset({
        id: destinationData.id,
        location: destinationData.location,
        dates: {
          from: destinationData.plannedCheckIn,
          to: destinationData.plannedCheckOut,
        },
      });
    }
  }, [destinationData]);

  const { mutate: updateDestination } =
    api.profile.updateDestination.useMutation({
      onSuccess: () => {
        state.setState("closed");
      },
    });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    updateDestination({
      destination: {
        id: values.id,
        location: values.location,
        plannedCheckIn: values.dates.from,
        plannedCheckOut: values.dates.to,
      },
    });
  }

  return (
    <Dialog
      open={state.state === "open" ? true : false}
      onOpenChange={(open) => !open && state.setState("closed")}
    >
      <DialogContent>
        <DialogHeader className="border-b-2 pb-4">
          <DialogTitle>
            <h2 className="text-center">Edit Destination</h2>
          </DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <PlacesInput
                name="location"
                control={form.control}
                formLabel="Destination"
                className="col-span-full sm:col-span-1"
              />

              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateRangePicker
                        {...field}
                        label="Dates"
                        className="col-span-full sm:col-span-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="h-1"></div>

              <DialogFooter className="border-t-2 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-teal-800/90 text-base hover:bg-teal-800"
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
