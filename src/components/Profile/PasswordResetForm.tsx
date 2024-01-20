import { useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodString } from "@/utils/zod-utils";

const formSchema = z
  .object({
    oldPassword: zodString(),
    password: zodString({ minLen: 3 }),
    confirmPassword: zodString({ minLen: 3 }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords didn't match, please try again",
    path: ["confirmPassword"],
  });

export default function PasswordResetForm() {
  const { data: session } = useSession();
  const user = session?.user;

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "The passwords didn't match, please try again",
      });
      return;
    }

    const body = {
      userId: user?.id,
      oldPassword: values.oldPassword,
      newPassword: values.password,
    };

    // const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_BACKEND_URL}/api/users/updatePassword`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(body),
    // });

    // if (!response.ok) {
    //   const error: ErrorResponse = await response.json();

    //   if (error.message) {
    //     toast({
    //       title: 'Error',
    //       description: error.message,
    //     });
    //   }
    // } else {
    //   toast({
    //     title: 'Changes saved',
    //     description: 'Your password has been updated.',
    //   });

    //   form.reset();
    // }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          isLoading={form.formState.isSubmitting}
          size="lg"
          type="submit"
          className="w-full"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
