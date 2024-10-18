import { type Property } from "@/server/db/schema/tables/properties";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { useState } from "react";
import { api } from "@/utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

export default function HostBookItNow({ property }: { property: Property }) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const updateBookItNowMutation = api.properties.updateBookItNowEnabled.useMutation();

  const formSchema = z.object({
    bookItNowEnabled: z.boolean(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookItNowEnabled: property.bookItNowEnabled,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await updateBookItNowMutation.mutateAsync({
      id: property.id,
      bookItNowEnabled: values.bookItNowEnabled,
    });
    setIsEditing(false);
    toast({
      title: "Setting Updated",
      description: `Book It Now has been ${values.bookItNowEnabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleCancelEdit = () => {
    form.reset({
      bookItNowEnabled: property.bookItNowEnabled,
    });
    setIsEditing(false);
  };

  return (
    <div className="mb-24 mt-6">
      <div className="text-end">
        <HostPropertyEditBtn
          editing={isEditing}
          setEditing={setIsEditing}
          property={property}
          onSubmit={form.handleSubmit(onSubmit)}
          onCancel={form.handleSubmit(handleCancelEdit)}
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Book It Now</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bookItNowEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEditing}
                      className={!isEditing ? "opacity-50" : ""}
                    />
                  </FormControl>
                  <div className={`leading-none ${!isEditing ? "opacity-50" : ""}`}>
                    <p>{field.value ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
