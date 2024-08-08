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
        <DialogHeader className="border-b-2 pb-4">
          <DialogTitle>
            <h2 className="text-center">Edit Profile</h2>
          </DialogTitle>
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
                // @ts-expect-error TODO !!!
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

              <div className="h-1"></div>

              <DialogFooter className="border-t-2 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-teal-800/90 text-base hover:bg-teal-800"
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
