import { Input } from "@/components/ui/input";
import DialogCancelSave from "./DialogCancelSave";
import { Property } from "@/server/db/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

const formSchema = z.object({
  wifiName: z.string().nullable(),
  wifiPassword: z.string().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function WifiDialog({
  property,
  refetch,
  updateProperty,
  isPropertyUpdating,
  currentHostTeamId,
}: {
  property: Property | undefined;
  refetch: () => void;
  updateProperty: ({
    updatedProperty,
    currentHostTeamId,
  }: {
    updatedProperty: Property;
    currentHostTeamId: number;
  }) => Promise<void>;
  isPropertyUpdating: boolean;
  currentHostTeamId: number | null | undefined;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wifiName: property?.wifiName ?? null,
      wifiPassword: property?.wifiPassword ?? null,
    },
  });

  const onSubmit = async (formValues: FormSchema) => {
    if (property) {
      await updateProperty({
        updatedProperty: {
          ...property,
          wifiName: formValues.wifiName === "" ? null : formValues.wifiName,
          wifiPassword:
            formValues.wifiPassword === "" ? null : formValues.wifiPassword,
        },
        currentHostTeamId: currentHostTeamId!,
      })
        .then(() => {
          toast({
            title: "Successfully Updated Property!",
          });
        })
        .catch((error) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (error.data?.code === "FORBIDDEN") {
            toast({
              title: "You do not have permission to edit a property.",
              description: "Please contact your team owner to request access.",
            });
          } else {
            errorToast();
          }
        });
      void refetch();
    }
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
            <p>Shared 48 hours before check-in</p>
          </div>
          <DialogCancelSave isLoading={isPropertyUpdating} />
        </form>
      </Form>
    </div>
  );
}
