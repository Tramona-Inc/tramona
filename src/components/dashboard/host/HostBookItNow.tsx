// import React, { useState, useCallback, useEffect, useRef } from "react";
// import { useForm, useFieldArray, FieldArrayWithId } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { type Property } from "@/server/db/schema";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { api } from "@/utils/api";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { X } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { HostPropertyEditBtn } from "./HostPropertiesLayout";

// const MAX_TIERS = 10;
// const MIN_TIERS = 1;
// const MIN_DISCOUNT = 1;
// const MAX_DISCOUNT = 80;
// const HIGH_DISCOUNT_THRESHOLD = 50;

// const DEFAULT_TIERS = [
//   { days: 90, percentOff: 5 },
//   { days: 60, percentOff: 10 },
//   { days: 30, percentOff: 15 },
//   { days: 21, percentOff: 20 },
//   { days: 14, percentOff: 25 },
//   { days: 7, percentOff: 30 },
// ];

// const discountTierSchema = z.object({
//   days: z.number().min(0, "Days must be 0 or greater"),
//   percentOff: z.number().min(MIN_DISCOUNT).max(MAX_DISCOUNT),
// });

// const formSchema = z.object({
//   bookItNowEnabled: z.boolean(),
//   bookItNowDiscountTiers: z
//     .array(discountTierSchema)
//     .min(MIN_TIERS)
//     .max(MAX_TIERS)
//     .refine(
//       (tiers) => {
//         const days = tiers.map((tier) => tier.days);
//         return new Set(days).size === days.length;
//       },
//       {
//         message: "Each 'days' value must be unique",
//         path: ["bookItNowDiscountTiers"],
//       },
//     ),
//   requestToBookMaxDiscountPercentage: z
//     .number()
//     .min(5)
//     .max(99)
//     .refine((value) => value >= 5 && value <= 99, {
//       message: "Discount percentage must be between 5 and 99",
//       path: ["requestToBookMaxDiscountPercentage"],
//     }),
// });

// type FormSchema = z.infer<typeof formSchema>;

// const orderTiers = (
//   tiers: FormSchema["bookItNowDiscountTiers"],
// ): FormSchema["bookItNowDiscountTiers"] => {
//   return [...tiers].sort((a, b) => b.days - a.days);
// };

// const hasHighDiscount = (
//   tiers: FormSchema["bookItNowDiscountTiers"],
// ): boolean => {
//   return tiers.some((tier) => tier.percentOff >= HIGH_DISCOUNT_THRESHOLD);
// };

// export default function HostBookItNow({ property }: { property: Property }) {
//   const [showHighDiscountAlert, setShowHighDiscountAlert] = useState(false);
//   const [showResetAlert, setShowResetAlert] = useState(false);
//   const [showEnableConfirmation, setShowEnableConfirmation] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const originalValuesRef = useRef<FormSchema>({
//     bookItNowEnabled: property.bookItNowEnabled,
//     bookItNowDiscountTiers: property.bookItNowDiscountTiers ?? DEFAULT_TIERS,
//     requestToBookMaxDiscountPercentage:
//       property.requestToBookMaxDiscountPercentage,
//   });

//   const form = useForm<FormSchema>({
//     resolver: zodResolver(formSchema),
//     defaultValues: originalValuesRef.current,
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "bookItNowDiscountTiers",
//   });

//   const updateBookItNowMutation = api.properties.updateBookItNow.useMutation({
//     onMutate: () => {
//       setIsSaving(true);
//     },
//     onSuccess: (_, variables) => {
//       toast({
//         title: "Settings saved",
//         description: "Book It Now settings have been successfully updated.",
//         duration: 3000,
//       });
//       if (
//         variables.bookItNowDiscountTiers !== undefined &&
//         variables.bookItNowEnabled !== undefined
//       ) {
//         // Create a narrowed version of the variables
//         const safeVariables = {
//           id: variables.id,
//           bookItNowEnabled: variables.bookItNowEnabled,
//           bookItNowDiscountTiers: variables.bookItNowDiscountTiers,
//         };
//         originalValuesRef.current = {
//           ...originalValuesRef.current,
//           ...safeVariables,
//         };
//       }
//       setHasUnsavedChanges(false);
//     },
//     onError: (error) => {
//       console.error("Error saving settings:", error);
//       toast({
//         title: "Error saving settings",
//         description:
//           "There was a problem saving your settings. Please try again.",
//         variant: "destructive",
//         duration: 5000,
//       });
//     },
//     onSettled: () => {
//       setIsSaving(false);
//     },
//   });

//   const checkForChanges = useCallback((currentValues: FormSchema) => {
//     const original = originalValuesRef.current;

//     if (
//       currentValues.bookItNowEnabled !== original.bookItNowEnabled ||
//       currentValues.requestToBookMaxDiscountPercentage !==
//         original.requestToBookMaxDiscountPercentage
//     ) {
//       return true;
//     }

//     if (
//       currentValues.bookItNowDiscountTiers.length !==
//       original.bookItNowDiscountTiers.length
//     ) {
//       return true;
//     }

//     for (let i = 0; i < currentValues.bookItNowDiscountTiers.length; i++) {
//       if (
//         currentValues.bookItNowDiscountTiers[i]?.days !==
//           original.bookItNowDiscountTiers[i]?.days ||
//         currentValues.bookItNowDiscountTiers[i]?.percentOff !==
//           original.bookItNowDiscountTiers[i]?.percentOff
//       ) {
//         return true;
//       }
//     }

//     return false;
//   }, []);

//   useEffect(() => {
//     const subscription = form.watch(() => {
//       const currentValues = form.getValues();
//       const isChanged = checkForChanges(currentValues);
//       setHasUnsavedChanges(isChanged);
//     });
//     return () => subscription.unsubscribe();
//   }, [form, checkForChanges]);

//   const handleAddTier = useCallback(() => {
//     if (fields.length < MAX_TIERS) {
//       append({ days: 0, percentOff: MIN_DISCOUNT });
//       const currentValues = form.getValues();
//       setHasUnsavedChanges(checkForChanges(currentValues));
//     }
//   }, [fields.length, append, form, checkForChanges]);

//   const handleSuccessfulSubmit = useCallback((data: FormSchema) => {
//     originalValuesRef.current = data;
//     setHasUnsavedChanges(false);
//   }, []);

//   const handleSubmit = useCallback(
//     async (data: FormSchema) => {
//       if (isSaving) return;

//       const orderedTiers = orderTiers(data.bookItNowDiscountTiers);
//       const uniqueDays = new Set(orderedTiers.map((tier) => tier.days));
//       if (uniqueDays.size !== orderedTiers.length) {
//         toast({
//           title: "Error saving settings",
//           description:
//             "Cannot assign different discounts to the same time period.",
//           variant: "destructive",
//           duration: 5000,
//         });
//         return;
//       }
//       if (hasHighDiscount(orderedTiers)) {
//         setShowHighDiscountAlert(true);
//       } else {
//         try {
//           await updateBookItNowMutation.mutateAsync({
//             id: property.id,
//             bookItNowEnabled: data.bookItNowEnabled,
//             bookItNowDiscountTiers: orderedTiers,
//           });
//           handleSuccessfulSubmit(data);
//         } catch (error) {
//           console.error("Error submitting form:", error);
//         }
//       }
//     },
//     [property.id, updateBookItNowMutation, isSaving, handleSuccessfulSubmit],
//   );

//   const handleCancel = useCallback(() => {
//     form.reset(originalValuesRef.current);
//     setHasUnsavedChanges(false);
//   }, [form]);

//   const handleResetToDefault = useCallback(() => {
//     setShowResetAlert(true);
//   }, []);

//   const handleConfirmReset = useCallback(() => {
//     const defaultValues = {
//       bookItNowEnabled: property.bookItNowEnabled,
//       bookItNowDiscountTiers: DEFAULT_TIERS,
//       requestToBookMaxDiscountPercentage:
//         property.requestToBookMaxDiscountPercentage,
//     };
//     form.reset(defaultValues);
//     const isChanged = checkForChanges(defaultValues);
//     setHasUnsavedChanges(isChanged);
//     setShowResetAlert(false);
//   }, [
//     form,
//     property.bookItNowEnabled,
//     property.requestToBookMaxDiscountPercentage,
//     checkForChanges,
//   ]);

//   const handleCancelReset = useCallback(() => {
//     setShowResetAlert(false);
//   }, []);

//   const handleBookItNowToggle = useCallback(
//     (checked: boolean) => {
//       if (checked) {
//         setShowEnableConfirmation(true);
//       } else {
//         form.setValue("bookItNowEnabled", false);
//         void form.handleSubmit(handleSubmit)();
//       }
//     },
//     [form, handleSubmit],
//   );

//   const handleConfirmEnableBookItNow = useCallback(() => {
//     form.setValue("bookItNowEnabled", true);
//     setShowEnableConfirmation(false);
//     void form.handleSubmit(handleSubmit)();
//   }, [form, handleSubmit]);

//   const renderDiscountTierFields = useCallback(
//     (
//       fields: FieldArrayWithId<FormSchema, "bookItNowDiscountTiers", "id">[],
//       remove: (index: number) => void,
//     ) =>
//       fields.map((field, index) => (
//         <div key={field.id} className="my-2 flex items-center space-x-2">
//           <FormField
//             control={form.control}
//             name={`bookItNowDiscountTiers.${index}.days`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     type="number"
//                     onChange={(e) => {
//                       const value = parseInt(e.target.value, 10);
//                       field.onChange(value);
//                       const currentValues = form.getValues();
//                       setHasUnsavedChanges(checkForChanges(currentValues));
//                     }}
//                     className="w-20"
//                     min="0"
//                     disabled={isSaving}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <span>days before check-in:</span>
//           <FormField
//             control={form.control}
//             name={`bookItNowDiscountTiers.${index}.percentOff`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     type="number"
//                     onChange={(e) => {
//                       const value = parseInt(e.target.value, 10);
//                       field.onChange(value);
//                       const currentValues = form.getValues();
//                       setHasUnsavedChanges(checkForChanges(currentValues));
//                     }}
//                     className="w-20"
//                     min={MIN_DISCOUNT}
//                     max={MAX_DISCOUNT}
//                     step="1"
//                     disabled={isSaving}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <span>% off</span>
//           {fields.length > MIN_TIERS && (
//             <Button
//               type="button"
//               onClick={() => {
//                 remove(index);
//                 const currentValues = form.getValues();
//                 setHasUnsavedChanges(checkForChanges(currentValues));
//               }}
//               variant="ghost"
//               className="hover:bg-transparent"
//               disabled={isSaving}
//             >
//               <X />
//             </Button>
//           )}
//         </div>
//       )),
//     [form, checkForChanges, isSaving],
//   );

//   return (
//     <div className="my-6 space-y-4">
//       <div className="text-end">
//         <HostPropertyEditBtn
//           editing={isEditing}
//           setEditing={setIsEditing}
//           property={property}
//           onSubmit={form.handleSubmit(handleSubmit)}
//         />
//       </div>

//       <div className="space-y-4 border-b pb-6">
//         <h2 className="text-lg font-semibold">Request To Book</h2>
//         <Form {...form}>
//           <form className="space-y-4">
//             <FormField
//               control={form.control}
//               name="requestToBookMaxDiscountPercentage"
//               render={({ field }) => (
//                 <FormItem className="flex items-center space-x-3">
//                   <FormControl>
//                     <Input
//                       {...field}
//                       type="number"
//                       onChange={(e) => {
//                         const value = parseInt(e.target.value, 10);
//                         field.onChange(value);
//                       }}
//                       className="w-20"
//                       min={0}
//                       max={100}
//                       disabled={!isEditing}
//                     />
//                   </FormControl>
//                   <span className={!isEditing ? "opacity-50" : ""}>
//                     % discount on Request To Book
//                   </span>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>
//       </div>

//       <div className="flex items-center space-x-4">
//         <h2 className="text-lg font-semibold">Book It Now</h2>
//         <Switch
//           className="data-[state=checked]:bg-primaryGreen"
//           checked={form.watch("bookItNowEnabled")}
//           onCheckedChange={handleBookItNowToggle}
//           disabled={isSaving || !isEditing}
//         />
//       </div>
//       {form.watch("bookItNowEnabled") && (
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-4"
//           >
//             <Accordion type="single" collapsible className="w-full">
//               <AccordionItem value="discount-tiers">
//                 <AccordionTrigger
//                   disabled={isSaving || !isEditing}
//                   className={
//                     isSaving || !isEditing
//                       ? "cursor-not-allowed opacity-50"
//                       : ""
//                   }
//                 >
//                   Discount Tiers
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   {renderDiscountTierFields(fields, remove)}
//                   {fields.length < MAX_TIERS && (
//                     <Button
//                       type="button"
//                       onClick={handleAddTier}
//                       className="mt-2"
//                       variant="outline"
//                       disabled={isSaving}
//                     >
//                       Add Tier
//                     </Button>
//                   )}
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//             {isEditing && (
//               <div className="flex justify-end">
//                 <Button
//                   type="button"
//                   onClick={handleResetToDefault}
//                   variant="outline"
//                   disabled={isSaving}
//                 >
//                   Reset to Default
//                 </Button>
//               </div>
//             )}
//           </form>
//         </Form>
//       )}

//       <AlertDialog open={showResetAlert} onOpenChange={setShowResetAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Reset to Default Settings</AlertDialogTitle>
//             <AlertDialogDescription>
//               {`Are you sure you want to reset to the default settings? This will
//               remove any custom tiers you've set up.`}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={handleCancelReset}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction onClick={handleConfirmReset}>
//               Confirm Reset
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <AlertDialog
//         open={showHighDiscountAlert}
//         onOpenChange={setShowHighDiscountAlert}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm High Discount</AlertDialogTitle>
//             <AlertDialogDescription>
//               You have set a discount of 50% or more. This is a significant
//               reduction in price. Are you sure you want to save these settings?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setShowHighDiscountAlert(false)}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={async () => {
//                 setShowHighDiscountAlert(false);
//                 await form.handleSubmit(handleSubmit)();
//               }}
//             >
//               Confirm
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <AlertDialog
//         open={showEnableConfirmation}
//         onOpenChange={setShowEnableConfirmation}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Enable Book It Now</AlertDialogTitle>
//             <AlertDialogDescription>
//               {`Enabling Book It Now will automatically apply discounts based on your
//               settings. You can turn it off at any time, but it won't affect
//               discounts already applied to bookings. Do you want to enable this
//               feature?`}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setShowEnableConfirmation(false)}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction onClick={handleConfirmEnableBookItNow}>
//               Enable Book It Now
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
