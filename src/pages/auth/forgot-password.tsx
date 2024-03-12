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
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { zodEmail } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: zodEmail(),
});

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const { mutate, isLoading } =
    api.auth.createUniqueForgotPasswordLink.useMutation({
      onSuccess: () => {
        toast({
          title: "Email Sent!",
          description: "Please check your email to reset your password.",
          variant: "default",
        });

        void router.push("/auth/signin");
      },
      onError: (error) => {
        toast({
          title: "Failed to send reset link.",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const handleSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    mutate({ email: email });
  };

  return (
    <div className="flex min-h-screen-minus-header flex-col items-center justify-center">
      <section className="flex max-w-sm flex-col space-y-5">
        <h1 className="text-4xl font-bold tracking-tight">
          Forgot your password?
        </h1>
        <p>
          Enter your email address, and we&apos;ll send you a link to get back
          into your account.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="block">
              Send link
            </Button>
          </form>
        </Form>
        <Link
          href="/support"
          className="font-medium text-primary underline underline-offset-2"
        >
          Need support?
        </Link>
      </section>
    </div>
  );
}
