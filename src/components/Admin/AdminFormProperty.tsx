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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type z } from "zod";
import { propertyInsertFormSchema } from "@/server/db/schema";
import { cn } from "@/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function AdminFormProperty() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof propertyInsertFormSchema>>({
    resolver: zodResolver(propertyInsertFormSchema),
    defaultValues: {
      name: "",
      originalNightlyPrice: 1,
      hostName: "",
      maxNumGuests: 1,
      numBeds: 1,
      numRatings: 1,
      numBedrooms: 1,
      airbnbUrl: "",
      imageUrls: [{ value: "" }],
    },
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "imageUrls",
    control: form.control,
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

  function onSubmit(values: z.infer<typeof propertyInsertFormSchema>) {
    const flattenedImageUrls = values.imageUrls.map(
      (urlObject) => urlObject.value,
    );

    // TODO: Fix later to make it work
    // Seems like useFieldArray only works with objects not array of strings
    mutate({
      ...values,
      imageUrls: flattenedImageUrls,
    });
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

              <FormField
                control={form.control}
                name="hostName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="resize-none"
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <section className="flex flex-row gap-5">
                <FormField
                  control={form.control}
                  name="maxNumGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guests</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1"
                          type={"number"}
                          min={1}
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numBeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beds</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1"
                          type={"number"}
                          min={1}
                          value={field.value?.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="flex flex-row gap-5">
                <FormField
                  control={form.control}
                  name="originalNightlyPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beds</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1"
                          type={"number"}
                          min={1}
                          value={field.value?.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avgRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avg Rating</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1"
                          step={0.1}
                          type={"number"}
                          className="w-[100px]"
                          min={1}
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numRatings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rating</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1"
                          type={"number"}
                          className="w-[100px]"
                          min={1}
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="guesthouse">
                            Guest House
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="airbnbUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Url for Airbnb</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.airbnb.com/...."
                        className="resize-none"
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`imageUrls.${index}.value`} // Update this line
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          URLs
                        </FormLabel>
                        <FormDescription
                          className={cn(index !== 0 && "sr-only")}
                        >
                          Add link images to your property page!
                        </FormDescription>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ value: "" })}
                >
                  Add URL
                </Button>
              </div>

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
