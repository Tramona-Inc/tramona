import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import Spinner from "@/components/_common/Spinner";
import StripeVerificationCard from "@/components/_common/StripeVerificationCard";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { DialogTitle } from "@radix-ui/react-dialog";
import { ChevronLeft } from "lucide-react";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();
  const isVerified = verificationStatus?.isIdentityVerified === "true";

  const formSchema = z.object({
    name: zodString(),
    email: zodString(),
    username: z
      .union([zodString(), z.literal("").transform(() => null)])
      .nullable(),
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

  const { updateUser } = useUpdateUser();
  const { data } = api.users.getPassword.useQuery();

  const isPasswordNull = data?.password === null;

  async function onSubmit(values: FormValues) {
    await updateUser(values);
    setIsEditing(!isEditing);
  }

  return (
    <SettingsLayout>
      <div className="mx-auto max-w-4xl lg:my-8">
        <div className="space-y-2 rounded-lg border bg-white p-4 lg:space-y-4">
          <Link href="/settings" className="inline-block lg:hidden">
            <ChevronLeft />
          </Link>
          <Form {...form}>
            <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
            {/* {JSON.stringify(form.formState.errors, null, 2)} */}
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">
                {isEditing
                  ? "Edit Personal Information"
                  : "Personal Information"}
              </h1>
              {isEditing ? (
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Button type="submit">Save Changes</Button>
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
                      disabled={!isEditing || isVerified}
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
                  <FormMessage />
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
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                      disabled={!isEditing || isVerified}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
          {!isPasswordNull && (
            <div className="text-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="border-b pb-4 text-center font-bold">
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <ChangePasswordForm />
                </DialogContent>
              </Dialog>
            </div>
          )}
          {verificationStatus?.isIdentityVerified === "false" && (
            <StripeVerificationCard />
          )}
        </div>
      </div>
    </SettingsLayout>
  );
}
