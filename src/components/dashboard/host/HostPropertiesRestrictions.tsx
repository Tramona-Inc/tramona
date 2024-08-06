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
import { DollarSignIcon } from "lucide-react";

export default function HostPropertiesRestrictions({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);

  const formSchema = z.object({
    age: zodNumber({ min: 18 }),
    price: zodNumber({ min: 0 }).nullable(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { age: property.ageRestriction ?? undefined },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const onSubmit = async () => {
    const { age, price } = form.getValues();
    const newProperty = { ...property, ageRestriction: Number(age) };
    await updateProperty(newProperty);
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
        <h2 className="text-xl font-bold">Property restrictions</h2>
        <Form {...form}>
          <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 items-center gap-4 rounded-xl bg-zinc-100 p-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <h3 className="text-lg font-semibold">Minimum age to book</h3>
                <p className="text-muted-foreground">
                  Travelers must be at least this old to book the property.
                </p>
              </div>
              <FormField
                name="age"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        disabled={!editing}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <h3 className="text-lg font-semibold">Minimum offer price</h3>
                <p className="text-muted-foreground">
                  You will only see offers equal to or higher than this price.
                </p>
              </div>
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        disabled={!editing}
                        icon={DollarSignIcon}
                        placeholder="Minimum nightly price"
                        suffix="/night"
                        type="number"
                        value={field.value?.toString() ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
