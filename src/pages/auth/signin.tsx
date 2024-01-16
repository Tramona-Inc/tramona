/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// https://next-auth.js.org/configuration/pages

import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/server/auth';
import Link from 'next/link';
import Image from 'next/image';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { Input } from '@/components/ui/input';
import Icons from '@/components/ui/icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layouts/MainLayout';

const formSchema = z
  .object({
    email: z.string().email(),
  })
  .required();

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { query } = useRouter();

  const handleSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    await signIn('email', { email: email });
  };

  if (query.error) {
    toast({
      title: 'Could not login. Please check your e-mail or password or third-party application.',
      variant: 'destructive',
    });
  }

  return (
    <MainLayout pageTitle="Sign in">
      <div className="flex h-screen items-stretch">
        <div className="grid flex-1 place-items-center p-4">
          <div className="w-[20rem] space-y-4">
            <h1 className="text-4xl font-bold tracking-wide">Log in</h1>
            <Link href="/signup" className="text-sm font-medium text-blue-600 underline-offset-2 hover:underline">
              Don&apos;t have an account? Sign up
            </Link>

            <section className="flex flex-col items-center justify-center">
              <div className="w-full space-y-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} autoFocus />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                    <Button type="submit" className="w-full">
                      {/* <Button isLoading={form.formState.isSubmitting} type="submit" className="w-full"> */}
                      Sign in with Email
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="my-5">
                {providers &&
                  Object.values(providers).map(provider => {
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
            src="/assets/images/house.jpg"
            alt=""
            fill
            priority
            className="absolute hidden object-cover lg:block"
          />
        </div>
      </div>
    </MainLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
