import MainLayout from "@/components/layouts/MainLayout";
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
import { createRequestInputSchema } from "@/server/api/schema/admin.schema";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Page() {
  const form = useForm<z.infer<typeof createRequestInputSchema>>({
    resolver: zodResolver(createRequestInputSchema),
    defaultValues: {
      max_preferred_price: 0,
      min_num_bed: 1,
      min_num_bedrooms: 1,
      note: "",
    },
  });

  function onSubmit(values: z.infer<typeof createRequestInputSchema>) {
    console.log(values);
  }

  return (
    <MainLayout pageTitle="Admin Dashboard">
      <main className="container">
        <p className="p-8">admin dashboard</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Request</DialogTitle>
              <DialogDescription>
                Add personal request for yourself (Admin).
              </DialogDescription>
            </DialogHeader>

            {/* Ensure that the Form component wraps the relevant content */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="max_preferred_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your max preferred price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="shadcn"
                          type={"number"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </MainLayout>
  );
}
