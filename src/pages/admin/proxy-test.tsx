import { z } from "zod";
import { useZodForm } from "@/utils/useZodForm";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodUrl } from "@/utils/zod-utils";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";

export default function Page() {
  const [res, setRes] = useState<{ status: number; data: string }>();

  const form = useZodForm({
    schema: z.object({ url: zodUrl() }),
  });

  const utils = api.useUtils();

  const onSubmit = form.handleSubmit(({ url }) =>
    utils.misc.proxyFetch.fetch({ url }).then(setRes),
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 px-4 py-32">
        <Form {...form}>
          <form className="mx-auto flex max-w-lg" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} autoFocus className="rounded-r-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="rounded-l-none"
            >
              Fetch URL
            </Button>
          </form>
        </Form>

        <p className="text-center font-semibold">{res?.status}</p>

        <pre className="whitespace-break-spaces text-sm">{res?.data}</pre>
      </div>
    </DashboardLayout>
  );
}
