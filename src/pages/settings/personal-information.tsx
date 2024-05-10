import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
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
import { zodInteger, zodMMDDYYYY, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: zodString(),
  email: zodString(),
  username: zodString(),
  password: zodString(),
  phoneNumber: zodString(),
  dateOfBirth: zodMMDDYYYY(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function PersonalInformation() {
  const { data: session } = useSession();
  const user = session?.user;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  return (
    <SettingsLayout>
      <div className="mx-auto my-8 max-w-4xl">
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h1 className="text-lg font-bold">Personal Information</h1>
          <Form {...form}>
            <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">Name</FormLabel>
                  <FormControl>
                    <Input value={user?.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input value={user.email} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input value={user?.username} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <Input value={user?.phoneNumber} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">
                    Date of Birth
                  </FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        </div>
      </div>
    </SettingsLayout>
  );
}
