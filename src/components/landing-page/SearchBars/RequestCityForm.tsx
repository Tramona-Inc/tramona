import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
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
  Users2Icon,
} from "lucide-react";
import { useCityRequestForm } from "./useCityRequestForm";
import { CityRequestFiltersDialog } from "./CityRequestFiltersDialog";
import { api } from "@/utils/api";
import RequestSubmittedDialog from "@/components/landing-page/SearchBars/DesktopRequestComponents/RequestSubmittedDialog";

const RequestCityForm = forwardRef(
  (
    {
      isRequestsPage = false,
      onLoadingChange,
    }: {
      isRequestsPage?: boolean;
      onLoadingChange: (isLoading: boolean) => void;
    },
    ref: React.Ref<any>,
  ) => {
    const [requestSubmittedDialogOpen, setRequestSubmittedDialogOpen] =
      useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [madeByGroupId, setMadeByGroupId] = useState<number>();
    const [_inviteLink, setInviteLink] = useState<string | null>(null);
    const { form, onSubmit, isSubmitting } = useCityRequestForm({
      afterSubmit() {
        setRequestSubmittedDialogOpen(true);
        setShowConfetti(true);
      },
      setMadeByGroupId,
    });

    //for landing page
    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(async () => {
        try {
          onLoadingChange(true);
          await onSubmit(); // Call `onSubmit` with the form data
        } finally {
          onLoadingChange(false);
        }
      }),
      isLoading: form.formState.isSubmitting, // Expose the loading state to the parent
    }));

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
      <Form {...form}>
        <form onSubmit={onSubmit} className="w-full space-y-2">
          <PlacesInput
            control={form.control}
            latLng={latLng}
            setLatLng={(latLng) => form.setValue("latLng", latLng)}
            radius={radius}
            setRadius={(radius) => form.setValue("radius", radius)}
            name="location"
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
                    placeholder="Name your price"
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

          {isRequestsPage && (
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {!isSubmitting ? (
                "Submit request"
              ) : (
                <div className="flex h-full items-center justify-center space-x-2">
                  <span className="mr-2 text-white">Submitting Request</span>
                  <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
                  <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
                  <div className="h-1 w-1 animate-bounce rounded-full bg-white"></div>
                </div>
              )}
            </Button>
          )}
        </form>

        <RequestSubmittedDialog
          open={requestSubmittedDialogOpen}
          setOpen={setRequestSubmittedDialogOpen}
          showConfetti={showConfetti}
          madeByGroupId={madeByGroupId}
          location={form.getValues("location")}
          isRequestsPage={isRequestsPage}
        />
      </Form>
    );
  },
);

RequestCityForm.displayName = "RequestCityForm";

export default RequestCityForm;
