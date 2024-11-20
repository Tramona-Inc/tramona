import { Input } from "@/components/ui/input";
import DialogCancelSave from "./DialogCancelSave";
import { Property } from "@/server/db/schema";
import { z } from "zod";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const formSchema = z.object({
  wifiName: z.string().nullable(),
  wifiPassword: z.string().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function WifiDialog({ property }: { property: Property }) {
  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wifiName: fetchedProperty?.wifiName ?? null,
      wifiPassword: fetchedProperty?.wifiPassword ?? null,
    },
  });

  const onSubmit = async (formValues: FormSchema) => {
    await updateProperty({
      ...property,
      wifiName: formValues.wifiName === "" ? null : formValues.wifiName,
      wifiPassword:
        formValues.wifiPassword === "" ? null : formValues.wifiPassword,
    });
    void refetch();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Wifi Details</h1>
        <p className="text-muted-foreground">Add details</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="wifiName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <h2 className="font-semibold">Wifi network name</h2>
                    <Input
                      {...field}
                      placeholder="Enter WiFi network name"
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="wifiPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <h2 className="font-semibold">Wifi password</h2>
                    <Input
                      {...field}
                      placeholder="Enter WiFi password"
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="space-y-4 text-muted-foreground">
            <p>Shared 24-48 hours before check-in</p>
          </div>
          <DialogCancelSave />
        </form>
      </Form>
    </div>
  );
}
