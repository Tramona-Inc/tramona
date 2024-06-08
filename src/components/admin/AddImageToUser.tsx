import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";

import { api } from "@/utils/api";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const formSchema = z.object({
  userId: zodString(),
  imageUrl: zodString(),
});

export function AddImageToUser() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      imageUrl: "",
    },
  });

  const { mutate } = api.users.addImageToUser.useMutation({
    onSuccess: () => {
      toast({
        title: "Successfully updated host image}",
      });
      form.reset();
    },
  });

  const onSubmit = form.handleSubmit(async ({ userId, imageUrl }) => {
    mutate({ userId, imageUrl });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Image to User</CardTitle>
        <CardDescription>Adds a image to a user based of id</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} placeholder="User Id" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} placeholder="Image URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
