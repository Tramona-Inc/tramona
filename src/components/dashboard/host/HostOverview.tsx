import Spinner from "@/components/_common/Spinner";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostPotentialBookingOverview from "../../host/overview/potential-booking-overview/HostPotentialBookingOverview";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import AttentionOverviewSection from "@/components/host/attention-required/AttentionOverviewSection";
import HostStaysOverview from "@/components/host/overview/HostStaysOverview";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Controller } from "react-hook-form";
export default function HostOverview() {
  useSetInitialHostTeamId();
  const { currentHostTeamId } = useHostTeamStore();
  const { data: session } = useSession({
    required: true,
  });
  const { data: user } = api.users.getUser.useQuery();
  const { data: hostTeam } = api.hostTeams.getHostTeam.useQuery({
    currentHostTeamId: currentHostTeamId!,
  });
  const updateHostTeam = api.hostTeams.updateHostTeamWithOfferPercentage.useMutation();

  const [open, setOpen] = useState(true);
  const form = useForm({
    defaultValues: {
      offerPercentage: 0,
    },
  });
  const onSubmit = async (data: {offerPercentage: number}) => {

    updateHostTeam.mutate({
      id: currentHostTeamId!,
      offerPercentage: data.offerPercentage,
    });
    setOpen(false);
  };
  return session ? (
    <>
      {hostTeam && hostTeam.hasOfferPercentage === false && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <div className="flex flex-col gap-4">
              <p>Please set up your offer percentage.</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormItem>
                    <FormLabel>Offer Percentage</FormLabel>
                    <FormControl>
                      <Controller
                        name="offerPercentage"
                        control={form.control}
                        rules={{
                          required: true,
                          min: 0,
                          max: 100,
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter offer percentage"
                            className="text-black"
                            value={field.value === 0 ? "" : field.value} // Show empty string when cleared
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100)) {
                                field.onChange(value === "" ? "" : Number(value));
                              }
                            }}
                            onBlur={() => {
                              if (String(field.value) === "") {
                                field.onChange(0); // Reset to 0 only when the field is blurred
                              }
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </FormItem>
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      onClick={() => {
                        void form.handleSubmit(onSubmit)();
                      }}
                    >
                      {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="mx-auto mt-8 min-h-screen-minus-header max-w-8xl space-y-20 p-4 pb-32">
        <div className="space-y-8 lg:space-y-20">
          <h1 className="text-3xl font-semibold md:text-5xl">
            Welcome back, {user?.firstName ? user.firstName : "Host"}!{" "}
          </h1>
          <AttentionOverviewSection currentHostTeamId={currentHostTeamId} />
        </div>

        <HostStaysOverview currentHostTeamId={currentHostTeamId} />
        <HostPotentialBookingOverview
          currentHostTeamId={currentHostTeamId}
          className="flex-col lg:flex lg:flex-1"
        />
        <div className="flex flex-col gap-4 lg:flex-row">
          <HostPropertiesOverview currentHostTeamId={currentHostTeamId} />
        </div>
      </div>
    </>
  ) : (
    <Spinner />
  );
}

// add more spacking on bottom of reservatiions
