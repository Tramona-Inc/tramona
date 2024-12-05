import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ALL_TRAVELER_CLAIM_RESPONSES, ClaimItem } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { CheckIcon } from "lucide-react";

const resolutionSchema = z.object({
  claimId: z.string(),
  claimItemId: z.number(),
  travelerClaimResponse: z.enum(ALL_TRAVELER_CLAIM_RESPONSES),
  travelerResponseDescription: z.string().min(1, "Description is required"),
});

type ResolutionFormData = z.infer<typeof resolutionSchema>;

function RespondToClaimForm({ claimItem }: { claimItem: ClaimItem }) {
  const { mutateAsync: submitClaimItem } =
    api.claims.travelerCounterClaim.useMutation();

  const isPending = claimItem.travelerClaimResponse === "Pending";
  const submittedDescription = claimItem.travelerResponseDescription;

  const form = useForm<ResolutionFormData>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      claimId: claimItem.claimId,
      claimItemId: claimItem.id,
      travelerClaimResponse: "Accepted",
      travelerResponseDescription: "",
    },
  });

  const onSubmit = async (values: ResolutionFormData) => {
    console.log(values);
    await submitClaimItem(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-6 space-y-4">
        <FormField
          control={form.control}
          name="travelerClaimResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resolution Result</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!isPending} // Disable if not pending
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resolution result" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Accepted">Approve the damages</SelectItem>
                  <SelectItem value="Rejected">Reject the damages</SelectItem>
                  <SelectItem value="Partially Approved">
                    Partially approve/disapprove
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Please choose whether you approve, reject, or partially approve
                the damages claim:
                <ul className="ml-4 list-disc">
                  <li>
                    <b>Approve:</b> You agree with the claim of damages in full.
                  </li>
                  <li>
                    <b>Reject:</b> You disagree with the claim of damages
                    entirely.
                  </li>
                  <li>
                    <b>Partially Approve:</b> You accept part of the claim but
                    disagree with certain aspects.
                  </li>
                </ul>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="travelerResponseDescription"
          disabled={!isPending}
          render={({ field }) => (
            <FormItem className="cursor-not-allowed">
              <FormLabel>Resolution Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    submittedDescription
                      ? submittedDescription
                      : "Provide details about the resolution"
                  }
                  className={`resize-none ${submittedDescription ? "cursor-not-allowed opacity-65" : ""}`}
                  {...field}
                  disabled={!isPending} // Disable if not pending
                />
              </FormControl>
              <FormDescription>
                Explain the reasons for your decision and any relevant details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!isPending}>
          {" "}
          {!isPending ? (
            <div className="flex flex-row items-center gap-x-2">
              <CheckIcon size={16} />
              Submitted
            </div>
          ) : (
            "Submit Resolution"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default RespondToClaimForm;
