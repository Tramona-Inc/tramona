import NoStripeAccount from "@/components/host/finances/NoStripeAccount";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/utils";

export default function CashbackBalanceDetails({
  balance,
  totalBookingVolume,
}: {
  balance: number | undefined;
  totalBookingVolume: number | undefined;
}) {
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

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="px-0 text-muted-foreground underline"
                >
                  Manage payout account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="border-b pb-2 text-center font-bold">
                  Coming Soon!
                </DialogHeader>
                <NoStripeAccount />
              </DialogContent>
            </Dialog>
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
                <NoStripeAccount />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/*<div>
         <p className="text-md font-medium text-primary lg:text-xl">
          Your next $90 check will be sent by 02/15/2024
        </p> 
      </div>*/}
      </div>
    </div>
  );
}
