// import ContactIcon from '@/components/icons/contact';
// import EditIcon from '@/components/icons/large-edit-icon';
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Icons from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: zodString(),
  email: zodString().email(),
  message: zodString().max(300, {
    message: "Response must be less than 300 Characters",
  }),
});

function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const { mutateAsync, isLoading } = api.emails.sendSupportEmail.useMutation({
    onSuccess: () => {
      form.resetField("message", { defaultValue: "" });

      toast({
        title: "Message sent successfully",
        description: "We will be in touch shortly",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      errorToast("Couldn't send support email! Please try again.");
    },
  });

  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    void mutateAsync(formData);

    // Reset the message field after successful submission
    form.resetField("message", { defaultValue: "" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea className="h-40" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </Form>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8 p-4 pb-32">
        <h1 className="pt-20 text-3xl font-bold">Get support</h1>
        <section className="space-y-4 rounded-xl border p-4 shadow-md">
          <div className="flex items-center gap-4">
            <Icons iconName={"contact"} />
            <h2 className="text-xl font-bold">Contact Us</h2>
          </div>
          <h3 className="text-muted-foreground">
            Get in touch and let us know how we can help.
          </h3>
          <p>
            Please email us at{" "}
            <a
              className="underline underline-offset-2 hover:text-black"
              href="mailto:info@tramona.com"
              target="_blank"
              rel="noreferrer"
            >
              info@tramona.com
            </a>
            .
          </p>
        </section>
        <section className="space-y-4 rounded-xl border p-4 shadow-md">
          <div className="flex items-center gap-4">
            <Icons iconName={"edit"} />
            <h2 className="text-xl font-bold">
              Report a Bug/Request a Feature
            </h2>
          </div>
          <h3 className="text-muted-foreground">
            Provide some details to our team and we will be in touch by email to
            assist.
          </h3>
          <ContactForm />
        </section>
      </div>
    </DashboardLayout>
  );
}
