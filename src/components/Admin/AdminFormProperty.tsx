import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type z } from "zod";
import { propertyInsertSchema } from "@/server/db/schema";

export default function AdminFormProperty() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof propertyInsertSchema>>({
    resolver: zodResolver(propertyInsertSchema),
    defaultValues: {
      name: "",
      hostName: "",
      maxNumGuests: 1,
      numBeds: 1,
      numBedrooms: 1,
    },
  });

  const utils = api.useUtils(); // To allow to invalidate the data useContext depracated

  const { mutate, isLoading } = api.properties.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      toast({
        title: "Property created sucessfully",
        variant: "default",
      });
      void utils.requests.getAll.invalidate(); // revalidate the reuqest cards
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof propertyInsertSchema>) {
    mutate(values);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>+ Add a property</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Property
              <Badge
                variant="secondary"
                size="sm"
                className="ml-2 -translate-y-0.5 uppercase"
              >
                Admin
              </Badge>
            </DialogTitle>
            <DialogDescription>Create your property!</DialogDescription>
          </DialogHeader>

          {/* Ensure that the Form component wraps the relevant content */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-5 space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Urban Los Angeles Cottage"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="hostName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <Button type="submit" isLoading={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
