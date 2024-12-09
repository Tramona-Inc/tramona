import { Textarea } from "@/components/ui/textarea";
import DialogCancelSave from "./DialogCancelSave";
import { Property } from "@/server/db/schema";
import { z } from "zod";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const formSchema = z.object({
  houseManual: z.string().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function HouseManualDialog({
  property,
}: {
  property: Property;
}) {
  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      houseManual: fetchedProperty?.houseManual ?? null,
    },
  });

  const onSubmit = async (formValues: FormSchema) => {
    await updateProperty({
      ...property,
      houseManual:
        formValues.houseManual === "" ? null : formValues.houseManual,
    });
    void refetch();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">House Manual</h1>
        <p className="text-muted-foreground">Add details</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="houseManual"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <h2 className="font-semibold">House manual</h2>
                    <Textarea
                      {...field}
                      placeholder="Add details about your house, including how to use appliances, emergency contacts, and local recommendations..."
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <p className="text-muted-foreground">
            Shared 48 hours before check-in
          </p>
          <DialogCancelSave />
        </form>
      </Form>
    </div>
  );
}
