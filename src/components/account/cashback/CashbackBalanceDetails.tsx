import NoStripeAccount from "@/components/host/finances/NoStripeAccount";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/utils";
import { api } from "@/utils/api";
import {
  ConnectAccountManagement,
  ConnectAccountOnboarding,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import Link from "next/link";

export default function CashbackBalanceDetails({
  balance,
  totalBookingVolume,
}: {
  balance: number | undefined;
  totalBookingVolume: number | undefined;
}) {
  const { data: user } = api.users.getUser.useQuery();
  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold lg:text-2xl">Cash Back</h1>
      <div className="rounded-lg border p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:block">
            <div className="flex items-baseline justify-between lg:block">
              <h1 className="font-semibold">Current balance</h1>
              <p className="pt-1 text-2xl font-bold lg:text-3xl">
                {balance ? formatCurrency(balance) : "$0.00"}
              </p>
            </div>

            <Button
              variant="link"
              className="px-0 text-muted-foreground underline"
            >
              <Link href="/account/payout">View payout history</Link>
            </Button>
          </div>
          <div className="lg:block">
            <div className="flex items-baseline justify-between lg:block">
              <h1 className="font-semibold">Total Booking Volume</h1>
              <p className="pt-1 text-2xl font-bold lg:text-3xl">
                {totalBookingVolume
                  ? formatCurrency(totalBookingVolume)
                  : "$0.00"}
              </p>
            </div>
          </div>
          <div className="mt-4 lg:mt-0 lg:text-end">
            {isStripeConnectInstanceReady && user?.chargesEnabled ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full font-bold lg:w-auto"
                  >
                    Cashback Account Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <ConnectAccountManagement />
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full font-bold lg:w-auto"
                  >
                    Setup Cashback Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col items-center justify-center">
                    {!user?.stripeConnectId && <NoStripeAccount />}
                    {isStripeConnectInstanceReady &&
                      user &&
                      !user.chargesEnabled && (
                        <ConnectAccountOnboarding
                          onExit={() => {
                            window.location.reload(); //default behavior we should change if ugly
                          }}
                        />
                      )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
