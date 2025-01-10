import { z } from "zod";
import DialogCancelSave from "./DialogCancelSave";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const formSchema = z.object({
  directions: z.string().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function DirectionsDialog({
  property,
  refetch,
  updateProperty,
  isPropertyUpdating,
}: {
  property: Property | undefined;
  refetch: () => void;
  updateProperty: (property: Property) => Promise<void>;
  isPropertyUpdating: boolean;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      directions: property?.directions ?? null,
    },
  });

  const onSubmit = async (formValues: FormSchema) => {
    if (property) {
      await updateProperty({
        ...property,
        directions: formValues.directions === "" ? null : formValues.directions,
      });
      void refetch();
    }
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
            <DialogCancelSave isLoading={isPropertyUpdating} />
          </form>
        </Form>
      </div>
    </div>
  );
}
