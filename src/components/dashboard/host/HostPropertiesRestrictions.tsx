import { Input } from "@/components/ui/input";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { useState } from "react";
import { type Property } from "@/server/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zodNumber } from "@/utils/zod-utils";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { api } from "@/utils/api";
import { DollarSignIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

export default function HostPropertiesRestrictions({
  property,
}: {
  property: Property;
}) {
  const { currentHostTeamId } = useHostTeamStore();
  const [editing, setEditing] = useState(false);

  const formSchema = z.object({
    age: z.union([zodNumber(), z.literal("").transform(() => null)]).nullable(),
    price: z.union([zodNumber({ min: 0 }), z.literal("").transform(() => 0)]),
    stripeVerRequired: z.string(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: property.ageRestriction ?? null,
      price: property.priceRestriction ? property.priceRestriction / 100 : 0,
      stripeVerRequired: property.stripeVerRequired ? "yes" : "no",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { mutateAsync: updateProperty } = api.properties.update.useMutation();

  const onSubmit = async (values: FormValues) => {
    const { age, price, stripeVerRequired } = values;
    const newProperty = {
      ...property,
      ageRestriction: age,
      priceRestriction: price ? price * 100 : 0, //convert to cents
      stripeVerRequired: stripeVerRequired === "yes",
    };

    await updateProperty({
      updatedProperty: newProperty,
      currentHostTeamId: currentHostTeamId!,
    })
      .then(() => {
        toast({
          title: `Property Updated!`,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.data?.code === "FORBIDDEN") {
          toast({
            title: "You do not have permission to edit the listing.",
            description: "Please contact your team owner to request access.",
          });
        } else {
          errorToast();
        }
      });
  };

  return (
    <div className="mb-24 mt-6 space-y-2">
      <div className="text-end">
        <HostPropertyEditBtn
          editing={editing}
          setEditing={setEditing}
          property={property}
          onSubmit={form.handleSubmit(onSubmit)}
        />
      </div>
      <div className="space-y-3 px-4">
        <Form {...form}>
          <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-3">
              {/* Property Restrictions */}
              <div className="mb-6 space-y-2">
                <h3 className="text-xl font-bold leading-tight">
                  Property restrictions
                </h3>
                <p className="text-base leading-normal">
                  Travelers must be at least this old to book this property.
                </p>
                <FormField
                  name="age"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full rounded-md border p-2 text-base"
                          disabled={!editing}
                          type="number"
                          placeholder="Minimum booking age"
                          suffix="/ years old"
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Minimum Offer Price */}
              <div className="mt-6 space-y-2">
                <h3 className="text-xl font-bold leading-tight">
                  Minimum offer price
                </h3>
                <p className="text-base leading-normal">
                  You will only see offers equal to or higher than this price.
                </p>
                <FormField
                  name="price"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="w-full rounded-md border p-2 pl-6 text-base"
                            icon={DollarSignIcon}
                            disabled={!editing}
                            placeholder="0"
                            suffix="/ night"
                            type="number"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Stripe Verification */}
              <div className="mt-6 space-y-2">
                <h3 className="mt-6 text-xl font-bold leading-tight">
                  Stripe verification
                </h3>
                <p className="text-base leading-normal">
                  Do you want travelers to be verified by Stripe for this
                  property? This is an 8 hour long p
                </p>
                <FormField
                  name="stripeVerRequired"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          disabled={!editing}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="no" id="r1" />
                              <Label htmlFor="r1">No</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="yes" id="r2" />
                              <Label htmlFor="r2">Yes</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
