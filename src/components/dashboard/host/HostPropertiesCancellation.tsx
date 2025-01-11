import { useState } from "react";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { CANCELLATION_POLICIES, type Property } from "@/server/db/schema";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { api } from "@/utils/api";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { useZodForm } from "@/utils/useZodForm";
import CancellationCardSelect from "@/components/_common/CancellationCardSelect";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";

export default function HostPropertiesCancellation({
  property,
}: {
  property: Property;
}) {
  const { currentHostTeamId } = useHostTeamStore();
  const [editing, setEditing] = useState(false);

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();
  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });

  const form = useZodForm({
    schema: z.object({
      policy: z.enum(CANCELLATION_POLICIES),
    }),
  });

  const { policy: selectedPolicy } = form.watch();

  const onSubmit = form.handleSubmit(async ({ policy }) => {
    await updateProperty({
      updatedProperty: { id: property.id, cancellationPolicy: policy },
      currentHostTeamId: currentHostTeamId!,
    });
    setEditing(false);
    void refetch();
  });

  return (
    <div className="my-6 w-full">
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
                  <div className="h-screen-minus-header-n-footer space-y-4 overflow-y-auto pb-16 pt-6">
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
          <div className="my-6">
            <h2 className="text-sm font-bold uppercase text-muted-foreground">
              Your Policy
            </h2>
            <p className="text-lg font-semibold">
              {fetchedProperty?.cancellationPolicy ?? "No policy"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
