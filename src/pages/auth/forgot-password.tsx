import MainLayout from "@/components/_common/Layout/MainLayout";
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
    <MainLayout>
      <div className="min-h-screen-minus-header flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md rounded-lg p-8 md:border md:border-gray-300 md:shadow-lg">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-gray-800">
            Forgot your password?
          </h1>
          <p className="mt-2 text-center text-base text-gray-500">
            Enter your email address, and we&apos;ll send you a link to get back
            into your account.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-6 flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="name@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-[#004236] py-3 font-medium text-white"
              >
                Send link
              </Button>
            </form>
          </Form>

          <Link
            href="/support"
            className="mt-6 block text-center text-sm font-medium text-primary underline underline-offset-2"
          >
            Need support?
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
