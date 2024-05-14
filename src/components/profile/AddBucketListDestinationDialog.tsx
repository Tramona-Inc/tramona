import { DialogState } from "@/utils/dialog"
import {
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Form } from "../ui/form";
import PlacesInput from "../_common/PlacesInput";
import DateRangePicker from "../_common/DateRangePicker";
import { BucketListDestinationSelectSchema } from "@/server/db/schema";
import { z } from "zod";
import { zodString } from "@/utils/zod-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { api } from "@/utils/api";

type Props = {
  state: DialogState;
}

const FormSchema = z.object({
  location: zodString(),
  dates: z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
}).refine((data) => data.dates.to > data.dates.from, {
  message: "Must stay for at least 1 night",
  path: ["dates"],
})

export default function AddBucketListDestinationDialog({
  state
}: Props) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  const { mutate: createDestination } = api.profile.createDestination.useMutation({
    onSuccess: () => {
      state.setState("closed");
      form.reset(undefined);
    }
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    createDestination({
      destination: {
        location: values.location,
        plannedCheckIn: values.dates.from,
        plannedCheckOut: values.dates.to
      }
    })
  }

  return (
    <Dialog open={state.state === "open" ? true : false} onOpenChange={(open) => !open && state.setState("closed")}>
      <DialogContent>
        <DialogHeader className="border-b-2 pb-4">
          <DialogTitle className="text-center font-bold">
            Add to Bucket List
          </DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <PlacesInput
                control={form.control}
                name="location"
                formLabel="Destination"
                className="col-span-full sm:col-span-1"
              />
              <DateRangePicker
                control={form.control}
                name="dates"
                formLabel="Dates"
                className="col-span-full sm:col-span-1"
              />

              <DialogFooter className="border-t-2 pt-4">
                <Button type="submit" className="w-full bg-teal-800/90 hover:bg-teal-800">
                  Add to Bucket List
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
