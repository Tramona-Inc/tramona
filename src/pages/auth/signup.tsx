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
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { zodEmail } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

  async function handleSubmit(newUser: z.infer<typeof formSchema>) {
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
        <div className="w-full max-w-lg rounded-lg p-10 md:border md:border-gray-300 md:shadow-lg">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-gray-800">
            Create an account
          </h1>
          <p className="mt-2 text-center text-base text-gray-500">
            Sign up to experience the new, best ways to book rentals
          </p>

          <div className="my-6">
            <Button
              onClick={() => signIn("google")}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-3 tracking-wide text-gray-700 shadow-sm"
            >
              <FcGoogle className="h-5 w-5" />
              <span className="font-medium">Continue with Google</span>
            </Button>
          </div>

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-xs tracking-wider text-gray-500">
              OR CONTINUE WITH EMAIL
            </span>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Confirm password
                    </FormLabel>
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
                className="w-full rounded-md py-3 font-medium text-[#004236] text-white"
              >
                Sign Up
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>
          </p>

          <p className="mt-6 text-center text-sm">
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
