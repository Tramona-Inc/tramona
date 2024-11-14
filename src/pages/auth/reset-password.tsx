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
    path: ["verifyPassword"],
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
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center py-8">
        <div className="w-full max-w-md rounded-lg md:border md:border-gray-300 p-8 md:shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 tracking-tight">
            Reset your password
          </h1>
          <p className="text-center text-base text-gray-500 mt-2">
            Enter your new password below to access your account.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 mt-6"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700 font-medium">New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="New password" />
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
                    <FormLabel className="text-sm text-gray-700 font-medium">Verify Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Verify password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoadingResetPassword}
                className="w-full rounded-md bg-[#004236] text-white py-3 font-medium"
              >
                Reset password
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
}
