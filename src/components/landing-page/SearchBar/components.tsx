// these are the components for the link scraping stuff
// that we decided to put on hold

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { ChevronDown, X } from "lucide-react";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { z } from "zod";
// import { zodString } from "@/utils/zod-utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { api } from "@/utils/api";
// import { TRPCError } from "@trpc/server";
// import { errorToast } from "@/utils/toasts";
// import { type MultiCityRequestFormValues } from "../SearchOrReq/schemas";

// export function AirbnbLinkDialog({
//   parentForm,
//   curTab,
// }: {
//   parentForm: ReturnType<typeof useForm<MultiCityRequestFormValues>>;
//   curTab: number;
// }) {
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const utils = api.useUtils();

//   const formSchema = z.object({
//     airbnbLink: zodString({ maxLen: 512 }),
//   });

//   type FormSchema = z.infer<typeof formSchema>;

//   const form = useForm<FormSchema>({
//     resolver: zodResolver(formSchema),
//   });

//   const onSubmit = async (data: FormSchema) => {
//     const response = await utils.misc.scrapeUsingLink.fetch({
//       url: data.airbnbLink,
//     });

//     if (response instanceof TRPCError) {
//       errorToast("Couldn't retrieve data from AirBnB, please try again.");
//     } else {
//       // parentForm.setValue(`airbnbLink`, data.airbnbLink);
//       parentForm.setValue(
//         `maxNightlyPriceUSD`,
//         response.nightlyPrice,
//       );
//       parentForm.setValue(`location`, response.propertyName);
//       parentForm.setValue(`date.from`, response.checkIn);
//       parentForm.setValue(`date.to`, response.checkOut);
//       parentForm.setValue(`numGuests`, response.numGuests);

//       setDialogOpen(false);
//     }
//   };

//   return (
//     <div>
//       {parentForm.getValues(`airbnbLink`) === undefined ? (
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           className="rounded-full text-xs"
//           onClick={() => setDialogOpen(true)}
//         >
//           Add a Link
//           <ChevronDown />
//         </Button>
//       ) : (
//         <Button
//           type="button"
//           variant="secondary"
//           size="sm"
//           className="rounded-full text-xs "
//           onClick={() => setDialogOpen(true)}
//         >
//           <X />
//           {parentForm.getValues(`airbnbLink`)!.substring(0, 50)}
//           ...
//         </Button>
//       )}

//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent>
//           <DialogTitle>Add an Airbnb link</DialogTitle>
//           <p className="my-2">
//             Are you currently eyeing any properties on Airbnb? Enter the link
//             below and we will try to get you that exact stay at a discount!
//           </p>

//           <Form {...form}>
//             <form className="flex flex-col gap-4">
//               <FormField
//                 control={form.control}
//                 name={"airbnbLink"}
//                 defaultValue={parentForm.getValues(`airbnbLink`)}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Link</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         type="text"
//                         inputMode="url"
//                         placeholder="Enter link"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 onClick={form.handleSubmit((data) => onSubmit(data))}
//                 disabled={form.formState.isSubmitting}
//                 className="rounded-full"
//               >
//                 {form.formState.isSubmitting ? "Crunching data..." : "Add"}
//               </Button>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export function AirbnbLinkPopover({
//   parentForm,
//   curTab,
// }: {
//   parentForm: ReturnType<typeof useForm<MultiCityRequestFormValues>>;
//   curTab: number;
// }) {
//   const utils = api.useUtils();

//   const formSchema = z.object({
//     airbnbLink: zodString({ maxLen: 512 }),
//   });

//   type FormSchema = z.infer<typeof formSchema>;

//   const form = useForm<FormSchema>({
//     resolver: zodResolver(formSchema),
//   });

//   const onSubmit = async (data: FormSchema) => {
//     const response = await utils.misc.scrapeUsingLink.fetch({
//       url: data.airbnbLink,
//     });

//     if (response instanceof TRPCError) {
//       errorToast("Couldn't retrieve data from AirBnB, please try again.");
//     } else {
//       parentForm.setValue(`airbnbLink`, data.airbnbLink);
//       parentForm.setValue(
//         `maxNightlyPriceUSD`,
//         response.nightlyPrice,
//       );
//       parentForm.setValue(`location`, response.propertyName);
//       parentForm.setValue(`date.from`, response.checkIn);
//       parentForm.setValue(`date.to`, response.checkOut);
//       parentForm.setValue(`numGuests`, response.numGuests);
//     }
//   };

//   return (
//     <div>
//       <Popover>
//         <PopoverTrigger asChild>
//           {parentForm.getValues(`airbnbLink`) === undefined ? (
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               className="rounded-full border-none bg-accent text-xs"
//             >
//               Add a link
//               <ChevronDown size={20} />
//             </Button>
//           ) : (
//             <Button
//               type="button"
//               variant="secondary"
//               size="sm"
//               className="rounded-full text-xs"
//             >
//               <X />
//               {parentForm
//                 .getValues(`airbnbLink`)!
//                 .substring(0, 50)}
//               ...
//             </Button>
//           )}
//         </PopoverTrigger>
//         <PopoverContent align="start" className="w-96 bg-white ">
//           <Form {...form}>
//             <form className="flex flex-col gap-4 bg-white">
//               <FormField
//                 control={form.control}
//                 name={"airbnbLink"}
//                 defaultValue={parentForm.getValues(`airbnbLink`)}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       <div className="mb-4 flex  flex-row justify-between">
//                         <div className=" h-full items-center text-primary">
//                           Airbnb Link
//                         </div>
//                         <button className="text-[#004236] ">Clear</button>
//                       </div>
//                     </FormLabel>
//                     <FormControl>
//                       <Input {...field} type="text" placeholder="Enter link" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 onClick={form.handleSubmit((data) => onSubmit(data))}
//                 disabled={form.formState.isSubmitting}
//                 className="rounded-full"
//               >
//                 {form.formState.isSubmitting ? "Crunching data..." : "Done"}
//               </Button>
//             </form>
//           </Form>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
