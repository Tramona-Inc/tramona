import { Checkbox } from "@/components/ui/checkbox";
import DialogCancelSave from "./DialogCancelSave";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  checkOutInfo: z.string().array(),
  additionalCheckOutInfo: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CheckOutDialog() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    // defaultValues: {

    // }
  });

  const onSubmit = (formValues: FormSchema) => {
    console.log("formValues", formValues);
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="checkOutInfo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    {instructions.map((instruction, index) => (
                      <div className="flex items-center gap-x-2" key={index}>
                        <Checkbox id={instruction.id} />
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
                  />
                </FormControl>
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
