import { useState } from "react";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { CANCELLATION_POLICIES, type Property } from "@/server/db/schema";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { api } from "@/utils/api";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { useZodForm } from "@/utils/useZodForm";
import CancellationCardSelect from "@/components/_common/CancellationCardSelect";

export default function HostPropertiesCancellation({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const form = useZodForm({
    schema: z.object({
      policy: z.enum(CANCELLATION_POLICIES),
    }),
  });

  const { policy: selectedPolicy } = form.watch();

  const onSubmit = form.handleSubmit(async ({ policy }) => {
    await updateProperty({ id: property.id, cancellationPolicy: policy });
    setEditing(false);
  });

  return (
    <div className="my-6">
      <div className="text-end">
        <HostPropertyEditBtn
          editing={editing}
          setEditing={setEditing}
          property={property}
          onSubmit={onSubmit}
        />
      </div>
      <div>
        {editing ? (
          <Form {...form}>
            <FormField
              control={form.control}
              name="policy"
              render={() => (
                <FormItem>
                  <div className="space-y-4 pt-4">
                    {CANCELLATION_POLICIES.map((policy) => (
                      <CancellationCardSelect
                        key={policy}
                        policy={policy}
                        text={getCancellationPolicyDescription(policy)}
                        onClick={() => form.setValue("policy", policy)}
                        isSelected={selectedPolicy === policy}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </Form>
        ) : (
          <>
            <h2 className="text-sm font-bold uppercase text-muted-foreground">
              Your Policy
            </h2>
            <p className="text-lg font-semibold">
              {property.cancellationPolicy ?? "No policy"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
