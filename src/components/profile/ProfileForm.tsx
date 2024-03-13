import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { zodEmail, zodString } from "@/utils/zod-utils";
import { api } from "@/utils/api";

const formSchema = z.object({
  name: zodString(),
  email: zodEmail(),
  phoneNumber: zodString({ maxLen: 20 }),
});

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const { toast } = useToast();

  const { mutate, isLoading } = api.users.updateProfile.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Profile updated sucessfully!",
        variant: "default",
      });

      // Update the session object with response data
      void update((prev: typeof session) => ({ ...prev, user: res }));
    },
    onError: (error) => {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${user?.name}`,
      email: `${user?.email}`,
      phoneNumber: `${user?.phoneNumber}`,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form
        className="grid w-full grid-cols-1 gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input inputMode="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          isLoading={isLoading}
          size="lg"
          type="submit"
          className="lg:col-span-2"
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
}
