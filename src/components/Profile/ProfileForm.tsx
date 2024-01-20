import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodMMDDYYYY, zodString } from "@/utils/zod-utils";

const formSchema = z.object({
  name: zodString(),
  email: zodString().email(),
  dob: zodMMDDYYYY({ optional: true }),
  gender: zodString(),
  phoneNumber: zodString()
    // only allow digits, dashes, parentheses, spaces, plus signs, and periods
    .regex(/^[0-9-() \+\.]*$/, { message: "Invalid phone number" })
    // require 10 digits with an optional leading +1
    .regex(/^(\+1)?(\D*\d\D*){10}$/, { message: "Must be 10 digits" })
    // remove all non-digits
    .transform((value) => value.replace(/\D/g, "")),
});

export default function ProfileForm() {
  const { data: session } = useSession();
  const user = session?.user;

  const { toast } = useToast();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const body = { id: user?.id, ...values };

    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_HOSTED_BACKEND_URL}/api/users/update`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(body),
    //   },
    // );

    // if (!response.ok) {
    //   const error: ErrorResponse = await response.json();

    //   if (error.message) {
    //     toast({
    //       title: "Error",
    //       description: error.message,
    //     });
    //   }
    // } else {
    //   const data: User = await response.json();
    //   localStorage.setItem("user", JSON.stringify(data));
    //   // setUser(data);
    //   toast({
    //     title: "Changes saved",
    //     description: "Your profile has been updated.",
    //   });
    //   // Refresh the page
    //   location.reload();
    // }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${user?.name}`,
      email: `${user?.email}`,
      dob: undefined,
      gender: "",
      phoneNumber: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
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
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input {...field} placeholder="MM/DD/YYYY" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
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
            <FormItem className="lg:col-span-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          isLoading={form.formState.isSubmitting}
          size="lg"
          type="submit"
          className="lg:col-span-2"
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
}
