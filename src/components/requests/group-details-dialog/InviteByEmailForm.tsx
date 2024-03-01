import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import { type RequestWithUser, type DetailedRequest } from "../RequestCard";
import { api } from "@/utils/api";
import { z } from "zod";
import { zodEmail } from "@/utils/zod-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "../../ui/ErrorMsg";
import { toast } from "../../ui/use-toast";
import React from "react";

export function InviteByEmailForm({
  request,
}: {
  request: DetailedRequest | RequestWithUser;
}) {
  const mutation = api.groups.inviteUserByEmail.useMutation();

  const formSchema = z.object({ email: zodEmail() });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
  });
  const utils = api.useUtils();

  const isEveryoneInvited = request.groupMembers.length >= request.numGuests;

  async function inviteUserByEmail(
    input: Parameters<typeof mutation.mutate>[0],
  ) {
    return await new Promise<Awaited<ReturnType<typeof mutation.mutateAsync>>>(
      (res, rej) => {
        mutation.mutate(input, {
          onError: (err) => rej(err.message),
          onSuccess: (data) => {
            void utils.invalidate().then(() => res(data));
          },
        });
      },
    );
  }

  async function onSubmit({ email }: FormValues) {
    await inviteUserByEmail({
      email,
      groupId: request.madeByGroupId,
    })
      .then(({ inviteeName }) => {
        toast({
          title: `Successfully added ${inviteeName ?? "member"} to the group`,
        }),
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
    </Form>
  );
}
