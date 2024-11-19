import { cn } from "@/utils/utils";
import { useState } from "react";
import DialogCancelSave from "./DialogCancelSave";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  interactionPreference: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function InteractionPreferencesDialog() {
  const [selectedMethodIndex, setSelectedMethodIndex] = useState<number | null>(
    null,
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const interactions = [
    {
      title:
        "I won't be available in person, and prefer communicating through the app.",
    },
    {
      title: "I like to say hello in person, but keep to myself otherwise.",
    },
    {
      title: "I like socializing and spending time with guests.",
    },
    {
      title: "No preferences - I follow my guests' lead.",
    },
  ];

  const onSubmit = (formValues: FormSchema) => {
    console.log("formValues", formValues);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Interaction preference</h1>
        <p className="text-muted-foreground">Add details</p>
      </div>
      <Form {...form}>
        <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="interactionPreference"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    {interactions.map((interaction, index) => (
                      <div
                        className={cn(
                          selectedMethodIndex === index
                            ? "bg-zinc-100"
                            : "bg-white",
                          "rounded-xl border p-3 hover:cursor-pointer hover:bg-zinc-100",
                        )}
                        key={index}
                        onClick={() => {
                          setSelectedMethodIndex(index);
                          field.onChange(interaction.title);
                        }}
                      >
                        <h2 className="font-semibold">{interaction.title}</h2>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <DialogClose>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
