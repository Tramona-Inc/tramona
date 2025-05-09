import { cn } from "@/utils/utils";
import { useState } from "react";
import DialogCancelSave from "./DialogCancelSave";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { ALL_CHECKIN_TYPES, Property } from "@/server/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

const formSchema = z.object({
  checkInType: z.enum(ALL_CHECKIN_TYPES).nullable(),
  additionalCheckInInfo: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CheckInMethodDialog({
  property,
  refetch,
  updateProperty,
  isPropertyUpdating,
  currentHostTeamId,
}: {
  property: Property | undefined;
  refetch: () => void;
  updateProperty: ({
    updatedProperty,
    currentHostTeamId,
  }: {
    updatedProperty: Property;
    currentHostTeamId: number;
  }) => Promise<void>;
  isPropertyUpdating: boolean;
  currentHostTeamId: number | null | undefined;
}) {
  let modifiedCheckInType = null;

  switch (property?.checkInType) {
    case "Smart lock":
      modifiedCheckInType = 0;
      break;
    case "Keypad":
      modifiedCheckInType = 1;
      break;
    case "Lockbox":
      modifiedCheckInType = 2;
      break;
    case "Building staff":
      modifiedCheckInType = 3;
      break;
  }

  const [selectedMethodIndex, setSelectedMethodIndex] = useState<number | null>(
    modifiedCheckInType,
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkInType: property?.checkInType ?? null,
      additionalCheckInInfo: property?.additionalCheckInInfo ?? "",
    },
  });

  const onSubmit = async (formValues: FormSchema) => {
    if (property) {
      await updateProperty({
        updatedProperty: {
          ...property,
          checkInType: formValues.checkInType ?? null,
          additionalCheckInInfo: formValues.additionalCheckInInfo ?? null,
        },
        currentHostTeamId: currentHostTeamId!,
      });

      void refetch();
    }
  };

  const methods = [
    {
      title: "Smart lock",
      subtitle: "Guests will use a code or app to open a wifi-connected lock.",
    },
    {
      title: "Keypad",
      subtitle:
        "Guests will use the code you provide to open an electronic lock.",
    },
    {
      title: "Lockbox",
      subtitle:
        "Guests will use a code you provide to open a small safe that has a key inside.",
    },
    {
      title: "Building staff",
      subtitle: "Someone will be available 24 hours a day to let guests in.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Check-in method</h1>
        <p className="text-muted-foreground">How do travelers get in?</p>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="checkInType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    {methods.map((method, index) => (
                      <div
                        className={cn(
                          selectedMethodIndex === index
                            ? "bg-zinc-200"
                            : "bg-white",
                          "rounded-xl border p-3 hover:cursor-pointer hover:bg-zinc-100",
                        )}
                        key={index}
                        onClick={() => {
                          setSelectedMethodIndex(index);
                          field.onChange(method.title);
                        }}
                      >
                        <h2 className="font-semibold">{method.title}</h2>
                        <p className="text-muted-foreground">
                          {method.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="additionalCheckInInfo"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <h2 className="font-semibold">
                      Additional check-in details
                    </h2>
                    <Textarea
                      {...field}
                      placeholder="Add any important details for getting inside your place..."
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <p className="text-muted-foreground">
            Shared 48 hours before check-in
          </p>
          <DialogCancelSave isLoading={isPropertyUpdating} />
        </form>
      </Form>
    </div>
  );
}
