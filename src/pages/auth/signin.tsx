/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// https://next-auth.js.org/configuration/pages

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import Icons from "@/components/ui/icons";
import Navbar from "@/components/navbar";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { toast } = useToast();
  const router = useRouter();

  return (
    <>
      <div className="flex h-screen flex-col">
        <Navbar />
        <Head>
          <title>Log in | Tramona</title>
        </Head>
        <main className="flex flex-1">
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
                  {/* <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl> */}
                  <h1>Email</h1>
                  <Input autoFocus />
                  {/* </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  {/* <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl> */}
                  <h1>Password</h1>
                  <Input type="password" />
                  {/* </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                </div>

                <div className="my-5">
                  {Object.values(providers).map((provider) => {
                    return (
                      <div key={provider.name}>
                        <button onClick={() => signIn(provider.id)}>
                          {provider.name && <Icons iconName={provider.name} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
          <div className="relative hidden flex-1 lg:block">
            <Image
              src={"/assets/images/house.jpg"}
              alt={"login house image"}
              objectFit="cover"
              fill
              priority
              className="absolute hidden lg:block"
            />
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
