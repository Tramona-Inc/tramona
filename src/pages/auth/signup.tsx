import MainLayout from "@/components/_common/Layout/MainLayout";
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
import { authProviders } from "@/config/authProviders";
import { api } from "@/utils/api";
import { useRequireNoAuth } from "@/utils/auth-utils";
import { errorToast } from "@/utils/toasts";
import { zodEmail, zodPassword } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    email: zodEmail(),
    // name: zodString({ minLen: 2 }),
    password: zodPassword(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function SignUp() {
  useRequireNoAuth();

  const router = useRouter();

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
    await createUser(newUser)
      .then(async ({ status }) => {
        if (status === "email taken") {
          form.setError("email", { message: "Email already taken" });
          return;
        }
        await router.push({
          pathname: "/auth/verify-email",
          query: { email: newUser.email },
        });
      })
      .catch(() => errorToast("Couldn't sign up, please try again"));
  }

  // TODO: Refactor later to separted form into its own component

  return (
    <MainLayout>
      <Head>
        <title>Sign up | Tramona</title>
      </Head>
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center space-y-10 py-8">
        <h1 className="text-center text-2xl font-bold tracking-tight">
          Sign up to experience more
        </h1>

        <section className="flex max-w-sm flex-col items-center justify-center space-y-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2 self-stretch"
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
              {/* <FormField
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
              /> */}
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
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </form>
          </Form>

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
            {authProviders.map((provider) => (
              <Button
                key={provider.name}
                variant={"darkOutline"}
                onClick={() => signIn(provider.id)}
                className="grid w-[350px] grid-cols-5 place-content-center gap-5 rounded-3xl"
              >
                <Icons iconName={provider.name} />
                <span className="col-span-3 text-lg font-extrabold tracking-tight">
                  Sign up with {provider.name}
                </span>
              </Button>
            ))}
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
