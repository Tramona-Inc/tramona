import { api } from "@/utils/api";
import { useZodForm } from "@/utils/useZodForm";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { zodUrl } from "@/utils/zod-utils";
import { plural } from "@/utils/utils";
import { Button } from "../ui/button";

export function DeleteImage() {
  const form = useZodForm({
    schema: z.object({
      imageUrl: zodUrl().pipe(
        z.union([
          z.string().refine((s) => !s.includes("_next")),
          z
            .string()
            .refine((s) => s.includes("_next"))
            .transform((s) => new URL(s).searchParams.get("url"))
            .pipe(zodUrl()),
        ]),
      ),
    }),
    reValidateMode: "onSubmit",
  });

  const { mutateAsync: deleteImage } = api.properties.deleteImage.useMutation();

  const onSubmit = form.handleSubmit(async ({ imageUrl }) => {
    await deleteImage(imageUrl)
      .then(({ count }) => {
        if (count === 0) {
          form.setError("imageUrl", {
            message: "No images found with this URL",
          });
          return;
        }

        toast({
          title: `Successfully deleted image from ${plural(count, "listing")}`,
        });
        form.reset();
      })
      .catch(() => errorToast());
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete image</CardTitle>
        <CardDescription>Delete all instances of an image URL</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
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
            <Button type="submit">Delete</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
