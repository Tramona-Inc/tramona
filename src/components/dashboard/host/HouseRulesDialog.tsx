import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ALL_HOUSE_RULES, Property } from "@/server/db/schema";
import { api } from "@/utils/api";

const formSchema = z.object({
  houseRules: z.array(z.enum(ALL_HOUSE_RULES)).optional(),
  additionalHouseRules: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function HouseRulesDialog({ property }: { property: Property }) {
  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });
  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      houseRules: fetchedProperty?.houseRules ?? [],
      additionalHouseRules: fetchedProperty?.additionalHouseRules ?? "",
    },
  });

  const rules = [
    {
      id: "0",
      description: "No smoking",
    },
    {
      id: "1",
      description: "No pets",
    },
    {
      id: "2",
      description: "No parties or events",
    },
    {
      id: "3",
      description: "Quiet hours",
    },
  ];

  const onSubmit = async (formValues: FormSchema) => {
    console.log("formValues", formValues);
    await updateProperty({
      ...property,
      houseRules: formValues.houseRules,
      additionalHouseRules:
        formValues.additionalHouseRules === ""
          ? null
          : formValues.additionalHouseRules,
    });
    void refetch();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">House Rules</h1>
        <p className="text-muted-foreground">
          What are the rules of your property?
        </p>
      </div>
      <Form {...form}>
        <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="houseRules"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    {rules.map((rule, index) => (
                      <div className="flex items-center gap-x-2" key={index}>
                        <Checkbox
                          id={rule.id}
                          checked={field.value?.includes(rule.description)}
                          onCheckedChange={(isChecked) => {
                            const newValue = isChecked
                              ? [...(field.value ?? []), rule.description]
                              : (field.value?.filter(
                                  (desc) => desc !== rule.description,
                                ) ?? []);
                            field.onChange(newValue);
                          }}
                        />
                        <label htmlFor={rule.id} className="font-semibold">
                          {rule.description}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalHouseRules"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-black">
                  Additional rules
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add any additional house rules..."
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-muted-foreground">
            Available throughout the booking process
          </p>
          <div className="flex items-center justify-end">
            <DialogClose>
              <div className="flex items-center justify-end gap-2">
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
