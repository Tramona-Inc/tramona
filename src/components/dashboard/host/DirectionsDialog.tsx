import { z } from "zod";
import DialogCancelSave from "./DialogCancelSave";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { Property } from "@/server/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

const formSchema = z.object({
  directions: z.string().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function DirectionsDialog({
  property,
  currentHostTeamId,
}: {
  property: Property;
  currentHostTeamId: number | null | undefined;
}) {
  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      directions: fetchedProperty?.directions ?? null,
    },
  });

  const onSubmit = async (formValues: FormSchema) => {
    await updateProperty({
      updatedProperty: {
        ...property,
        directions: formValues.directions === "" ? null : formValues.directions,
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
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Directions</h1>
        <p className="text-muted-foreground">Add details</p>
      </div>
      <div>
        <Form {...form}>
          <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="directions"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-black">
                    Directions to property
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Provide detailed directions to help guests find your property..."
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-muted-foreground">
              Available throughout the booking process
            </p>
            <DialogCancelSave />
          </form>
        </Form>
      </div>
    </div>
  );
}
