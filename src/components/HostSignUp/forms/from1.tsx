import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "src/components/ui/use-toast";

import { Input } from "@/components/ui/input";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

const Form1Schema = z.object({
  listings: z
    .array(
      z.object({
        type: z.string().min(1, { message: "Input required" }),
        details: z
          .string()
          .max(160, {
            message: "You've reached 160 characters. Please type less",
          })
          .min(4, { message: "Please go into detail" }),
        url: z.string().url(),
      }),
    )
    .optional(),
});

export default function Form1() {
  type ProfileFormValues = z.infer<typeof Form1Schema>;

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    listings: [
      {
        type: "",
        details: "",
        url: "",
      },
    ],
    //   urls: [
    // { value: "https://shadcn.com" },
    // { value: "http://twitter.com/shadcn" },
    //   ],
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(Form1Schema),
    defaultValues,
    mode: "onChange",
  });

  const { fields: listingsFields, append: appendListings } = useFieldArray({
    name: "listings",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
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
        <h1 className="text-4xl font-bold">
          Enter the link to your listings below to get started setting up!
        </h1>
        <h2 className="pt-20 text-2xl font-semibold">
          Where do you currently list? (Please include all websites)
        </h2>
      </div>
      <div className="h-full overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className=" space-y-5">
              {listingsFields.map((field, index) => (
                <>
                  <div className="flex flex-row space-x-2">
                    <div className="w-1/4">
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`listings.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(index !== 0 && "sr-only")}>
                              Type
                            </FormLabel>
                            {/* <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add links to your website, blog, or social media profiles.
                    </FormDescription> */}

                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ex. Airbnb"
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-3/4">
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`listings.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(index !== 0 && "sr-only")}>
                              URLs
                            </FormLabel>

                            <FormControl>
                              <Input
                                placeholder="Enter your profile link "
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`listings.${index}.details`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Details
                        </FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder="Please give specific details of which of your properties you want to list, the more the better results we can get"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  appendListings({ type: "", url: "", details: "" })
                }
              >
                + Add
              </Button>
            </div>
            <Button type="submit">Update profile</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
