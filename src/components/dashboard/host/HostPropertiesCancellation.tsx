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
import { api } from "@/utils/api";


export default function HostPropertiesCancellation({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(
    property.cancellationPolicy
  );

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

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

  const onSubmit = async (values: FormValues) => {
    console.log("form submitted");
    console.log("form values:", values.policy);
    // Here you would update the property with the new policy
    property.cancellationPolicy = values.policy;
    const newProperty = { ...property, cancellationPolicy: values.policy };
    await updateProperty(newProperty);
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
            <p className="text-left text-sm text-muted-foreground">
            Please select a policy.
          </p>
          )}
        </div>
      </div>
    </div>
  );
}
