import { useState } from "react";
import { z } from "zod";

import { Form, FormControl, FormField } from "@/components/ui/form";
import { LPFormItem, LPFormLabel, LPFormMessage, LPInput } from "./components";

import { api } from "@/utils/api";
import { zodString } from "@/utils/zod-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/utils/utils";
import { PlusIcon, XIcon } from "lucide-react";
import { MAX_REQUEST_GROUP_SIZE } from "@/server/db/schema";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  data: z
    .array(
      z.object({
        airbnbLink: zodString(),
      }),
    )
    .min(1),
});

type FormSchema = z.infer<typeof formSchema>;

export default function LinkScrapeSearchBar({
  afterSubmit,
  modeSwitch,
}: {
  afterSubmit?: () => void;
  modeSwitch: React.ReactNode;
}) {
  const utils = api.useUtils();

  const defaultValues: Partial<FormSchema["data"][number]> = {
    airbnbLink: "",
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: [defaultValues],
    },
    reValidateMode: "onBlur",
  });

  const [curTab, setCurTab] = useState(0);
  const { data } = form.watch();
  const numTabs = data.length;

  const tabsWithErrors =
    form.formState.errors.data
      ?.map?.((error, index) => (error ? index : null))
      .filter((i): i is number => i !== null) ?? [];

  async function onSubmit(data: FormSchema["data"]) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data.data))}
        className="space-y-2"
        key={curTab}
      >
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: numTabs }).map((_, i) => {
              const isSelected = curTab === i;
              const hasErrors = tabsWithErrors.includes(i);
              const showX = isSelected && numTabs > 1;

              // buttons in buttons arent allowed, so we only show the x button
              // on the tab when the tab is selected, and make the tab a div instead
              // of a button when its selected
              const Comp = showX ? "div" : "button";

              return (
                <Comp
                  key={i}
                  type="button"
                  onClick={showX ? undefined : () => setCurTab(i)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium backdrop-blur-md",
                    hasErrors && "pr-3",
                    isSelected
                      ? "bg-white text-black"
                      : "bg-black/50 text-white hover:bg-neutral-600/60",
                    showX && "pr-2",
                  )}
                >
                  Trip {i + 1}
                  {hasErrors && (
                    <div className="rounded-full bg-red-400 px-1 text-xs font-medium text-black">
                      Errors
                    </div>
                  )}
                  {showX && (
                    <button
                      type="button"
                      onClick={() => {
                        if (curTab === numTabs - 1) {
                          setCurTab(numTabs - 2);
                        }
                        form.setValue(
                          "data",
                          data.filter((_, j) => j !== i),
                        );
                      }}
                      className="rounded-full p-1 hover:bg-black/10 active:bg-black/20"
                    >
                      <XIcon className="size-3" />
                    </button>
                  )}
                </Comp>
              );
            })}
            {numTabs < MAX_REQUEST_GROUP_SIZE && (
              <button
                key=""
                type="button"
                onClick={() => {
                  setCurTab(numTabs);
                  form.setValue("data", [
                    ...data,
                    defaultValues as FormSchema["data"][number],
                  ]);
                  // form.setFocus(`data.${data.length - 1}.location`);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-black/50 p-2 pr-4 text-sm font-medium text-white backdrop-blur-md hover:bg-neutral-600/60"
              >
                <PlusIcon className="size-4" />
                Add another trip
              </button>
            )}
          </div>
          {modeSwitch}
        </div>

        <div className="grid grid-cols-2 rounded-[42px] bg-black/50 p-0.5 backdrop-blur-md lg:grid-cols-11">
          <FormField
            control={form.control}
            name={`data.${curTab}.airbnbLink`}
            render={({ field }) => (
              <LPFormItem className="lg:col-span-11">
                <LPFormLabel>Listing URL</LPFormLabel>
                <FormControl>
                  <LPInput
                    {...field}
                    inputMode="url"
                    placeholder="AirBnB - Booking.com - VRBO"
                  />
                </FormControl>
                <LPFormMessage />
              </LPFormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            size="lg"
            variant="white"
            className="rounded-full"
          >
            Request Deal
          </Button>
        </div>
      </form>
    </Form>
  );
}
