// import ContactIcon from '@/components/icons/contact';
// import EditIcon from '@/components/icons/large-edit-icon';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodString } from "@/utils/zod-utils";
import Icons from "@/components/ui/icons";

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

  const handleSubmit = async ({}: z.infer<typeof formSchema>) => {
    try {
      //  Simulate an API request (replace with actual API call)
      await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // Simulate a successful response
      toast({
        title: "Message sent successfully",
        description: "We will be in touch shortly",
      });

      // Reset the message field after successful submission
      form.resetField("message", { defaultValue: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
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
          isLoading={form.formState.isSubmitting}
          type="submit"
          size="lg"
          className="w-full rounded-full sm:w-auto"
        >
          Send
        </Button>
      </form>
    </Form>
  );
}

export default function Page() {
  return (
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
          <h2 className="text-xl font-bold">Report a Bug/Request a Feature</h2>
        </div>
        <h3 className="text-muted-foreground">
          Provide some details to our team and we will be in touch by email to
          assist.
        </h3>
        <ContactForm />
      </section>
    </div>
  );
}
