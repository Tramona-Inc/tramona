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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { api } from "@/utils/api";
import { ALL_CHECKOUT_TYPES, Property } from "@/server/db/schema";
import DialogCancelSave from "./DialogCancelSave";

const formSchema = z.object({
  checkOutInfo: z.array(z.enum(ALL_CHECKOUT_TYPES)).optional(),
  additionalCheckOutInfo: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CheckOutDialog({ property }: { property: Property }) {
  const { data: fetchedProperty, refetch } = api.properties.getById.useQuery({
    id: property.id,
  });
  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkOutInfo: fetchedProperty?.checkOutInfo ?? [],
      additionalCheckOutInfo: fetchedProperty?.additionalCheckOutInfo ?? "",
    },
  });

  const onSubmit = async (formValues: FormSchema) => {
    await updateProperty({
      ...property,
      checkOutInfo: formValues.checkOutInfo,
      additionalCheckOutInfo:
        formValues.additionalCheckOutInfo === ""
          ? null
          : formValues.additionalCheckOutInfo,
    });
    void refetch();
  };

  const instructions = [
    {
      id: "0",
      description: "Gather used towels",
    },
    {
      id: "1",
      description: "Throw trash away",
    },
    {
      id: "2",
      description: "Turn things off",
    },
    {
      id: "3",
      description: "Lock up",
    },
    {
      id: "4",
      description: "Return keys",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Check out instructions</h1>
        <p className="text-muted-foreground">
          What should travelers do before they check out?
        </p>
      </div>
      <Form {...form}>
        <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="checkOutInfo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    {instructions.map((instruction, index) => (
                      <div className="flex items-center gap-x-2" key={index}>
                        <Checkbox
                          id={instruction.id}
                          checked={field.value?.includes(
                            instruction.description,
                          )}
                          onCheckedChange={(isChecked) => {
                            const newValue = isChecked
                              ? [
                                  ...(field.value ?? []),
                                  instruction.description,
                                ]
                              : (field.value?.filter(
                                  (desc) => desc !== instruction.description,
                                ) ?? []);
                            field.onChange(newValue);
                          }}
                        />
                        <label
                          htmlFor={instruction.id}
                          className="font-semibold"
                        >
                          {instruction.description}
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
            name="additionalCheckOutInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-black">
                  Additional check-out details
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add any additional checkout instructions..."
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-muted-foreground">
            Shared at 9 PM the evening before checkout
          </p>
          <DialogCancelSave />
        </form>
      </Form>
    </div>
  );
}
