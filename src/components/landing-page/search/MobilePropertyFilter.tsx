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
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useZodForm } from "@/utils/useZodForm";
import { z } from "zod";
import { CounterInput } from "@/components/_common/CounterInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ListFilterIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export default function MobilePropertyFilter() {
  const beds = useCitiesFilter((state) => state.beds);
  const bedrooms = useCitiesFilter((state) => state.bedrooms);
  const bathrooms = useCitiesFilter((state) => state.bathrooms);
  const houseRules = useCitiesFilter((state) => state.houseRules);
  // const roomType = useCitiesFilter((state) => state.roomType);
  const radius = useCitiesFilter((state) => state.radius);

  const form = useZodForm({
    schema: FormSchema,
    defaultValues: {
      // roomType:
      //   // TODO: augh
      //   roomType === "Other" || roomType === undefined ? "Flexible" : roomType,
      beds: beds,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      houseRules: houseRules,
      radius: [radius],
    },
  });

  const setBeds = useCitiesFilter((state) => state.setBeds);
  const setBathrooms = useCitiesFilter((state) => state.setBathrooms);
  const setBedrooms = useCitiesFilter((state) => state.setBedrooms);
  const setHouseRules = useCitiesFilter((state) => state.setHouseRules);
  // const setRoomType = useCitiesFilter((state) => state.setRoomType);
  const setOpen = useCitiesFilter((state) => state.setOpen);
  const setRadius = useCitiesFilter((state) => state.setRadius);
  const clearFilter = useCitiesFilter((state) => state.clearFilter);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // setRoomType(data.roomType);
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" type="button">
          <ListFilterIcon />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-2 flex flex-col gap-y-1"
          >
            <div className="flex flex-col ">
              <FormField
                control={form.control}
                name="beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-primary">
                      Rooms and spaces
                    </FormLabel>
                    <FormControl>
                      <Total
                        name="Beds"
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
                  <FormItem>
                    <FormControl>
                      <Total
                        name="Bedrooms"
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
                  <FormItem>
                    <FormControl>
                      <Total
                        name="Bathrooms"
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold text-primary">
                    House rules
                  </FormLabel>
                  {houseRuleItems.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="houseRules"
                      render={({ field }) => (
                        <FormItem key={item.value}>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) =>
                                checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      item.value,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.value,
                                      ),
                                    )
                              }
                            />
                          </FormControl>
                          <FormLabel className="ml-2 text-sm font-bold text-primary">
                            {item.title}
                          </FormLabel>
                        </FormItem>
                      )}
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
                <FormItem className="space-y-3 ">
                  <FormLabel className="text-sm font-bold text-primary">
                    Radius - {value} miles
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={500}
                      step={1}
                      defaultValue={value}
                      onValueChange={onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClearFilter}
              >
                Clear
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
