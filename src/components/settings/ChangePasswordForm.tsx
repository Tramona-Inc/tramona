import { zodString } from "@/utils/zod-utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "../ui/ErrorMsg";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";

export default function ChangePasswordForm() {
  const formSchema = z.object({
    oldPassword: zodString(),
    newPassword: zodString(),
    confirmPassword: zodString(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: updatePassword } =
    api.users.updatePassword.useMutation();

  async function onSubmit(values: FormValues) {
    if (values.newPassword !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message: "New passwords do not match",
      });
      return;
    }
    const res = await updatePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    if (res === "incorrect old password") {
      form.setError("oldPassword", { message: "Incorrect password" });
    }
    if (res === "user has no password") {
      form.setError("oldPassword", {
        message: "User has no password",
      });
    }
    if (res === "success") {
      form.reset();
      toast({
        title: "Success!",
        description: "Your password has been updated successfully",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
        {/* {JSON.stringify(form.formState.errors, null, 2)} */}
        <FormField
          name="oldPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
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
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
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
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2 text-end">
          <Button type="submit">Done</Button>
        </div>
      </form>
    </Form>
  );
}
