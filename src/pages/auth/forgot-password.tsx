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
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center py-8">
        <div className="w-full max-w-md rounded-lg md:border md:border-gray-300 p-8 md:shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-center text-base text-gray-500 mt-2">
            Enter your email address, and we'll send you a link to get back into your account.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6 mt-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700 font-medium">Email address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="name@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full rounded-md bg-[#004236] text-white py-3 font-medium">
                Send link
              </Button>
            </form>
          </Form>

          <Link
            href="/support"
            className="text-center text-sm font-medium text-primary underline underline-offset-2 mt-6 block"
          >
            Need support?
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
