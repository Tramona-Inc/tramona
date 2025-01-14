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
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

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
  currentHostTeamId,
}: {
  property: Property | undefined;
  refetch: () => void;
  updateProperty: ({
    updatedProperty,
    currentHostTeamId,
  }: {
    updatedProperty: Property;
    currentHostTeamId: number;
  }) => Promise<void>;
  isPropertyUpdating: boolean;
  currentHostTeamId: number | null | undefined;
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
        updatedProperty: {
          ...property,
          houseRules: formValues.houseRules ?? null,
          additionalHouseRules:
            formValues.additionalHouseRules === "" ||
            formValues.additionalHouseRules === undefined
              ? null
              : formValues.additionalHouseRules,
        },
        currentHostTeamId: currentHostTeamId!,
      })
        .then(() => {
          toast({
            title: "Successfully Updated Property!",
          });
        })
        .catch((error) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (error.data?.code === "FORBIDDEN") {
            toast({
              title: "You do not have permission to edit a property.",
              description: "Please contact your team owner to request access.",
            });
          } else {
            errorToast();
          }
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
