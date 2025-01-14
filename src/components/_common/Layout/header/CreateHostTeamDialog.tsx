import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { useZodForm } from "@/utils/useZodForm";
import { zodString } from "@/utils/zod-utils";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function CreateHostTeamDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const { data: session } = useSession({ required: true });
  const router = useRouter();

  const { mutateAsync: createHostTeam } =
    api.hostTeams.createHostTeam.useMutation();

  const form = useZodForm({
    schema: z.object({ name: zodString() }),
  });
  const handleSubmit = form.handleSubmit(async ({ name }) => {
    await createHostTeam({ name })
      .then(() => {
        toast({
          title: "Successfully created new host team",
          description: "Add members from the Team tab",
        });
        setOpen(false);
        void router.push("/host/teams");
      })
      .catch(() => errorToast());
  });

  const suggestedTeamName = session
    ? `${session.user.name ?? session.user.email.split("@")[0]}'s team`
    : "";

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      form.setValue("name", suggestedTeamName);
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [form, open, suggestedTeamName]);

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new hosting team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      autoFocus
                      placeholder="Team name"
                      ref={inputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button asChild variant="secondary">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
