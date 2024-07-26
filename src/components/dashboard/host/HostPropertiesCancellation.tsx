import { useState } from "react";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { type Property } from "@/server/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { getCancellationPolicy } from "@/utils/utils";

export default function HostPropertiesCancellation({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(
    property.cancellationPolicy
  );

  const policies = getCancellationPolicy();
  const policyKeys = Object.keys(policies) as (keyof typeof policies)[];

  const formSchema = z.object({
    policy: zodString(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policy: property.cancellationPolicy,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("form submitted");
    console.log("form values:", values.policy);
    // Here you would update the property with the new policy
    property.cancellationPolicy = values.policy;
    setEditing(false);
  };

  const formatText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <span key={index} className="block">
        <span style={{ color: "#000000", fontWeight: "bold" }}>
          {line.split(":")[0]}:
        </span>
        <span style={{ color: "#343434" }}>
          {line.includes(":") && line.split(":")[1]}
        </span>
      </span>
    ));
  };

  return (
    <div className="my-6">
      <div className="text-end">
        <HostPropertyEditBtn
          editing={editing}
          setEditing={setEditing}
          property={property}
          onSubmit={form.handleSubmit(onSubmit)}
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">
          Your Policy:
          {editing ? (
            <Form {...form}>
              <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
              <FormField
                control={form.control}
                name="policy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedPolicy(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please choose your cancellation policy" />
                        </SelectTrigger>
                        <SelectContent>
                          {policyKeys.map((policyKey) => (
                            <SelectItem key={policyKey} value={policyKey}>
                              {policyKey}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          ) : (
            <span> {property.cancellationPolicy}</span>
          )}
        </h2>
        <div className="rounded-xl bg-zinc-100 p-6">
          {selectedPolicy ? (
            <p className="whitespace-pre-line text-left text-sm text-muted-foreground">
              {formatText(getCancellationPolicy(selectedPolicy) as string)}
            </p>
          ) : (
            <div>
              <h3 className="font-bold">1. Cancellation Period:</h3>
              <ul className="ml-10 list-disc">
                <li>
                  Guests must notify us of any cancellation in writing within
                  the designated cancellation period.
                </li>
              </ul>

              <h3 className="mt-4 font-bold">2. Cancellation Fees:</h3>
              <ul className="ml-10 list-disc">
                <li>
                  If cancellation is made <strong>14 days</strong> or more prior
                  to the scheduled arrival date, guests will receive a full
                  refund of the booking deposit.
                </li>
                <li>
                  If cancellation is made within <strong>7 days</strong> of the
                  scheduled arrival date, guests will forfeit the booking
                  deposit.
                </li>
                <li>
                  In the event of a no-show or cancellation on the day of
                  check-in, guests will be charged the full amount of the
                  reservation.
                </li>
              </ul>

              <h3 className="mt-4 font-bold">3. Reservation Modifications:</h3>
              <ul className="ml-10 list-disc">
                <li>
                  Guests may request modifications to their reservation dates,
                  subject to availability. Any changes must be requested in
                  writing and approved by us.
                </li>
              </ul>

              <h3 className="mt-4 font-bold">4. Refunds:</h3>
              <ul className="ml-10 list-disc">
                <li>
                  Refunds, if applicable, will be processed within{" "}
                  <strong>30 business days</strong> from the date of
                  cancellation confirmation.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
