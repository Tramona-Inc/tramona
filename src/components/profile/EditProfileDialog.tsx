import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { type DialogState } from "@/utils/dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import PlacesInput from "../_common/PlacesInput";
import { Button } from "../ui/button";
import { ProfileInfoSchema } from "@/server/db/schema";
import React from "react";

type Props = {
  state: DialogState;
  profileInfo: z.infer<typeof ProfileInfoSchema>;
};

const FormSchema = ProfileInfoSchema;

export default function EditProfileDialog({ state, profileInfo }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: profileInfo,
  });

  const { mutate: updateProfileInfo } =
    api.profile.updateProfileInfo.useMutation({
      onSuccess: () => {
        state.setState("closed");
      },
    });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    updateProfileInfo(values);
  }

  return (
    <Dialog
      open={state.state === "open" ? true : false}
      onOpenChange={(open) => !open && state.setState("closed")}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>{<Input {...field} />}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="about"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <PlacesInput
                name="location"
                control={form.control}
                formLabel="Location"
                className="col-span-full sm:col-span-1"
              />

              <FormField
                name="facebook_link"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Link</FormLabel>
                    <FormControl>{<Input {...field} />}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="youtube_link"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Link</FormLabel>
                    <FormControl>{<Input {...field} />}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="instagram_link"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Link</FormLabel>
                    <FormControl>{<Input {...field} />}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="twitter_link"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Link</FormLabel>
                    <FormControl>{<Input {...field} />}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
