import React from "react";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { toast } from "src/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// type: z.string().min(1, { message: "Input required" }),
const Form2Schema = z.object({
  email: z.string().email(),
  phone_num: z.string().min(10, { message: "Invalid phone number" }),
});

export type Form2Values = z.infer<typeof Form2Schema>;
type Form2Props = {
  nextTab: () => void;
  prevTab: () => void;
  handleFormData: (value: Form2Values) => void;
};

export default function Form2({
  nextTab,
  prevTab,
  handleFormData,
}: Form2Props) {
  const defaultValues: Partial<Form2Values> = {
    email: "",
    phone_num: "",
  };

  const form = useForm<Form2Values>({
    resolver: zodResolver(Form2Schema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: Form2Values) {
    nextTab();
    handleFormData(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <div className="pb-10">
        <h1 className="text-2xl font-bold md:text-4xl">
          When we recieve offers for your property, where should we send them?
        </h1>
        <h2 className="pt-10 text-lg font-semibold md:pt-20 md:text-2xl">
          We recommend both phone number and email as the requests are first
          come first serve.
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_num"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button onClick={prevTab} className="w-1/6">
              Back
            </Button>
            <Button type="submit" className="w-1/6">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
