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

export default function CreateHostTeamDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
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
        void router.push("/host/team");
      })
      .catch(() => errorToast());
  });

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
                    <Input {...field} autoFocus placeholder="Team name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button asChild variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
