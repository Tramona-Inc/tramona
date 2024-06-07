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
import {
  getRequestWithGroupDetails,
  type RequestWithGroup,
} from "../RequestGroupAvatars";

const formSchema = z.object({ email: zodEmail() });
type FormValues = z.infer<typeof formSchema>;

export function InviteByEmailForm({ request }: { request: RequestWithGroup }) {
  const mutation = api.groups.inviteUserByEmail.useMutation();
  const { data: inviteLink } = api.groups.generateInviteLink.useQuery({
    groupId: request.madeByGroup.id,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
  });

  const { isEveryoneInvited } = getRequestWithGroupDetails({ request });

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

  const handleCopyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard
        .writeText(inviteLink.link)
        .then(() => {
          toast({
            title: "Link copied to clipboard!",
          });
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  async function onSubmit({ email }: FormValues) {
    await inviteUserByEmail({
      email,
      groupId: request.madeByGroup.id,
    })
      .then(({ status, inviteeName }) => {
        if (status === "sent invite") {
          toast({
            title: `Emailed an invite to ${email}`,
            description: "The invite will expire in 24 hours",
          });
        } else if (status === "added user") {
          toast({
            title: `Successfully added ${inviteeName ?? "member"} to the group`,
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
                <Input
                  {...field}
                  autoFocus
                  placeholder={
                    isEveryoneInvited
                      ? `Invited ${request.numGuests}/${request.numGuests} people`
                      : "Invite by email"
                  }
                  disabled={isEveryoneInvited}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || isEveryoneInvited}
        >
          Invite
        </Button>
      </form>
      {inviteLink && (
        <div className="mt-4 flex gap-2">
          <Input
            value={inviteLink.link}
            readOnly
          />
          <Button onClick={handleCopyToClipboard}>Copy</Button>
        </div>
      )}
    </Form>
  );
}
