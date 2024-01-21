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
import { offerInsertSchema } from "@/server/db/schema";

export default function AdminFormOffer({ requestId }: { requestId: number }) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof offerInsertSchema>>({
    resolver: zodResolver(offerInsertSchema),
    defaultValues: {
      requestId: requestId,
      totalPrice: 1,
      propertyId: 10, // TODO: later link to an acutal property id
    },
  });

  const utils = api.useUtils(); // To allow to invalidate the data useContext depracated

  const { mutate, isLoading } = api.offers.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      toast({
        title: "Offer sent sucessfully",
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

  function onSubmit(values: z.infer<typeof offerInsertSchema>) {
    mutate(values);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Make an Offer</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Offer
              <Badge
                variant="secondary"
                size="sm"
                className="ml-2 -translate-y-0.5 uppercase"
              >
                Admin
              </Badge>
            </DialogTitle>
            <DialogDescription>Send your offer!</DialogDescription>
          </DialogHeader>

          {/* Ensure that the Form component wraps the relevant content */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-5 space-y-5"
            >
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your offer price</FormLabel>
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
