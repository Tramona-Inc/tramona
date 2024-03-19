import MainLayout from "@/components/_common/Layout/MainLayout";
import HostSignUpForm from "@/components/sign-up/host/HostSignUpForm";
import { Button } from "@/components/ui/button";
import Icons from "@/components/ui/icons";
import { useRequireNoAuth } from "@/utils/auth-utils";
import type { InferGetStaticPropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export default function SignUp({
  providers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useRequireNoAuth();

  return (
    <MainLayout>
      <Head>
        <title>Sign up | Tramona</title>
      </Head>
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center space-y-10 py-8">
        <h1 className="text-center text-5xl font-bold tracking-tight">
          Sign up to message your guest
        </h1>

        <section className="flex max-w-sm flex-col items-center justify-center space-y-5">
          <HostSignUpForm />

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
    </MainLayout>
  );
}

export async function getStaticProps() {
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
