import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { useZodForm } from "@/utils/useZodForm";
import { useEffect } from "react";
import { z } from "zod";

export default function EditTeamNameDialog({
  open,
  onOpenChange,
  currentHostTeamId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHostTeamId: number;
}) {
  const updateTeamNameMutation = api.hostTeams.updateTeamName.useMutation();
  const { data: hostTeams } = api.hostTeams.getMyHostTeams.useQuery();
  const curTeam = hostTeams?.find((team) => team.id === currentHostTeamId);

  const form = useZodForm({
    schema: z.object({
      teamName: z.string(),
    }),
    defaultValues: {
      teamName: curTeam?.name,
    },
  });

  useEffect(() => {
    form.reset({
      teamName: curTeam?.name,
    });
  }, [curTeam?.name, currentHostTeamId, form]);

  const handleSubmit = form.handleSubmit(async ({ teamName }) => {
    currentHostTeamId &&
      (await updateTeamNameMutation
        .mutateAsync({
          teamName,
          currentHostTeamId,
        })
        .then(() => onOpenChange(false)));
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team Name</DialogTitle>
          <DialogDescription hidden>Edit your team name here</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-2">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
