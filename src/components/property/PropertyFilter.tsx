import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";

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
      <h2 className="text-sm font-semibold">{name}</h2>
      <div className="grid max-w-[150px] grid-cols-3 place-items-center">
        <Button
          variant="ghost"
          className="text-md "
          size={"icon"}
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            if (total - 1 > -1) {
              setTotal(total - 1);
            }
          }}
        >
          <CircleMinus color="gray" size={20} />
        </Button>
        <div className="font-semibold">{total}</div>
        <Button
          variant="ghost"
          className="text-md"
          size={"icon"}
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            setTotal(total + 1);
          }}
        >
          <CirclePlus color="gray" size={20} />
        </Button>
      </div>
    </div>
  );
}

const propertyTypeOptions = [
  "Flexible",
  "Entire Place",
  "Private",
  "Other",
] as const;

const propertyType = [
  {
    value: "Flexible",
    title: "Flexible",
  },
  {
    value: "Entire place",
    title: "Entire Place",
  },
  {
    value: "Private",
    title: "Private",
  },
  {
    value: "Other",
    title: "Other",
  },
];

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

const FormSchema = z.object({
  propertyType: z.enum(propertyTypeOptions, {
    required_error: "You need to select a notification type.",
  }),
  beds: z.number().nullish(),
  bedrooms: z.number().nullish(),
  bathrooms: z.number().nullish(),
  houseRules: z.array(z.string()).nullable(),
});

export default function PropertyFilter() {
  const beds = useCitiesFilter((state) => state.beds);
  const bedrooms = useCitiesFilter((state) => state.bedrooms);
  const bathrooms = useCitiesFilter((state) => state.bathrooms);
  const houseRules = useCitiesFilter((state) => state.houseRules);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      propertyType: "Flexible",
      beds: beds,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      houseRules: houseRules,
    },
  });

  const setBeds = useCitiesFilter((state) => state.setBeds);
  const setBathrooms = useCitiesFilter((state) => state.setBathrooms);
  const setBedrooms = useCitiesFilter((state) => state.setBedrooms);
  const setHouseRules = useCitiesFilter((state) => state.setHouseRules);
  const setOpen = useCitiesFilter((state) => state.setOpen);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setBeds(data.beds ?? 0);
    setBathrooms(data.bathrooms ?? 0);
    setBedrooms(data.bedrooms ?? 0);
    setHouseRules(data.houseRules ?? []);
    setOpen(false);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function reset(e: { preventDefault: () => void }) {
    e.preventDefault();
    // Reset form values
    setBeds(0);
    setBathrooms(0);
    setBedrooms(0);
    setHouseRules([]);
    form.reset();
    // Update state and reset form values after state updates are applied
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="propertyType"
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
                  {propertyType.map((property) => (
                    <FormItem
                      key={property.value}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={property.value} />
                      </FormControl>
                      <FormLabel className="font-normal text-primary">
                        {property.title}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
        <div className="flex flex-row justify-between">
          <Button variant={"ghost"} onClick={reset}>
            Clear
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
