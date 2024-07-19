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
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  DollarSignIcon,
  FilterIcon,
  MapPinIcon,
  Plus,
  Users2Icon,
} from "lucide-react";
import { useCityRequestForm } from "./useCityRequestForm";
import { CityRequestFiltersDialog } from "./CityRequestFiltersDialog";
import { toast } from "@/components/ui/use-toast";
import { api, type RouterOutputs } from "@/utils/api";
import { Separator } from "@/components/ui/separator";
import RequestSubmittedDialog from "@/components/landing-page/SearchBars/DesktopRequestComponents/RequestSubmittedDialog";
import { cn } from "@/utils/utils";
import AddAirbnbLink from "@/components/link-input/AddAirbnbLink";
import { set } from "lodash";

export default function RequestCityForm({
  isLinkActive,
  setIsLinkActive,
}: {
  isLinkActive: boolean;
  setIsLinkActive: (val: boolean) => void;
}) {
  const [requestSubmittedDialogOpen, setRequestSubmittedDialogOpen] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupId, setMadeByGroupId] = useState<number>();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetOpen = (val: boolean) => {
    setRequestSubmittedDialogOpen(true);
  };
  const handleShowConfetti = (val: boolean) => {
    setShowConfetti(val);
  };

  const cityForm = useCityRequestForm({
    afterSubmit,
    handleSetOpen,
    handleShowConfetti,
  });

  const { form, onSubmit } = cityForm;

  const inviteLinkQuery = api.groups.generateInviteLink.useQuery(
    { groupId: groupId! },
    { enabled: groupId !== null },
  );

  useEffect(() => {
    if (inviteLinkQuery.data) {
      setInviteLink(inviteLinkQuery.data.link);
    }
  }, [inviteLinkQuery.data]);

  function afterSubmit(madeByGroupId?: number) {
    if (madeByGroupId !== undefined) {
      setMadeByGroupId(madeByGroupId);
      setGroupId(madeByGroupId);
    }
  }

  const inviteUserByEmail = api.groups.inviteUserByEmail.useMutation();

  const handleInvite = async () => {
    if (!madeByGroupId) {
      toast({ title: "Group IDs not available" });
      return;
    }

    setIsLoading(true);
    // try {
    //   for (const email of emails) {
    //     for (const groupId of madeByGroupId) {
    //       if (email.length > 0) {
    //         await inviteUserByEmail.mutateAsync({ email, groupId });
    //       }
    //     }
    //   }
    //   toast({ title: "Invites sent successfully!" });
    // } catch (error) {
    //   toast({ title: "Error sending invites" });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const formData = form.watch();

  const handleAddLinkClick = () => {
    setIsLinkActive(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-between gap-y-4"
      >
        <div
          className={cn(
            "space-y-2",
            isLinkActive && "placeholder-black opacity-50",
          )}
        >
          <PlacesInput
            control={form.control}
            name={`location`}
            formLabel="Location"
            variant="lpDesktop"
            placeholder="Select a location"
            icon={MapPinIcon}
          />

          <FormField
            control={form.control}
            name={`date`}
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
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`numGuests`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    label="Guests"
                    placeholder="Add guests"
                    icon={Users2Icon}
                    variant="lpDesktop"
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`maxNightlyPriceUSD`}
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
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2 text-teal-900">
            <CityRequestFiltersDialog form={form}>
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
        </div>
        <div className="flex flex-row items-center justify-center gap-x-4 text-zinc-400">
          <Separator className="w-2/5 bg-zinc-400" />
          <p> or </p>
          <Separator className="w-2/5 bg-zinc-400" />
        </div>
        <div className="space-y-1">
          <p className="text-pretty text-sm">
            Have a property you like? We&apos;ll send your request directly to
            the host.
          </p>
          {!isLinkActive && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddLinkClick}
            >
              <Plus size={20} />
              Add link
            </Button>
          )}
        </div>
        {/* <div className="flex justify-end sm:justify-start">
          <Button
            type="submit"
            size="lg"
            variant="greenPrimary"
            disabled={form.formState.isSubmitting}
            className="mt-2"
          >
            Submit Request
          </Button>
        </div> */}
      </form>

      <RequestSubmittedDialog
        open={requestSubmittedDialogOpen}
        setOpen={setRequestSubmittedDialogOpen}
        showConfetti={showConfetti}
        madeByGroupId={madeByGroupId}
        form={form}
      />
    </Form>
  );
}
