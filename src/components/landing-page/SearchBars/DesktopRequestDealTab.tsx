import React, { useState, useEffect } from "react";
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
  MailIcon,
} from "lucide-react";
import { useCityRequestForm } from "./useCityRequestForm";
import Link from "next/link";
import Confetti from "react-confetti";
import { CityRequestFiltersDialog } from "./CityRequestFiltersDialog";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";

export function DesktopRequestDealTab() {
  const [curTab, setCurTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupIds, setMadeByGroupIds] = useState<number[]>([]);
  const [emails, setEmails] = useState<string[]>([""]);
  const [link, setLink] = useState(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);

  const { form, onSubmit } = useCityRequestForm({ setCurTab, afterSubmit });

  const inviteLinkQuery = api.groups.generateInviteLink.useQuery(
    { groupId: groupId! },
    { enabled: groupId !== null },
  );

  useEffect(() => {
    if (inviteLinkQuery.data) {
      setInviteLink(inviteLinkQuery.data.link);
    }
  }, [inviteLinkQuery.data]);

  function afterSubmit(madeByGroupIds?: number[]) {
    if (madeByGroupIds !== undefined) {
      setMadeByGroupIds(madeByGroupIds);
      setGroupId(madeByGroupIds[0] ?? null);
    }
    setOpen(true);
    setShowConfetti(true);
  }

  const handleCopyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => {
          toast({
            title: "Link copied to clipboard!",
          });
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

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

  const handleInvite = async () => {
    if (madeByGroupIds.length === 0) {
      toast({ title: "Group IDs not available" });
      return;
    }

    setIsLoading(true);
    try {
      for (const email of emails) {
        for (const groupId of madeByGroupIds) {
          if (email.length > 0) {
            await inviteUserByEmail.mutateAsync({ email, groupId });
          }
        }
      }
      toast({ title: "Invites sent successfully!" });
    } catch (error) {
      toast({ title: "Error sending invites" });
    } finally {
      setIsLoading(false);
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
                requirements. To check out matches{" "}
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
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => handleEmailChange(index, event.target.value)}
                            placeholder={`johndoe@gmail.com`}
                            className={`w-full ${index !== 0 ? "pr-16" : ""}`}
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
                {inviteLink && (
                  <button
                    className="m-0 mt-2 flex flex-row items-center p-0 text-sm text-blue-500"
                    onClick={handleCopyToClipboard}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy invite link
                  </button>
                )}
                <Button
                  onClick={handleInvite}
                  className="mt-2 h-12 w-full rounded-md bg-[#004236] hover:bg-[#004236]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 animate-spin fill-[#004236] text-gray-200"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
              <div className="block md:hidden">
                <div className="space-y-2 p-2">
                  {inviteLink && (
                    <Button
                      onClick={async () => {
                        try {
                          if (navigator.share) {
                            await navigator.share({
                              title:
                                "Tramona is a platform that connects travelers with hosts to create unique deals for short-term stays. Check it out!",
                              url: inviteLink,
                            });
                            toast({ title: "Link shared successfully!" });
                          } else {
                            await navigator.clipboard.writeText(inviteLink);
                            toast({ title: "Link copied to clipboard!" });
                          }
                        } catch (error: unknown) {
                          const errorMessage =
                            error instanceof Error ? error.message : "Unknown error";
                          toast({
                            title: "Error sharing link",
                            description: errorMessage,
                          });
                        }
                      }}
                      className="flex w-full items-center justify-center bg-[#004236] hover:bg-[#004236]"
                    >
                      <ShareIcon color="white" className="mr-2" />
                      Share a link
                    </Button>
                  )}
                  {/* <Button
                    variant="secondary"
                    onClick={() => {}}
                    className="flex w-full items-center justify-center"
                  >
                    <ContactRoundIcon className="mr-2" />
                    Add from contacts
                  </Button> */}
                  <div className="inline-flex w-full items-center justify-center">
                    <hr className="my-8 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
                    <span className="absolute left-1/2 -translate-x-1/2 bg-background px-3 font-medium text-gray-900 ">
                      or
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEmailFormVisible(!isEmailFormVisible)}
                    className="flex w-full items-center justify-center"
                  >
                    <MailIcon className="mr-2" />
                    Add by email
                  </Button>

                  {isEmailFormVisible && (
                    <div className="space-y-2">
                      {emails.map((email, index) => (
                        <div key={index} className="relative">
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                value={email}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  handleEmailChange(index, event.target.value)
                                }
                                placeholder={`johndoe@gmail.com`}
                                className={`w-full ${index !== 0 ? "pr-16" : ""}`}
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
                      <Button
                        onClick={handleInvite}
                        className="mt-2 h-12 w-full rounded-md bg-[#004236] hover:bg-[#004236]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 animate-spin fill-[#004236] text-gray-200"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="mb-16 flex flex-row items-center rounded-lg bg-[#F1F5F5] p-4 text-sm text-black md:mb-2">
                <Sparkles className="mr-2" />
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