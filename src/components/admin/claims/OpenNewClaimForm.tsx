import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";

// Zod schema to handle validation
const claimSchema = z.object({
  tripId: z.number().min(1, { message: "Trip ID is required" }),
  hostId: z.string().min(1, { message: "Host ID is required" }),
  superhogRequestId: z.number().optional().nullable(),
});

export default function OpenNewClaimForm({
  defaultTripId,
  defaultHostId,
  superhogRequestId,
}: {
  defaultTripId: number;
  defaultHostId: string;
  superhogRequestId?: number;
}) {
  const { mutateAsync: createClaim, isLoading } =
    api.claims.createClaim.useMutation({
      onSuccess: () => {
        toast({
          title: "Successful!",
          description: "Created claim and email sent!",
        });
      },
      onError: (error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: ` id does not exist`,
          description:
            "Double check to see if the host id and trip id is correct",
        });
      },
    });

  // Initialize useForm with Zod validation schema
  const form = useForm({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      tripId: defaultTripId,
      hostId: defaultHostId,
      superhogRequestId: superhogRequestId,
    },
  });

  // Handler for form submission
  const onSubmit = async (data: z.infer<typeof claimSchema>) => {
    // Simulate API call to create a claim
    console.log("Claim created:", data);
    await createClaim(data);
    console.log("SUCCESFUL ");
  };

  return (
    <Form {...form}>
      <Alert className="mt-6" variant="default">
        <AlertTitle className="flex flex-row items-center gap-x-4">
          {" "}
          <TriangleAlertIcon /> Heads up!
        </AlertTitle>
        <AlertDescription className="mt-2 text-muted-foreground">
          This will send an email containing a link for the host to fill out.
        </AlertDescription>
      </Alert>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Trip ID Field */}
        <FormField
          control={form.control}
          name="tripId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trip ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Trip ID" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="superhogRequestId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Superhog Request ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter SuperhogID" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Host ID Field */}
        <FormField
          control={form.control}
          name="hostId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Host ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? "Creating Claim" : "Create Claim"}
        </Button>
      </form>
    </Form>
  );
}
