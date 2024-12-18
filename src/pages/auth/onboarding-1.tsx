import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  convertMonthToNumber,
  useUpdateUser,
  validateDateValues,
} from "@/utils/utils";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { ButtonSpinner } from "@/components/ui/button-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { months } from "@/utils/constants";

export default function DateOfBirth() {
  const { data: session } = useSession();
  const router = useRouter();

  const formSchema = z.object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { refetch: refetchVerifications } =
    api.users.getMyVerifications.useQuery(undefined, { enabled: false });

  const { updateUser } = useUpdateUser();

  async function onDobSubmit({ day, month, year }: FormValues) {
    const isDobValid = validateDateValues({
      day: Number(day),
      month: convertMonthToNumber(month),
      year: Number(year),
    });
    if (isDobValid !== "valid") {
      form.setError("root", {
        type: "manual",
        message: isDobValid,
      });
      return;
    }
    if (session?.user.id) {
      await updateUser({
        dateOfBirth: `${convertMonthToNumber(month) + 1}/${day}/${year}`,
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
                <div className="flex items-center gap-4">
                  <FormField
                    name="day"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day</FormLabel>
                        <FormControl>
                          <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="month"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-3/5">
                        <FormLabel>Month</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a month" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="year"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
