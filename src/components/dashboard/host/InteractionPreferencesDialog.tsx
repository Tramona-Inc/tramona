import { cn } from "@/utils/utils";
import { useState } from "react";
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
import { api } from "@/utils/api";
import { Property } from "@/server/db/schema";

const formSchema = z.object({
  interactionPreference: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

type InteractionPreferences =
  | "not available"
  | "say hello"
  | "socialize"
  | "no preference"
  | null;

export default function InteractionPreferencesDialog({
  property,
}: {
  property: Property;
}) {
  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });
  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  let modifiedInteractionPrefIndex = null;
  switch (fetchedProperty?.interactionPreference) {
    case "not available":
      modifiedInteractionPrefIndex = 0;
      break;
    case "say hello":
      modifiedInteractionPrefIndex = 1;
      break;
    case "socialize":
      modifiedInteractionPrefIndex = 2;
      break;
    case "no preference":
      modifiedInteractionPrefIndex = 3;
      break;
  }

  const [selectedMethodIndex, setSelectedMethodIndex] = useState<number | null>(
    modifiedInteractionPrefIndex,
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interactionPreference: fetchedProperty?.interactionPreference ?? "",
    },
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

  const onSubmit = async (formValues: FormSchema) => {
    console.log("formValues", formValues);
    let modifiedInteractionPref: InteractionPreferences = null;
    switch (formValues.interactionPreference) {
      case "I won't be available in person, and prefer communicating through the app.":
        modifiedInteractionPref = "not available";
        break;
      case "I like to say hello in person, but keep to myself otherwise.":
        modifiedInteractionPref = "say hello";
        break;
      case "I like socializing and spending time with guests.":
        modifiedInteractionPref = "socialize";
        break;
      case "No preferences - I follow my guests' lead.":
        modifiedInteractionPref = "no preference";
        break;
    }
    await updateProperty({
      ...property,
      interactionPreference: modifiedInteractionPref,
    });
    void refetch();
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
                            ? "bg-zinc-200"
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
          <div className="flex items-center justify-end">
            <DialogClose>
              <div className="flex items-center gap-2">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
}
