/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// https://next-auth.js.org/configuration/pages

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useRequireNoAuth } from "@/utils/auth-utils";
import { zodPassword } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InferGetStaticPropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    email: z.string().email(),
    // username: z.string().max(60),
    name: z.string().max(32),
    password: zodPassword(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function SignIn({
  providers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useRequireNoAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const { mutate, isLoading } = api.auth.createUser.useMutation({
    onSuccess: () => {
      void router.push({
        pathname: "/auth/signin",
        query: { isNewUser: true },
      });

      toast({
        title: "Please verify email first to login!",
        description: "Account was created successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async ({
    email,
    password,
    // username,
    name,
  }: z.infer<typeof formSchema>) => {
    // await signIn("email", { email: email });
    mutate({
      email: email,
      password: password,
      // username: username,
      name: name,
    });
  };

  return (
    <>
      <Head>
        <title>Sign up | Tramona</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center space-y-10 py-8">
        <h1 className="text-center text-5xl font-bold tracking-tight">
          Sign up to start traveling
        </h1>

        <section className="flex max-w-sm flex-col items-center justify-center space-y-5">
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
                {/* <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} type="text"  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
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
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verify Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormMessage />
                <Button type="submit" disabled={isLoading} className="w-full">
                  Sign up
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

          <div className="my-5 flex w-full flex-col items-center justify-center gap-5">
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
                        Sign up with
                        {" " + provider.name}
                      </span>
                    </Button>
                  );
                })}
          </div>
        </section>
        <p>
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Log in
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link
            className="underline underline-offset-2 hover:text-primary"
            href="/tos"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="underline underline-offset-2 hover:text-primary"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          .
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
