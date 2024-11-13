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
import ErrorMsg from "@/components/ui/ErrorMsg";
import Icons from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { zodEmail } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FcGoogle } from "react-icons/fc";

const formSchema = z
  .object({
    email: zodEmail(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { mutateAsync: createUser } = api.auth.createUser.useMutation();

  async function handleSubmit(newUser) {
    await createUser(newUser)
      .then(async ({ status }) => {
        if (status === "email taken") {
          form.setError("email", { message: "Email already taken" });
          return;
        }
        await router.push({
          pathname: "/auth/verify-email",
          query: { email: newUser.email },
        });
      })
      .catch(() => errorToast("Couldn't sign up, please try again"));
  }

  return (
    <MainLayout>
      <Head>
        <title>Sign up | Tramona</title>
      </Head>
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center py-8">
        <div className="w-full max-w-lg rounded-lg md:border md:border-gray-300 p-10 md:shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 tracking-tight">
            Create an account
          </h1>
          <p className="text-center text-base text-gray-500 mt-2">
            Sign up to experience the new, best ways to book rentals
          </p>

          <div className="my-6">
            <Button
              onClick={() => signIn("google")}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-3 text-gray-700 shadow-sm tracking-wide"
            >
              <FcGoogle className="h-5 w-5" />
              <span className="font-medium">Continue with Google</span>
            </Button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-xs text-gray-500 tracking-wider">OR CONTINUE WITH EMAIL</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700 font-medium">Password</FormLabel>
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
                    <FormLabel className="text-sm text-gray-700 font-medium">Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
              <Button
                type="submit"
                className="w-full rounded-md text-[#004236] text-white py-3 font-medium"
              >
                Sign Up
              </Button>
            </form>
          </Form>

          <p className="text-center text-xs text-gray-500 mt-4">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>
          </p>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary underline underline-offset-2"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
