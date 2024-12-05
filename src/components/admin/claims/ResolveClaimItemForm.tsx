import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {} from // Card,
// CardContent,
// CardDescription,
// CardFooter,
// CardHeader,
// CardTitle,
"@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Send,
  FileQuestion,
} from "lucide-react";
import { ALL_PAYMENT_SOURCES, ClaimItem } from "@/server/db/schema";
import { ALL_RESOLUTION_RESULTS } from "@/server/db/schema";
import CurrencyInput from "react-currency-input-field";

export const resolveItemFormSchema = z.object({
  claimId: z.string(),
  claimItemId: z.number(),
  resolutionResult: z.enum(ALL_RESOLUTION_RESULTS),
  resolutionDescription: z
    .string()
    .min(1, "Resolution description is required"),
  approvedAmount: z.number().min(0, "Approved amount must be 0 or greater"),
  paymentSource: z.enum(ALL_PAYMENT_SOURCES),
});

interface ResolveClaimItemFormProps {
  claimItem: ClaimItem;
  onSubmit: (values: z.infer<typeof resolveItemFormSchema>) => void;
}

export default function ResolveClaimItemForm({
  claimItem,
  onSubmit,
}: ResolveClaimItemFormProps) {
  const form = useForm<z.infer<typeof resolveItemFormSchema>>({
    resolver: zodResolver(resolveItemFormSchema),
    defaultValues: {
      claimId: claimItem.claimId,
      claimItemId: claimItem.id,
      resolutionResult: "Approved",
      resolutionDescription: "",
      approvedAmount: claimItem.requestedAmount / 100,
      paymentSource: "Security Deposit",
    },
  });

  return (
    <div className="w-full rounded-lg border shadow-sm">
      <div className="border-b p-6">
        {/* <CardTitle className="text-2xl">Resolve Claim Item</CardTitle> */}
        <p className="text-2xl font-bold">
          Resolve Claim Item: {claimItem.itemName}{" "}
        </p>
        <p className="text-sm text-muted-foreground">
          Review and resolve this claim item by providing the necessary
          information.
        </p>
      </div>
      <div className="p-6">
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a resolution result" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALL_RESOLUTION_RESULTS.filter(
                        (result) => result !== "Pending",
                      ).map((result) => (
                        <SelectItem key={result} value={result}>
                          <div className="flex items-center">
                            {result === "Approved" && (
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            )}
                            {result === "Rejected" && (
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            )}
                            {result === "Partially Approved" && (
                              <HelpCircle className="mr-2 h-4 w-4 text-yellow-500" />
                            )}
                            {result === "Insufficient Evidence" && (
                              <FileQuestion className="mr-2 h-4 w-4 text-blue-500" />
                            )}
                            {result}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the appropriate resolution for this claim item.
                  </FormDescription>
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
                      {...field}
                      placeholder="Provide a detailed explanation for the resolution"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Explain the reasoning behind your resolution decision.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="approvedAmount"
              render={(
                {}, //might need to put field later
              ) => (
                <FormItem>
                  <FormLabel>Approved Amount</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="approvedAmount"
                      render={({ field }) => (
                        <CurrencyInput
                          id="approvedAmount"
                          placeholder="0.00"
                          intlConfig={{
                            locale: "en-US",
                            currency: "USD",
                          }}
                          decimalsLimit={2}
                          allowNegativeValue={false}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value ? parseFloat(value) : "");
                          }}
                          className="flex h-10 w-full appearance-none items-center rounded-md border border-input bg-zinc-50 px-3 text-sm text-foreground outline outline-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-black focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" // Replace with your actual input className
                          prefix="$"
                        />
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the approved amount for this claim item (if
                    applicable).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="border-t p-6">
        <Button
          type="submit"
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
        >
          <Send className="mr-2 h-4 w-4" /> Submit Resolution
        </Button>
      </div>
    </div>
  );
}
