import { useState, useEffect } from "react";
import { X, Search, Calendar, Users2, DollarSign } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import DateRangeInput from "@/components/_common/DateRangeInput";
import PlacesInput from "@/components/_common/PlacesInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCityRequestForm } from "../SearchBars/useCityRequestForm";
import { api } from "@/utils/api";
import RequestSubmittedDialog from "@/components/landing-page/SearchBars/DesktopRequestComponents/RequestSubmittedDialog";

interface MobileSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSearchDialog({
  open,
  onOpenChange,
}: MobileSearchDialogProps) {
  const [activeTab, setActiveTab] = useState<"search" | "request">("search");
  const [requestSubmittedDialogOpen, setRequestSubmittedDialogOpen] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupId, setMadeByGroupId] = useState<number>();
  const [_inviteLink, setInviteLink] = useState<string | null>(null);

  const { form, onSubmit } = useCityRequestForm({
    afterSubmit() {
      setRequestSubmittedDialogOpen(true);
      setShowConfetti(true);
    },
    setMadeByGroupId,
  });

  const inviteLinkQuery = api.groups.generateInviteLink.useQuery(
    { groupId: madeByGroupId! },
    { enabled: madeByGroupId !== undefined },
  );

  useEffect(() => {
    if (inviteLinkQuery.data) {
      setInviteLink(inviteLinkQuery.data.link);
    }
  }, [inviteLinkQuery.data]);

  const { latLng, radius } = form.watch();

  return (
    <>
      {/* Search Bar Trigger */}
      <div
        onClick={() => onOpenChange(true)}
        className="flex w-full cursor-pointer items-center rounded-full border bg-white px-4 py-3 shadow-lg md:hidden"
      >
        <Search className="mr-3 h-5 w-5 text-gray-400" />
        <span className="text-gray-500">Search or Request a deal</span>
      </div>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="fixed inset-0 h-full w-full border-none bg-white p-0">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white p-4">
            <div className="flex items-center justify-between">
              <button onClick={() => onOpenChange(false)}>
                <X className="h-5 w-5" />
              </button>
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("search")}
                  className={cn(
                    "border-b-2 pb-2",
                    activeTab === "search"
                      ? "border-black font-semibold"
                      : "border-transparent text-gray-500",
                  )}
                >
                  Search Properties
                </button>
                <button
                  onClick={() => setActiveTab("request")}
                  className={cn(
                    "border-b-2 pb-2",
                    activeTab === "request"
                      ? "border-black font-semibold"
                      : "border-transparent text-gray-500",
                  )}
                >
                  Request deal
                </button>
              </div>
              <div className="w-5" />
            </div>
          </div>

          {/* Content */}
          {activeTab === "search" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col space-y-8">
                {/* Location Section */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Location</h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Enter your destination"
                      className="h-14 rounded-full border-gray-200 bg-white pl-12 text-base"
                    />
                  </div>
                </div>

                {/* Dates Section */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Dates</h3>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Select dates"
                      className="h-14 rounded-full border-gray-200 bg-white pl-12 text-base"
                    />
                  </div>
                </div>

                {/* Travelers Section */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Travelers</h3>
                  <div className="relative">
                    <Users2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Add guests"
                      className="h-14 rounded-full border-gray-200 bg-white pl-12 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Search Footer */}
              <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t bg-white p-4">
                <Button variant="ghost" className="text-base font-medium">
                  Clear all
                </Button>
                <Button className="rounded-full bg-black px-8 py-3 text-base">
                  Search
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <Form {...form}>
                <form onSubmit={onSubmit} className="flex flex-col space-y-8">
                  {/* Location Section */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Location</h3>
                    <PlacesInput
                      control={form.control}
                      latLng={latLng}
                      setLatLng={(latLng) => form.setValue("latLng", latLng)}
                      radius={radius}
                      setRadius={(radius) => form.setValue("radius", radius)}
                      name="location"
                      variant="mobile"
                      placeholder="Enter your destination"
                      className="relative h-14 w-full rounded-full border border-gray-200 bg-white"
                      inputClassName="h-14 rounded-full border-0 pl-12 text-base placeholder:text-gray-500"
                    />
                  </div>

                  {/* Dates Section */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Dates</h3>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DateRangeInput
                              {...field}
                              variant="mobile"
                              placeholder="Select dates"
                              className="h-14 rounded-full border-gray-200 pl-12 text-base"
                              disablePast
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Travelers Section */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Travelers</h3>
                    <FormField
                      control={form.control}
                      name="numGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Users2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="Add guests"
                                className="h-14 rounded-full border-gray-200 bg-white pl-12 text-base"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Name your price Section */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Name your price</h3>
                    <FormField
                      control={form.control}
                      name="maxNightlyPriceUSD"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="Price/night"
                                className="h-14 rounded-full border-gray-200 bg-white pl-12 text-base"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>

                {/* Request Footer */}
                <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t bg-white p-4">
                  <Button
                    variant="ghost"
                    onClick={() => form.reset()}
                    className="text-base font-medium"
                  >
                    Clear all
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    className="rounded-full bg-black px-8 py-3 text-base"
                  >
                    Request deal
                  </Button>
                </div>

                <RequestSubmittedDialog
                  open={requestSubmittedDialogOpen}
                  setOpen={setRequestSubmittedDialogOpen}
                  showConfetti={showConfetti}
                  madeByGroupId={madeByGroupId}
                  location={form.getValues("location")}
                  isRequestsPage={false}
                />
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
