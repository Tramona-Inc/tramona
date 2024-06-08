import React, { useState } from "react";
import DateRangeInput from "@/components/_common/DateRangeInput";
import PlacesInput from "@/components/_common/PlacesInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  DollarSignIcon,
  FilterIcon,
  Link2,
  MapPinIcon,
  Plus,
  Users2Icon,
  CircleCheckBig,
  LinkIcon,
  Sparkles,
  MinusIcon,
  ShareIcon,
  ContactRoundIcon,
  MailIcon
} from "lucide-react";
import { useCityRequestForm } from "./useCityRequestForm";
import Link from "next/link";
import Confetti from "react-confetti";
import { CityRequestFiltersDialog } from "./CityRequestFiltersDialog";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";

export function DesktopRequestDealTab() {
  const [curTab, setCurTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [emails, setEmails] = useState<string[]>([""]);

  function afterSubmit() {
    setOpen(true);
    setShowConfetti(true);
  }

  const { form, onSubmit } = useCityRequestForm({ setCurTab, afterSubmit });

  const [link, setLink] = useState(false);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    if (emails.length < 3) {
      setEmails([...emails, ""]);
    }
  };

  const removeEmailField = (index: number) => {
    if (index !== 0) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const inviteUserByEmail = api.groups.inviteUserByEmail.useMutation();

  const handleInvite = async (groupId: number) => {
    try {
      for (const email of emails) {
        await inviteUserByEmail.mutateAsync({ email, groupId });
      }
      toast({ title: "Invites sent successfully!" });
    } catch (error) {
      toast({ title: "Error sending invites" });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-between gap-y-4"
          key={curTab} // rerender on tab changes (idk why i have to do this myself)
        >
          {/* <RequestTabsSwitcher
            curTab={curTab}
            setCurTab={setCurTab}
            form={form}
          /> */}

          <div className="flex flex-col gap-2">
            <PlacesInput
              control={form.control}
              name={`data.${curTab}.location`}
              formLabel="Location"
              variant="lpDesktop"
              placeholder="Select a location"
              icon={MapPinIcon}
            />

            <FormField
              control={form.control}
              name={`data.${curTab}.date`}
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
              name={`data.${curTab}.numGuests`}
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
              name={`data.${curTab}.maxNightlyPriceUSD`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Maximum nightly price"
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

            <div className="flex items-center gap-2 text-teal-900">
              <CityRequestFiltersDialog form={form} curTab={curTab}>
                <Button
                  variant="ghost"
                  type="button"
                  className="px-2 text-teal-900 hover:bg-teal-900/15"
                >
                  <FilterIcon />
                  More filters
                </Button>
              </CityRequestFiltersDialog>
            </div>

            <div className="space-y-1">
              <p className="text-sm">
                Have a property you like? We&apos;ll send your request directly
                to the host.
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
                <div className="flex">
                  <div className="basis-full">
                    <FormField
                      control={form.control}
                      name={`data.${curTab}.airbnbLink`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Paste property link here (optional)"
                              className="w-full"
                              icon={Link2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      setLink(!link);
                      form.setValue(`data.${curTab}.airbnbLink`, "");
                    }}
                    className="font-bold text-teal-900"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-end sm:justify-start">
              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="mt-2 h-12 w-full rounded-md bg-teal-900 hover:bg-teal-950 sm:w-auto sm:rounded-full lg:rounded-md"
              >
                Submit Request
              </Button>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <div className="mb-4 flex flex-row items-center text-center text-2xl font-bold">
                <CircleCheckBig color="#528456" className="mr-2" /> Request
                sent!
              </div>
              <p className="mb-4 ml-8">
                We sent your request out to every host in{" "}
                <b>{form.getValues(`data.${curTab}.location`)}</b>. In the next
                24 hours, hosts will send you properties that match your
                requirements. To check out matches {" "}
                <Link
                  href="/requests"
                  className="font-semibold text-neutral-900 underline"
                >
                  click here
                </Link>
                .
              </p>
              <hr className="my-4 bg-[#D9D6D1]"></hr>
              <h1 className="text-xl font-bold">Want $0 fees on this trip?</h1>
              <p>
                Add your friends so they can see the matches and stay informed
                with the trip details.
              </p>
              <div className="hidden md:block">
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div key={index} className="relative">
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          value={email}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleEmailChange(index, event.target.value)}
                          placeholder={`johndoe@gmail.com`}
                          className={`w-full ${
                            index !== 0 ? "pr-16" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => removeEmailField(index)}
                        className="absolute right-2 top-3 items-center text-sm text-red-500 hover:text-red-700"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {emails.length < 3 && (
                  <Button variant="secondary" onClick={addEmailField}>
                    <Plus size={20} />
                    Add another email
                  </Button>
                )}
              </div>
              <button
                className="text-blue-500 text-sm p-0 m-0 flex flex-row items-center mt-2"
                onClick={() => navigator.clipboard.writeText("invite link")}
              >
                <LinkIcon className="mr-2 h-4 w-4"/>
                Copy invite link
              </button>
              <Button
                onClick={() => alert(`Invite sent to ${emails.join(", ")}`)}
                className="mt-2 h-12 w-full rounded-md bg-[#004236] hover:bg-[#004236]"
              >
                Send
              </Button>
              </div>
              <div className="md:hidden block">
              <div className="space-y-2 p-2">
                <Button onClick={() => {}} className="flex items-center justify-center w-full bg-[#004236] hover:bg-[#004236">
                  <ShareIcon color="white" className="mr-2" />
                  Share a link
                </Button>
                <Button variant="secondary" onClick={() => {}} className="flex items-center justify-center w-full">
                  <ContactRoundIcon className="mr-2" />
                  Add from contacts
                </Button>
                <Button variant="secondary" onClick={() => {}} className="flex items-center justify-center w-full">
                  <MailIcon className="mr-2" />
                  Add by email
                </Button>
              </div>
              </div>
              <p className="mb-16 md:mb-2 p-4 text-sm text-black bg-[#F1F5F5] rounded-lg flex flex-row items-center">
                <Sparkles className="mr-2"/>
                Once everyone is added to the trip, Tramona removes all fees.
              </p>

              {showConfetti && (
                <div className="z-100 pointer-events-none fixed inset-0">
                  <Confetti width={window.innerWidth} recycle={false} />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </>
  );
}