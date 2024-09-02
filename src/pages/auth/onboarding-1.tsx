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
import { convertDateFormat } from "@/utils/utils";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ErrorMsg from "@/components/ui/ErrorMsg";

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

  const { mutateAsync: updateProfile } = api.users.updateProfile.useMutation({
    onSuccess: () => {
      void refetchVerifications();
      void router.push("/auth/onboarding-2");
    },
  });

  async function onDobSubmit({ dob }: FormValues) {
    if (session?.user.id && dob) {
      await updateProfile({
        id: session.user.id,
        dateOfBirth: convertDateFormat(dob),
        onboardingStep: 2,
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
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="mt-4 w-full"
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
