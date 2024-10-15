import MainLayout from "@/components/_common/Layout/MainLayout";
import { Icons } from "@/components/_icons/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ErrorMsg from "@/components/ui/ErrorMsg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { useUpdateUser } from "@/utils/utils";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function FirstAndLastName() {
  const router = useRouter();
  const { data: session } = useSession();

  const formSchema = z.object({
    firstName: zodString(),
    lastName: zodString(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { refetch: refetchVerifications } =
    api.users.getMyVerifications.useQuery(undefined, { enabled: false });

  const { updateUser } = useUpdateUser();

  async function onSubmit({ firstName, lastName }: FormValues) {
    if (session?.user.id && firstName && lastName) {
      await updateUser({
        firstName: firstName.replace(/[^a-zA-Z\s]/g, ""),
        lastName: lastName.replace(/[^a-zA-Z\s]/g, ""),
        onboardingStep: 3,
      }).then(() => {
        void refetchVerifications();
        void router.push("/auth/onboarding-3");
      });
    }
  }

  return (
    <MainLayout className="flex flex-col justify-center gap-5 p-4">
      <Head>
        <title>First and Last Name | Tramona</title>
      </Head>
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Please enter your government issued first and last name
      </h1>
      <div>
        <Card className="mx-auto max-w-xl">
          <CardContent>
            <Form {...form}>
              <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-x-6"
              >
                <FormField
                  name="firstName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} autoFocus />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lastName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="col-span-2 mt-4"
                >
                  {form.formState.isSubmitting && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
