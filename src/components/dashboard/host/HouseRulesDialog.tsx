import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import DialogCancelSave from "./DialogCancelSave";

const formSchema = z.object({
  houseRules: z.array(z.enum(ALL_HOUSE_RULES)).optional(),
  additionalHouseRules: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function HouseRulesDialog({
  property,
  refetch,
  updateProperty,
  isPropertyUpdating,
}: {
  property: Property | undefined;
  refetch: () => void;
  updateProperty: (property: Property) => Promise<void>;
  isPropertyUpdating: boolean;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      houseRules: property?.houseRules ?? [],
      additionalHouseRules: property?.additionalHouseRules ?? "",
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
    if (property) {
      await updateProperty({
        ...property,
        houseRules: formValues.houseRules ?? null,
        additionalHouseRules:
          formValues.additionalHouseRules === ""
            ? null
            : (formValues.additionalHouseRules ?? null),
      });
      void refetch();
    }
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
          <DialogCancelSave isLoading={isPropertyUpdating} />
        </form>
      </Form>
    </div>
  );
}
