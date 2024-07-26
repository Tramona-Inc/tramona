import { useState } from "react";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { type Property } from "@/server/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorMsg from "@/components/ui/ErrorMsg";

export default function HostPropertiesCancellation({
  property,
}: {
  property: Property;
}) {
  const [editing, setEditing] = useState(false);

  const formSchema = z.object({
    policy: zodString(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: FormValues) => {
    console.log("form submitted");
    console.log("form values:", values.policy);
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
        <h2 className="text-xl font-bold">Your policy</h2>
        <div className="rounded-xl bg-zinc-100 p-6">
          <Form {...form}>
            <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="policy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        disabled={!editing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please choose your cancellation policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible</SelectItem>
                          <SelectItem value="firm">Firm</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="strict">Strict</SelectItem>
                          <SelectItem value="super-strict-30">
                            Super Strict 30 Days
                          </SelectItem>
                          <SelectItem value="super-strict-60">
                            Super Strict 60 Days
                          </SelectItem>
                          <SelectItem value="long-term">Long Term</SelectItem>
                        </SelectContent>
                      </Select>
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
  );
}
