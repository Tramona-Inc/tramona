import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useZodForm } from "@/utils/useZodForm";
import { useState } from "react";
import { z } from "zod";
import { CounterInput } from "../_common/CounterInput";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export function Total({
  name,
  total,
  setTotal,
}: {
  name: string;
  total: number;
  setTotal: (total: number) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between">
      <p className="text-sm font-semibold">{name}</p>
      <CounterInput value={total} onChange={setTotal} />
    </div>
  );
}

const houseRuleItems = [
  {
    value: "pets allowed",
    title: "Pets allowed",
  },
  {
    value: "smoking allowed",
    title: "Smoking Allowed",
  },
];

// const PROPERTY_TYPE_OPTIONS = [
//   "Flexible",
//   ...ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER,
// ] as const;

const FormSchema = z.object({
  // roomType: z
  //   .enum(PROPERTY_TYPE_OPTIONS)
  //   .transform((s) => (s === "Flexible" ? undefined : s)),
  beds: z.number().nullish(),
  bedrooms: z.number().nullish(),
  bathrooms: z.number().nullish(),
  houseRules: z.array(z.string()).nullable(),
  radius: z.array(z.number()),
});

export default function RequestMoreFilter() {
  const [beds, setBeds] = useState<number | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [houseRules, setHouseRules] = useState<string[]>([]);
  // const roomType = useCitiesFilter((state) => state.roomType);
  const [radius, setRadius] = useState<number>(50);
  const [open, setOpen] = useState<boolean>(false);

  const clearFilter = () => {
    setBeds(null);
    setBedrooms(null);
    setBathrooms(null);
    setHouseRules([]);
    setRadius(50);
  };

  const form = useZodForm({
    schema: FormSchema,
    defaultValues: {
      beds: beds,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      houseRules: houseRules,
      radius: [radius],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setBeds(data.beds ?? 0);
    setBathrooms(data.bathrooms ?? 0);
    setBedrooms(data.bedrooms ?? 0);
    setHouseRules(data.houseRules ?? []);
    setOpen(false);
    setRadius(data.radius[0] ?? 50);
  }

  function handleClearFilter() {
    clearFilter();
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* <FormField
          control={form.control}
          name="roomType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-bold text-primary">
                Type of place
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {PROPERTY_TYPE_OPTIONS.map((property) => (
                    <FormItem
                      key={property}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={property} />
                      </FormControl>
                      <FormLabel className="font-normal text-primary">
                        {property}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Separator />
        <div>
          <FormField
            control={form.control}
            name="beds"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="font-bold text-primary">
                  Rooms and spaces
                </FormLabel>
                <FormControl>
                  <Total
                    name={"Beds"}
                    total={field.value ?? 0}
                    setTotal={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Total
                    name={"Bedrooms"}
                    total={field.value ?? 0}
                    setTotal={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Total
                    name={"Bathrooms"}
                    total={field.value ?? 0}
                    setTotal={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <FormField
          control={form.control}
          name="houseRules"
          render={() => (
            <FormItem>
              <FormLabel className="font-bold text-primary">
                House rules
              </FormLabel>
              {houseRuleItems.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name="houseRules"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.value}
                        className="flex flex-row items-center space-x-3 py-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...(field.value ?? []),
                                    item.value,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.value,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-bold text-primary">
                          {item.title}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="radius"
          render={({ field: { value, onChange } }) => (
            <FormItem className="">
              <FormLabel className="font-bold text-primary">
                Radius - {value} miles
              </FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={500}
                  step={1}
                  defaultValue={value}
                  onValueChange={onChange}
                  className="mt-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row justify-between">
          <Button type="button" variant={"ghost"} onClick={handleClearFilter}>
            Clear
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
