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
import { toast } from "../../ui/use-toast";
import { useZodForm } from "@/utils/useZodForm";

export function HostTeamInviteForm({ hostTeamId, setIsEditing }: { hostTeamId: number, setIsEditing: (isEditing: boolean) => void }) {
  const { mutateAsync: inviteUserByEmail } =
    api.hostTeams.inviteUserByEmail.useMutation();

  const form = useZodForm({
    schema: z.object({ email: zodEmail() }),
    reValidateMode: "onSubmit",
  });

  const handleSubmit = form.handleSubmit(async ({ email }) => {
    const res = await inviteUserByEmail({ email, hostTeamId });

    switch (res.status) {
      case "sent invite":
        toast({
          title: `Emailed an invite to ${email}`,
          description: "The invite will expire in 24 hours",
        });
        form.reset();
        setIsEditing(false);
        break;
      // case "added user":
      //   toast({
      //     title: `Successfully added ${res.inviteeName ?? "member"} to the team`,
      //   });
      //   form.reset();
      //   break;
      case "already in team":
        form.setError("email", { message: "User is already in the team" });
        break;
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex gap-2">
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
