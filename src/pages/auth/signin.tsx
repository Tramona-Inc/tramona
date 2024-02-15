/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { zodResolver } from "@hookform/resolvers/zod";
import { type InferGetStaticPropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

export default function SignIn({
  providers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useRequireNoAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { query } = useRouter();

  const [toastDisplayed, setToastDisplayed] = useState(false);

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

  if (query.error && !toastDisplayed) {
    toast({
      title:
        "Could not login. Please check your e-mail or password or third-party application.",
      variant: "destructive",
    });

    setToastDisplayed(true); // Set the state to true after displaying the toast
  }

  if (query.isVerified && !toastDisplayed) {
    toast({
      title: "Account successfully verified!",
      description: "You are now able to login.",
      variant: "default",
    });

    setToastDisplayed(true); // Set the state to true after displaying the toast
  }

  return (
    <>
      <Head>
        <title>Log in | Tramona</title>
      </Head>
      <div className="flex h-screen flex-col items-center justify-center space-y-10">
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
                        <Input {...field} autoFocus />
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
                <Button type="submit" className="w-full">
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
            className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-300"
          >
            Forgot your password?
          </Link>

          <div className="flex w-full flex-1 items-center justify-center">
            <div className="h-[1px] w-full border border-black" />
          </div>
        </section>

        <div className="inline-flex gap-2">
          Don&apos;t have an account?
          <Link
            href="/auth/signup"
            className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-300"
          >
            Sign up for Tramona
          </Link>
        </div>
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
