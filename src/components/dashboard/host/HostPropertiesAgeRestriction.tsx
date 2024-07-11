import { Input } from "@/components/ui/input";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { useState } from "react";
import { type Property } from "@/server/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zodNumber } from "@/utils/zod-utils";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { api } from "@/utils/api";

export default function HostPropertiesAgeRestriction({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);

  const formSchema = z.object({
    age: zodNumber({ min: 18 }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // defaultValues: { age: property.ageRestriction },
  });

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  async function onSubmit({ age }: FormValues) {
    const newProperty = { ...property, ageRestriction: age };
    await updateProperty(newProperty);
  }

  return (
    <div className="my-6">
      <div className="text-end">
        <HostPropertyEditBtn
          editing={editing}
          setEditing={setEditing}
          property={property}
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Property age restriction</h2>
        <div className="grid grid-cols-1 items-center gap-4 rounded-xl bg-zinc-100 p-4 sm:grid-cols-2 sm:gap-6">
          <div>
            <h3 className="text-lg font-semibold">Minimum age to book</h3>
            <p className="text-muted-foreground">
              Travelers must be at least this old to book the property.
            </p>
          </div>
          <div>
            <Form {...form}>
              <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  name="age"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="w-full" autoFocus />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
