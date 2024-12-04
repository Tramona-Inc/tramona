import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import ErrorMsg from "@/components/ui/ErrorMsg";
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
import { useInviteStore } from "@/utils/store/inviteLink";
import { authProviders } from "@/config/authProviders";
import { useCohostInviteStore } from "@/utils/store/cohostInvite";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const utils = api.useUtils();

  const formSchema = z.object({
    email: zodEmail(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const router = useRouter();
  const [inviteLinkId] = useInviteStore((state) => [state.inviteLinkId]);
  const cohostInviteId = useCohostInviteStore((state) => state.cohostInviteId);
  const { mutate: inviteUser } = api.groups.inviteCurUserToGroup.useMutation();

  const handleSubmit = async ({
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    const callbackUrl =
      (router.query.callbackUrl as string) ||
      (router.query.from as string) ||
      `${window.location.origin}`;

    await signIn("credentials", {
      email,
      password,
      callbackUrl,
    }).then(() => {
      if (inviteLinkId) {
        void inviteUser({ inviteLinkId });
      }
      if (cohostInviteId) {
        void router.push(`/cohost-invite/${cohostInviteId}`);
      }
    });
  };

  useEffect(() => {
    if (router.query.error) {
      if (router.query.error === "SessionRequired") {
        toast({ title: "Please log in to continue" });
      } else if (router.query.error === "OAuthCallback") {
        errorToast("Couldn't log in, try using email/password");
      } else {
        errorToast("Couldn't log in, please try again");
      }
    }

    if (router.query.isVerified) {
      toast({
        title: "Account successfully verified!",
        description: "Please re-enter your credentials to log in.",
      });
    }
  }, [router.query.error, router.query.isVerified]);

  return (
    <MainLayout>
      <Head>
        <title>Log in | Tramona</title>
      </Head>
      <div className="min-h-screen-minus-header flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-lg rounded-lg p-10 md:border md:border-gray-300 md:shadow-lg">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-gray-800">
            Log in to Tramona
          </h1>
          <p className="mt-2 text-center text-base text-gray-500">
            Welcome back! Please enter your details
          </p>

          <div className="my-6">
            <Button
              onClick={() => signIn("google")}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-3 tracking-wide text-gray-700 shadow-sm"
            >
              <FcGoogle className="h-5 w-5" />
              <span className="font-medium">Sign in with Google</span>
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Password
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-gray-500 underline hover:text-gray-700"
                      >
                        Forgot your password?
                      </Link>
                    </div>
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
                Log in
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-xs text-gray-500">
            By logging in, you agree to our{" "}
            <Link href="/terms" className="text-primary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>
          </p>

          <p className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
