import { zodString } from "@/utils/zod-utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ChangePasswordForm() {
  const formSchema = z.object({
    oldPassword: zodString(),
    newPassword: zodString(),
    confirmPassword: zodString(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <FormField
        name="oldPassword"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Old password</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="newPassword"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>New password</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="confirmPassword"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm password</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
