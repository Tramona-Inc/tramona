import MainLayout from "@/components/_common/Layout/MainLayout";
import { Icons } from "@/components/_icons/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { convertDateFormat, useUpdateUser } from "@/utils/utils";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { ButtonSpinner } from "@/components/ui/button-spinner";

export default function DateOfBirth() {
  const { data: session } = useSession();
  const router = useRouter();

  const formSchema = z.object({
    dob: z.string(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { dob: "" },
  });

  const { refetch: refetchVerifications } =
    api.users.getMyVerifications.useQuery(undefined, { enabled: false });

  const { updateUser } = useUpdateUser();

  async function onDobSubmit({ dob }: FormValues) {
    if (new Date(dob) > new Date() || new Date(dob) < new Date("1900-01-01")) {
      form.setError("root", {
        type: "manual",
        message: "Please enter a valid date of birth.",
      });
      return;
    }
    if (session?.user.id) {
      await updateUser({
        dateOfBirth: convertDateFormat(dob),
        onboardingStep: 2,
      }).then(() => {
        void refetchVerifications();
        void router.push("/auth/onboarding-2");
      });
    } else {
      form.setError("root", {
        type: "manual",
        message: "Please enter your date of birth.",
      });
    }
  }

  return (
    <MainLayout className="flex flex-col justify-center gap-5 p-4">
      <Head>
        <title>Date of Birth | Tramona</title>
      </Head>

      <h1 className="text-center text-4xl font-bold tracking-tight">
        Please enter your date of birth
      </h1>
      <div>
        <Card className="mx-auto max-w-md">
          <CardContent>
            <Form {...form}>
              <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
              <form onSubmit={form.handleSubmit(onDobSubmit)}>
                <FormField
                  name="dob"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="date" autoFocus />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-4 w-full">
                  <ButtonSpinner />
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
