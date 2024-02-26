// https://next-auth.js.org/configuration/pages

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Icons from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRequireNoAuth } from "@/utils/auth-utils";
import { errorToast } from "@/utils/toasts";
import { zodEmail } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type InferGetStaticPropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: zodEmail(),
  password: z.string(),
});

export default function SignIn({
  providers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useRequireNoAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { query } = useRouter();

  const handleSubmit = async ({
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    await signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: query.isNewUser
        ? `${window.location.origin}/auth/welcome`
        : window.location.origin,
    });
  };

  useEffect(() => {
    if (query.error) {
      errorToast("Couldn't log in, please try again");
    }

    if (query.isVerified) {
      toast({
        title: "Account successfully verified!",
        description: "Please re-enter your credentials to log in.",
      });
    }
  }, [query.error, query.isVerified]);

  return (
    <>
      <Head>
        <title>Log in | Tramona</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center space-y-10 py-8">
        <h1 className="text-5xl font-bold tracking-tight">Log in to Tramona</h1>

        <section className="flex flex-col items-center justify-center space-y-5">
          <div className="w-full space-y-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input {...field} autoFocus type="email" />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormMessage />
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  Log In
                </Button>
              </form>
            </Form>
          </div>

          <div className="item-center flex w-full justify-center gap-2">
            <div className="flex flex-1 items-center justify-center">
              <div className="h-[1px] w-full border border-black" />
            </div>
            <p>or</p>
            <div className="flex flex-1 items-center justify-center">
              <div className="h-[1px] w-full border border-black" />
            </div>
          </div>

          <div className="my-5 flex w-full flex-col gap-5">
            {providers &&
              Object.values(providers)
                .slice(1) // remove the email provider
                .map((provider) => {
                  return (
                    <Button
                      key={provider.name}
                      variant={"darkOutline"}
                      onClick={() => signIn(provider.id)}
                      className="grid w-[350px] grid-cols-5 place-content-center gap-5 rounded-3xl"
                    >
                      <Icons iconName={provider.name} />
                      <span className="col-span-3 text-lg font-extrabold tracking-tight">
                        Log in with
                        {" " + provider.name}
                      </span>
                    </Button>
                  );
                })}
          </div>

          <Link
            href="/auth/forgot-password"
            className="font-medium text-primary underline underline-offset-2"
          >
            Forgot your password?
          </Link>

          <div className="flex w-full flex-1 items-center justify-center">
            <div className="h-[1px] w-full border border-black" />
          </div>
        </section>

        <p>
          Don&apos; have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
