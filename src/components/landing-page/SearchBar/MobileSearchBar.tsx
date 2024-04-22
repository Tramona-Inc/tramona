import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { optional, zodInteger, zodString } from "@/utils/zod-utils";
import {
  ALL_PROPERTY_ROOM_TYPES,
  MAX_REQUEST_GROUP_SIZE,
} from "@/server/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MobileDateRangePicker,
  MobileGuestsPicker,
  MobileLocationInput,
} from "./components";
import { useState } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import { PlusIcon, XIcon } from "lucide-react";

function SearchTab() {
  const formSchema = z
    .object({
      location: zodString(),
      maxNightlyPriceUSD: zodInteger({ min: 1 }),
      date: z.object({
        from: z.date(),
        to: z.date(),
      }),
      numGuests: zodInteger({ min: 1 }),
      airbnbLink: optional(zodString({ maxLen: 500 })),
      roomType: z.enum([...ALL_PROPERTY_ROOM_TYPES, "any"]),
      minNumBedrooms: optional(zodInteger()),
      minNumBeds: optional(zodInteger()),
      note: optional(zodString()),
    })
    .refine((data) => data.date.to > data.date.from, {
      message: "Must stay for at least 1 night",
      path: ["date"],
    });

  type FormSchema = z.infer<typeof formSchema>;

  const defaultValues: Partial<FormSchema> = {
    roomType: "any",
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    reValidateMode: "onBlur",
  });

  // const onSubmit = async (data: FormSchema) => {
  //   console.log(data);
  // };

  return (
    <Form {...form}>
      <form className="flex h-full flex-col justify-between">
        <div className="grid gap-3">
          <MobileLocationInput
            control={form.control}
            name="location"
            formLabel="Location"
            className="col-span-full"
          />

          <MobileDateRangePicker
            control={form.control}
            name="date"
            formLabel="Select dates"
            className="col-span-full"
          />

          <MobileGuestsPicker
            control={form.control}
            name="numGuests"
            formLabel="Add guests"
            className="col-span-full"
          />
        </div>

        <div className="flex justify-between">
          <Button type="reset" variant="ghost">
            Clear all
          </Button>

          <Button
            type="submit"
            variant="default"
            // onClick={form.handleSubmit((data) => onSubmit(data))}
          >
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}

function RequestDealTab() {
  const formSchema = z.object({
    data: z
      .array(
        z
          .object({
            location: zodString(),
            maxNightlyPriceUSD: zodInteger({ min: 1 }),
            date: z.object({
              from: z.date(),
              to: z.date(),
            }),
            numGuests: zodInteger({ min: 1 }),
            airbnbLink: optional(zodString({ maxLen: 500 })),
            roomType: z.enum([...ALL_PROPERTY_ROOM_TYPES, "any"]),
            minNumBedrooms: optional(zodInteger()),
            minNumBeds: optional(zodInteger()),
            note: optional(zodString()),
          })
          .refine((data) => data.date.to > data.date.from, {
            message: "Must stay for at least 1 night",
            path: ["date"],
          }),
      )
      .min(1),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const defaultValues: Partial<FormSchema["data"][number]> = {
    roomType: "any",
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: [defaultValues],
    },
    reValidateMode: "onBlur",
  });

  const utils = api.useUtils();
  const mutation = api.requests.createMultiple.useMutation();

  const [curTab, setCurTab] = useState(0);
  const { data } = form.watch();
  const numTabs = data.length;

  const tabsWithErrors =
    form.formState.errors.data
      ?.map?.((error, index) => (error ? index : null))
      .filter((i): i is number => i !== null) ?? [];

  // async function onSubmit(data: FormSchema["data"]) {}

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit((data) => onSubmit(data.data))}
        className="space-y-2"
        key={curTab} // rerender on tab changes (idk why i have to do this myself)
      >
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
                    ? "border border-gray-200 bg-white text-black"
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
      </form>
    </Form>
  );
}

export default function MobileSearchBar() {
  const [mode, setMode] = useState<"search" | "request">("search");

  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent side="bottom" className="h-full">
        <SheetHeader>
          <div className="flex w-full items-center justify-center gap-2 pb-5">
            <Button
              variant="link"
              className={cn(mode === "search" && "underline")}
              onClick={() => setMode("search")}
            >
              Search
            </Button>
            <Button
              variant="link"
              className={cn(mode === "request" && "underline")}
              onClick={() => setMode("request")}
            >
              Request deal
            </Button>
          </div>
        </SheetHeader>

        {mode === "search" && <SearchTab />}
        {mode === "request" && <RequestDealTab />}
      </SheetContent>
    </Sheet>
  );
}
