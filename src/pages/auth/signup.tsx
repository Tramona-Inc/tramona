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
import { authOptions } from "@/server/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(4),
    confirm: z.string().min(4),
  })
  .required()
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { query } = useRouter();

  const handleSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    await signIn("email", { email: email });
  };

  if (query.error) {
    toast({
      title:
        "Could not login. Please check your e-mail or password or third-party application.",
      variant: "destructive",
    });
  }

  return (
    <>
      <Head>
        <title>Sign up | Tramona</title>
      </Head>
      <div className="flex h-screen flex-col items-center justify-center space-y-10">
        <h1 className="text-5xl font-bold tracking-tight">
          Sign up to start traveling
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
                        <Input
                          {...field}
                          placeholder={"name@domain.com"}
                          autoFocus
                        />
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
                        <Input {...field} type="password" autoFocus />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormMessage />
                <FormField
                  control={form.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verify Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" autoFocus />
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
        </section>
        <div className="flex flex-row items-center gap-1 text-sm">
          <h1>Already have an account? </h1>
          <Button
            variant={"link"}
            onClick={() => signIn()}
            className="-p-1 text-sm font-medium text-blue-600 underline underline-offset-2"
          >
            Log in here.
          </Button>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // * Allows user to redirect back to original page
  const callbackUrl = context.query.callbackUrl ?? "/";

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: callbackUrl } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
