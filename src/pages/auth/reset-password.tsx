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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, { message: "The password must be at least 8 characters long" })
      .max(32, { message: "The password must be a maximum of 32 characters" })
      .refine((value) => /[a-z]/.test(value), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((value) => /\d/.test(value), {
        message: "Password must contain at least one digit",
      })
      .refine((value) => /[!@#$%^&*]/.test(value), {
        message: "Password must contain at least one special character",
      })
      .refine((value) => /\S+$/.test(value), {
        message: "Password must not contain any whitespace characters",
      }),
    verifyPassword: z.string(),
  })
  .required()
  .refine((data) => data.newPassword === data.verifyPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function ResetPassword() {
  const { query } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async ({
    oldPassword,
    newPassword,
    verifyPassword,
  }: z.infer<typeof formSchema>) => {
    // mutate({
    //   oldPassword: oldPassword,
    //   newPassword: newPassword,
    //   verifyPassword: verifyPassword,
    // });
  };

  return (
    // <div>
    //   <h1>Reset Password</h1>
    //   <p>ID: {query.id as string}</p>
    //   <p>String {query.token as string}</p>
    // </div>

    <div className="flex h-screen flex-col items-center justify-center">
      <section className="flex max-w-sm flex-col space-y-5">
        <h1 className="text-4xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p>
          Enter your email address, and we&apos;ll send you a link to get back
          into your account.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input {...field} type={"password"} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type={"password"} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verifyPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify Password</FormLabel>
                  <FormControl>
                    <Input {...field} type={"password"} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage />
            <Button type="submit" className="w-full">
              Reset password
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
