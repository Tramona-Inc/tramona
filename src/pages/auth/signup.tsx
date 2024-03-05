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
import { api } from "@/utils/api";
import { useRequireNoAuth } from "@/utils/auth-utils";
import { errorToast } from "@/utils/toasts";
import { zodEmail, zodPassword, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InferGetStaticPropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    email: zodEmail(),
    // username: z.string().max(60),
    name: zodString({ minLen: 2 }),
    password: zodPassword(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function SignUp({
  providers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useRequireNoAuth();

  const router = useRouter();
  const { query } = useRouter();

  const [isVerifiedHostUrl, setIsVerifiedHostUrl] = useState(false);

  const { mutateAsync: verifyHostTokenAsync } =
    api.auth.verifyHostToken.useMutation({
      onSuccess: () => {
        setIsVerifiedHostUrl(true);
      },
      onError: () => {
        toast({
          description: "Link has expired!",
          title: "Please contact tramona support to received a new host link.",
          variant: "destructive",
        });

        void router.push("/auth/signup");
      },
    });

  useEffect(() => {
    const verifyHostToken = async () => {
      if (query.hostToken) {
        try {
          await verifyHostTokenAsync({
            token: query.hostToken as string,
          });
        } catch (error) {
          return error;
        }
      }
    };

    void verifyHostToken();
  }, [verifyHostTokenAsync, query.hostToken]);

  useEffect(() => {
    if (typeof router.query.code === "string") {
      localStorage.setItem("referralCode", router.query.code);
    }
  }, [router.query.code]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: createUser } = api.auth.createUser.useMutation();

  async function handleSubmit(newUser: FormSchema) {
    type NewUserAsHost = FormSchema & { isVerifiedHostUrl: boolean };

    const newUserWithHostCheck: NewUserAsHost = {
      ...newUser,
      isVerifiedHostUrl: isVerifiedHostUrl,
    };

    await createUser(newUserWithHostCheck)
      .then(() =>
        router.push({
          pathname: "/auth/verify-email",
          query: { email: newUser.email },
        }),
      )
      .catch(() => errorToast("Couldn't sign up, please try again"));
  }

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
                        <Input {...field} autoFocus type="email" />
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
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
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
