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

import { zodString } from "@/utils/zod-utils";
import { api } from "@/utils/api";
import { sleep } from "@/utils/utils";

const formSchema = z.object({
  name: zodString(),
  email: zodString().email(),
});

export default function ProfileForm() {
  const { data: session } = useSession();
  const user = session?.user;

  const { toast } = useToast();

  // const utils = api.useUtils();

  const { mutate, isLoading } = api.users.updateProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile updated sucessfully! (Reloading)",
        variant: "default",
      });

      // Reload the page after 2 sec
      void sleep(2000).then(() => {
        window.location.reload();
      });
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
                <Input type="email" {...field} />
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
