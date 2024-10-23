import React, { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X, Edit, Check } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import ImagesInput from "@/components/_common/ImagesInput";
import CurrencyInput from "react-currency-input-field";
import Image from "next/image";
import { useRouter } from "next/router";
const claimItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  requestedAmount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  imagesList: z
    .string()
    .array()
    .min(3, { message: "Please upload atleast 3 images" }),
});

type ClaimItem = z.infer<typeof claimItemSchema>;

export default function SubmitAllClaimItemsForm({
  tripId,
  claimId,
}: {
  tripId: number;
  claimId: string;
}) {
  const router = useRouter();
  const [claimItems, setClaimItems] = useState<ClaimItem[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { mutateAsync: submitAllClaimitems } =
    api.claims.submitClaimEvidence.useMutation();

  const form = useForm<ClaimItem>({
    resolver: zodResolver(claimItemSchema),
    defaultValues: {
      itemName: "",
      requestedAmount: 0,
      description: "",
      imagesList: [""],
    },
  });

  function onSubmit(data: ClaimItem) {
    if (editingIndex !== null) {
      const updatedItems = [...claimItems];
      updatedItems[editingIndex] = data;
      setClaimItems(updatedItems);
      setEditingIndex(null);
    } else {
      setClaimItems([...claimItems, data]);
    }
    form.reset();
    setIsAddingNew(false);
  }

  function startEditing(index: number) {
    const itemToEdit = claimItems[index];
    form.reset(itemToEdit);
    setEditingIndex(index);
  }

  function cancelEditing() {
    setEditingIndex(null);
    form.reset();
  }

  async function onSubmitForAllItems(claimItems: ClaimItem[]) {
    const processedClaimItems = claimItems.map((item) => ({
      ...item,
      requestedAmount: item.requestedAmount * 100,
    }));

    await submitAllClaimitems({
      tripId,
      claimId,
      claimItems: processedClaimItems,
    }).then(() => {
      toast({
        title: "Submitted",
        description: "We will proccess your damages within 2-4 bussiness days.",
      });
      void router.push("/host/report");
    });
  }

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Claim Items</CardTitle>
        </CardHeader>
        <CardContent>
          {claimItems.map((item, index) => (
            <Card key={index} className="mb-4 border border-teal-500">
              {editingIndex === index ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 p-4"
                  >
                    <FormField
                      control={form.control}
                      name="itemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requestedAmount"
                      render={() => (
                        <FormItem>
                          <FormLabel>Requested Amount ($)</FormLabel>
                          <FormControl>
                            <Controller
                              control={form.control}
                              name="requestedAmount"
                              render={({ field }) => (
                                <CurrencyInput
                                  id="requestedAmount"
                                  placeholder="0.00"
                                  decimalsLimit={2}
                                  decimalScale={2}
                                  allowNegativeValue={false}
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(
                                      value ? parseFloat(value) : "",
                                    );
                                  }}
                                  className="input" // Replace with your actual input className
                                  prefix="$"
                                />
                              )}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the amount you&apos;re claiming for this item
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imagesList"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Please upload clear, high-quality photos of the
                            damages.(Min 3)
                          </FormLabel>
                          <FormControl>
                            <ImagesInput {...field} />
                          </FormControl>
                          <FormDescription>
                            Include as many photos as possible to thoroughly
                            document the issue. Ensure that the images are
                            well-lit and capture the damages from multiple
                            angles and perspectives. This will help us assess
                            your claim quickly and accurately.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Check className="mr-2 h-4 w-4" />
                        Update
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{item.itemName}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(index)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Requested Amount:</strong> $
                      {item.requestedAmount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Description:</strong> {item.description}
                    </p>
                    <div className="flex flex-col gap-y-3">
                      <strong>Images:</strong>{" "}
                      <div className="flex flex-row gap-x-1 md:gap-x-4">
                        {item.imagesList.map((image, index) => (
                          <Image
                            src={image}
                            key={index}
                            alt="uploaded image"
                            width={100}
                            height={100}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
          {isAddingNew && (
            <Card className="mb-4 border">
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="itemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Laptop, Phone, Camera"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the name of the item you&apos;re claiming
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requestedAmount"
                      render={() => (
                        <FormItem>
                          <FormLabel>Requested Amount ($)</FormLabel>
                          <FormControl>
                            <Controller
                              control={form.control}
                              name="requestedAmount"
                              render={({ field }) => (
                                <CurrencyInput
                                  id="requestedAmount"
                                  placeholder="0.00"
                                  intlConfig={{
                                    locale: "en-US",
                                    currency: "GBP",
                                  }}
                                  decimalsLimit={2}
                                  decimalScale={2}
                                  allowNegativeValue={false}
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(
                                      value ? parseFloat(value) : "",
                                    );
                                  }}
                                  className="flex h-10 w-full appearance-none items-center rounded-md border border-input bg-zinc-50 px-3 text-sm text-foreground outline outline-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-black focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" // Replace with your actual input className
                                  prefix="$"
                                />
                              )}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the amount you&apos;re claiming for this item
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Provide details about the item, its condition, and why you're claiming it"
                            />
                          </FormControl>
                          <FormDescription>
                            Describe the item and provide any relevant details
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imagesList"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Please upload clear, high-quality photos of the
                            damages.(Min 3)
                          </FormLabel>
                          <FormControl>
                            <ImagesInput {...field} />
                          </FormControl>
                          <FormDescription>
                            Include as many photos as possible to thoroughly
                            document the issue. Ensure that the images are
                            well-lit and capture the damages from multiple
                            angles and perspectives. This will help us assess
                            your claim quickly and accurately.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddingNew(false);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Claim Item</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          {!isAddingNew && (
            <Button onClick={() => setIsAddingNew(true)} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              {claimItems.length > 0 ? "Add Another Item" : "Add Claim Item"}
            </Button>
          )}
        </CardContent>
      </Card>
      {claimItems.length > 0 && (
        <Button
          onClick={async () => await onSubmitForAllItems(claimItems)}
          className="w-full"
        >
          Submit All Claims
        </Button>
      )}
    </div>
  );
}
