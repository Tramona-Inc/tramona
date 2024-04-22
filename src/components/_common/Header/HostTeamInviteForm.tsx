import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import { api } from "@/utils/api";
import { z } from "zod";
import { zodEmail } from "@/utils/zod-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "../../ui/ErrorMsg";
import { toast } from "../../ui/use-toast";

const formSchema = z.object({ email: zodEmail() });
type FormValues = z.infer<typeof formSchema>;

export function HostTeamInviteForm({ hostTeamId }: { hostTeamId: number }) {
  const mutation = api.hostTeams.inviteUserByEmail.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
  });

  async function inviteUserByEmail(
    input: Parameters<typeof mutation.mutate>[0],
  ) {
    return await new Promise<Awaited<ReturnType<typeof mutation.mutateAsync>>>(
      (res, rej) => {
        mutation.mutate(input, {
          onError: (err) => rej(err.message),
          onSuccess: (data) => res(data),
        });
      },
    );
  }

  async function onSubmit({ email }: FormValues) {
    await inviteUserByEmail({ email, hostTeamId })
      .then(({ status, inviteeName }) => {
        if (status === "sent invite") {
          toast({
            title: `Emailed an invite to ${email}`,
            description: "The invite will expire in 24 hours",
          });
        } else if (status === "added user") {
          toast({
            title: `Successfully added ${inviteeName ?? "member"} to the team`,
          });
        }
        form.reset();
      })
      .catch((err: string) => {
        form.setError("email", { message: err });
      });
  }

  return (
    <Form {...form}>
      <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input {...field} autoFocus placeholder="Invite by email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Invite
        </Button>
      </form>
    </Form>
  );
}
