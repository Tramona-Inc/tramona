import React from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { api } from "@/utils/api";
import ResolvedClaimDetails from "@/components/my-trips/billing/travelerClaims/ResolvedClaimDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RouterOutputs } from "@/utils/api";

type ClaimDetails = RouterOutputs["claims"]["getClaimWithAllDetailsById"];
const resolutionSchema = z.object({
  resolutionResult: z.enum(["Accepted", "Rejected", "Partially Approved"]),
  resolutionDescription: z.string().min(1, "Description is required"),
});

type ResolutionFormData = z.infer<typeof resolutionSchema>;

const onSubmit = async (values: ResolutionFormData) => {
  console.log(values);
};

function RespondToClaim({ claimDetails }: { claimDetails: ClaimDetails }) {
  const form = useForm<ResolutionFormData>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      resolutionResult: "Accepted",
      resolutionDescription: "",
    },
  });
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Claim Information</CardTitle>
        </CardHeader>
        <CardContent>{/* Display claim information here */}</CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Claim Items</CardTitle>
        </CardHeader>
        <CardContent>{/* Display claim items here */}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resolve Claim</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="resolutionResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution Result</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a resolution result" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Partially Approved">
                          Partially Approved
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolutionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about the resolution"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain the reasons for your decision and any relevant
                      details.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit Resolution</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default RespondToClaim;
