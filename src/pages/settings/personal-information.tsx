import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import Spinner from "@/components/_common/Spinner";
import { Button } from "@/components/ui/button";
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
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function PersonalInformation() {
  const { data: session } = useSession({ required: true });

  if (!session) return <Spinner />;

  return <PersonalInformationForm session={session} />;
}

function PersonalInformationForm({ session }: { session: Session }) {
  const [isEditing, setIsEditing] = useState(false);

  const formSchema = z.object({
    name: zodString(),
    email: zodString(),
    username: zodString(),
    phoneNumber: zodString(),
    dateOfBirth: zodString(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session.user.name ?? "",
      email: session.user.email,
      username: session.user.username ?? "",
      phoneNumber: session.user.phoneNumber ?? "",
      dateOfBirth: session.user.dateOfBirth ?? undefined,
    },
  });

  const { mutateAsync: updateProfile } = api.users.updateProfile.useMutation();

  async function onSubmit(values: FormValues) {
    console.log("got here");
    const res = await updateProfile({ ...values, id: session.user.id });
    setIsEditing(!isEditing);
    console.log(res);
  }

  return (
    <SettingsLayout>
      <div className="mx-auto my-8 max-w-4xl">
        <div className="space-y-4 rounded-lg border bg-white p-4">
          {/* {isEditing ? <p>Edit mode on</p> : <p>Edit mode off</p>} */}
          <Form {...form}>
            <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
            {/* {JSON.stringify(form.formState.errors, null, 2)} */}
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">Personal Information</h1>
              {isEditing ? (
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Save Changes
                  </Button>
                </form>
              ) : (
                <Button type="button" onClick={() => setIsEditing(!isEditing)}>
                  Edit Profile
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoFocus
                      placeholder="Name"
                      disabled={!isEditing}
                    />
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
                    <Input
                      {...field}
                      placeholder="Email"
                      disabled={!isEditing}
                    />
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
                    <Input
                      {...field}
                      placeholder="Username"
                      disabled={!isEditing}
                    />
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
                    <Input
                      {...field}
                      placeholder="Phone number"
                      disabled={!isEditing}
                    />
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
                    <Input
                      {...field}
                      placeholder="Date of Birth"
                      disabled={!isEditing}
                    />
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
