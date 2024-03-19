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
import { zodPassword } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    newPassword: zodPassword(),
    verifyPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.verifyPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function ResetPassword() {
  const { query } = useRouter();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: verifyTokenMutateAsync } =
    api.auth.verifyResetPasswordToken.useMutation({
      onSuccess: () => {
        return null;
      },
      onError: (error) => {
        toast({
          title: error.message,
          description: "Please request a new reset password link!",
          variant: "destructive",
        });

        void router.push("/auth/forgot-password");
      },
    });

  useEffect(() => {
    const verifyResetPasswordToken = async () => {
      if (query.id && query.token) {
        try {
          await verifyTokenMutateAsync({
            id: query.id as string,
            token: query.token as string,
          });
        } catch (error) {
          return error;
        }
      } else {
        toast({
          title: "Id or token is undefined",
          description: "Not able to reset your password",
          variant: "destructive",
        });
      }
    };

    void verifyResetPasswordToken();
  }, [query.id, query.token, verifyTokenMutateAsync]);

  // Verify new password
  const {
    mutateAsync: resetPasswordMutateAsync,
    isLoading: isLoadingResetPassword,
  } = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Successfully updated password.",
        description: "Please login with your new password!",
        variant: "default",
      });

      void router.push("/auth/signin");
    },
    onError: (error) => {
      toast({
        title: "Failed to reset password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async ({ newPassword }: z.infer<typeof formSchema>) => {
    try {
      await resetPasswordMutateAsync({
        id: query.id as string,
        token: query.token as string,
        newPassword: newPassword,
      });
    } catch (error) {
      return null;
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center">
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
                      <Input {...field} type={"password"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormMessage />
              <Button
                type="submit"
                disabled={isLoadingResetPassword}
                className="w-full"
              >
                Reset password
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </MainLayout>
  );
}
