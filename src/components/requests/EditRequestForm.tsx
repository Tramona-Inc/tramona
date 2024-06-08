import { Total } from "@/components/landing-page/search/MobilePropertyFilter";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { getNumNights } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  DollarSignIcon,
  Link2,
  MapPinIcon,
  Plus,
  Users2Icon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import DateRangeInput from "../_common/DateRangeInput";
import PlacesInput from "../_common/PlacesInput";
import { editCityRequestSchema } from "../landing-page/SearchBars/schemas";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogClose, DialogFooter } from "../ui/dialog";
import Confetti from "react-confetti";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { type DetailedRequest, type RequestWithUser } from "./RequestCard";
import { useMediaQuery } from '@/components/_utils/useMediaQuery'
import Link from 'next/link';
import { InputLink } from '@/components/landing-page/SearchBars/inputLink'

export default function EditRequestForm({
  request,
  setOpen,
}: {
  request: DetailedRequest | RequestWithUser;
  setOpen: (open: boolean) => void;
}) {
  const formSchema = editCityRequestSchema;
  const [ afterRequestEdit, SetAfterRequestEdit ] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestId: request.id,
      location: request.location,
      date: { from: request.checkIn, to: request.checkOut },
      numGuests: request.numGuests,
      maxNightlyPriceUSD:
        request.maxTotalPrice /
        getNumNights(request.checkIn, request.checkOut) /
        100,
      minNumBedrooms: request.minNumBedrooms ?? 0,
      minNumBeds: request.minNumBeds ?? 0,
      minNumBathrooms: request.minNumBathrooms ?? 0,
      airbnbLink: request.airbnbLink ?? "",
      note: request.note ?? "",
    },
  });

  const [link, setLink] = useState<boolean>(request.airbnbLink ? true : false);

  const { mutate } = api.requests.editRequest.useMutation({
    onSuccess: () => {
      // setOpen(false);
      toast({
        title: "Successfully edited requests",
        description: "Your request has been updated!",
      });
    },
    onError: () => {
      errorToast("Couldn't update your request");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ ...values });
    SetAfterRequestEdit(true)
    setShowConfetti(true)
    setTimeout(() => {
      if(!afterRequestEdit) {
        setOpen(false)
      }
    }, 5000)
  }
  const isMobile = useMediaQuery("(max-width: 578px)")

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <div className="flex flex-col gap-2">
            <PlacesInput
              control={form.control}
              name={"location"}
              formLabel="Location"
              variant="lpDesktop"
              placeholder="Select a location"
              icon={MapPinIcon}
            />

            <FormField
              control={form.control}
              name={"date"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateRangeInput
                      {...field}
                      label="Check in/out"
                      icon={CalendarIcon}
                      variant="lpDesktop"
                      disablePast
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"numGuests"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Guests"
                      placeholder="Add guests"
                      icon={Users2Icon}
                      variant="lpDesktop"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"maxNightlyPriceUSD"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Maximum price"
                      placeholder="Price per night"
                      suffix="/night"
                      icon={DollarSignIcon}
                      variant="lpDesktop"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isMobile ? 
            <div className="flex flex-cols-2 gap-2">
              <FormField
                control={form.control}
                name={"minNumBeds"}
                render={({ field }) => (
                  <FormItem className="h-10 rounded-lg border px-1">
                    <FormControl>
                      <Total
                        className="text-xs font-bold"
                        name="Beds"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                        size="size-2/5"
                        textSize="text-[0.45em]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"minNumBedrooms"}
                render={({ field }) => (
                  <FormItem className="h-10 rounded-lg border px-1">
                    <FormControl>
                      <Total
                        className="text-xs font-bold"
                        name="Bedrooms"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                        size="size-2/5"
                        textSize="text-[0.45em]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"minNumBathrooms"}
                render={({ field }) => (
                  <FormItem className="h-10 rounded-lg border px-1">
                    <FormControl>
                      <Total
                        className="text-xs font-bold"
                        name="Bathrooms"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                        size="size-2/5"
                        textSize="text-[0.45em]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            :
            <div className="flex gap-2 justify-between flex-col w-auto">
            <FormField
              control={form.control}
              name={'minNumBeds'}
              render={({ field }) => (
                <FormItem className="rounded-lg border px-2">
                  <FormControl>
                    <Total
                      className="text-sm font-bold pr-8"
                      name="Beds"
                      optional={true}
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                      size="size-3/5"
                      textSize="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={'minNumBedrooms'}
              render={({ field }) => (
                <FormItem className="rounded-lg border px-2">
                  <FormControl>
                    <Total
                      className="text-sm font-bold"
                      name="Bedrooms"
                      optional={true}
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                      size="size-3/5"
                      textSize="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={'minNumBathrooms'}
              render={({ field }) => (
                <FormItem className="rounded-lg border px-2">
                  <FormControl>
                    <Total
                      className="text-sm font-bold"
                      name="Bathrooms"
                      optional={true}
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                      size="size-3/5"
                      textSize="text-xs"
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            </div>
            }

            <div className="space-y-1">
            <p className="text-xs">
                Already have a property you like? Tramona will get you the same property, or their next door neighbour
              </p>
              {!link && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setLink(!link)}
                >
                  <Plus size={20} />
                  Add link
                </Button>
              )}
              {link && (
                <div className="flex flex-row h-7">
                  {/* <div className="basis-full"> */}
                    <FormField
                      control={form.control}
                      name={'airbnbLink'}
                      render={({ field }) => (
                        <FormItem className="basis-full rounded-lg border justify-center items-center">
                          <FormControl>
                            <div className="flex rounded-lg border h-7">
                            <div><p className="h-[1.6rem] rounded-s-lg bg-slate-200 px-1">Airbnb.com/</p></div>
                            <InputLink
                              {...field}
                              placeholder="Paste Airbnb link"
                              className="bg-background"
                            />
                            {/* <input type="text" placeholder="Paste Airbnb link"/> */}
                            </div>
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                  {/* </div> */}
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      setLink(!link);
                      form.setValue('airbnbLink', "");
                    }}
                    className="font-bold text-teal-900 h-7"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
              {/* <DialogClose asChild> */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="rounded-md bg-teal-900 hover:bg-teal-950 sm:rounded-full lg:rounded-md"
              >
                Edit Request
              </Button>
              {/* </DialogClose> */}
            </DialogFooter>
            <Dialog open={afterRequestEdit} onOpenChange={SetAfterRequestEdit}>
            <DialogContent>
              <h1 className="mb-4 text-center text-2xl font-bold">
                Your Request has been editted successfully
              </h1>
              <p className="mb-4">
                We have sent it out to every host in{" "}
                <b>{form.getValues("location")}</b>.
              </p>
              <p className="mb-4">
                In the next 24 hours, hosts will send you properties that match
                your requirements. To check out matches,{" "}
                <Link
                  href="/requests"
                  className="font-semibold text-teal-700 underline"
                >
                  click here
                </Link>
                .
              </p>
              <p className="mb-6">
                In the meantime, check out some other properties we have on
                Tramona and make more requests.
              </p>
              <Button
                asChild
                className="rounded-lg bg-teal-900 px-4 py-2 text-white hover:bg-teal-950"
              >
                Explore more properties
              </Button>

              {showConfetti && (
                <div className="z-100 pointer-events-none fixed inset-0">
                  <Confetti width={window.innerWidth} recycle={false} />
                </div>
              )}
            </DialogContent>
          </Dialog>
          </div>
        </form>
      </Form>
    </>
  );
}
