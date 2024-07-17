import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/utils/api";
import { Button } from "../ui/button";
import { errorToast } from "@/utils/toasts";
import { useToast } from "@/components/ui/use-toast";
import { formatPhoneNumberWithParentheses } from "@/utils/formatters";

const formSchema = z.object({
  emergencyEmail: z.string().email(),
  emergencyPhone: z.string().min(10),
});

type FormSchema = z.infer<typeof formSchema>;

export default function ContactInfoForm() {
  const { toast } = useToast();

  const { data: emergencyContacts } = api.users.getEmergencyContacts.useQuery();

  const { mutateAsync: addEmergencyContact } =
    api.users.addEmergencyContacts.useMutation({
      onSuccess: () => {
        toast({
          title: "Emergency contact added",
        });
      },
      onError: () => errorToast(),
    });

  const { mutateAsync: deleteEmergencyContact } =
    api.users.deleteEmergencyContact.useMutation({
      onSuccess: () => {
        toast({
          title: "Emergency contact deleted",
          variant: "destructive",
        });
      },
      onError: () => errorToast(),
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormSchema) {
    await addEmergencyContact(data).catch(() => errorToast());
    form.reset();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <p className="text-sm text-muted-foreground">
        We encourage every traveler to have the travel details in case of
        emergencies.
      </p>

      <div className="grid gap-4">
        {emergencyContacts?.map((contact) => (
          <div
            key={contact.id}
            className="flex rounded-lg border border-muted px-4 pb-2 pt-3"
          >
            <div className="flex flex-1 flex-row justify-between">
              <div className="mr-4 flex flex-col">
                <span className="text-xs font-bold">Email:</span>
                <span>{contact.emergencyEmail}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">Phone:</span>
                <span>
                  {formatPhoneNumberWithParentheses(contact.emergencyPhone)}
                </span>
              </div>
            </div>
            <Button
              onClick={() => deleteEmergencyContact({ id: contact.id })}
              variant="link"
              className="ml-4 mt-2 text-destructive"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="flex items-end gap-x-2">
            <FormField
              name="emergencyEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="emergencyPhone"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="greenPrimary"
              disabled={form.formState.isSubmitting}
              className="mb-1"
            >
              Add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
