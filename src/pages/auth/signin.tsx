// https://next-auth.js.org/configuration/pages

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
import Icons from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
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

export default function SignIn({
  providers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const utils = api.useUtils();

  const formSchema = z
    .object({
      email: zodEmail(),
      password: z.string(),
    })
    .superRefine(async (credentials, ctx) => {
      const result = await utils.users.checkCredentials.fetch(credentials);
      if (result === "success") return;
      switch (result) {
        case "email not found":
          ctx.addIssue({
            message: "Account not found for this email",
            code: "custom",
            path: ["email"],
          });
          break;
        case "incorrect credentials":
          ctx.addIssue({
            message: "Incorrect credentials, please try again",
            code: "custom",
            path: ["password"],
          });
          break;
        case "incorrect password":
          ctx.addIssue({
            message: "Incorrect password, please try again",
            code: "custom",
            path: ["password"],
          });
          break;
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { query } = useRouter();

  const handleSubmit = async ({
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    // Relies on middleware to redirect to dashbaord
    // onboarding checks if user has a phone number else go to dashboard
    const from = query.from as string | undefined;

    await signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: from ?? `${window.location.origin}/auth/onboarding`,
    }).then(() => {
      
      return null
    });
  };

  useEffect(() => {
    if (query.error) {
      if (query.error === "SessionRequired") {
        toast({ title: "Please log in to continue" });
      } else {
        errorToast("Couldn't log in, please try again");
      }
    }

    if (query.isVerified) {
      toast({
        title: "Account successfully verified!",
        description: "Please re-enter your credentials to log in.",
      });
    }
  }, [query.error, query.isVerified]);

  return (
    <MainLayout>
      <Head>
        <title>Log in | Tramona</title>
      </Head>
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center space-y-10 py-8">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Log in to Tramona
        </h1>

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
                        <Input {...field} autoFocus inputMode="email" />
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
                <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
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
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
