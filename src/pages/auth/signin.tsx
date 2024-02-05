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
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: zodString().email(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const { query } = useRouter();

  const handleSubmit = async ({ email }: FormSchema) => {
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
        <title>Sign in | Tramona</title>
      </Head>
      <div className="flex h-screen items-stretch">
        <div className="grid flex-1 place-items-center p-4">
          <div className="w-[20rem] space-y-4">
            <h1 className="text-4xl font-bold tracking-wide">Log in</h1>
            <Link
              href="/signup"
              className="text-sm font-medium text-blue-600 underline-offset-2 hover:underline"
            >
              Don&apos;t have an account? Sign up
            </Link>

            <section className="flex flex-col items-center justify-center">
              <div className="w-full space-y-5">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-2"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} autoFocus type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                      Sign in with Email
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="my-5 flex flex-row gap-5">
                {providers &&
                  Object.values(providers)
                    .slice(1) // remove the email provider
                    .map((provider) => {
                      return (
                        <div key={provider.name}>
                          <Button
                            variant={"ghost"}
                            onClick={() => signIn(provider.id)}
                          >
                            {provider.name && (
                              <Icons iconName={provider.name} />
                            )}
                          </Button>
                        </div>
                      );
                    })}
              </div>
            </section>
          </div>
        </div>
        <div className="relative hidden flex-1 lg:block">
          <Image
            src="/assets/images/house.jpg"
            alt=""
            fill
            priority
            className="absolute hidden object-cover lg:block"
          />
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
