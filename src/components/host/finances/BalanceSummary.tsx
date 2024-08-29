import Spinner from "@/components/_common/Spinner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/utils";
import {
  ConnectAccountManagement,
  ConnectPayouts,
} from "@stripe/react-connect-js";
import { useState, useEffect } from "react";
import NoStripeAccount from "./NoStripeAccount";

interface BalanceSummaryProps {
  balance: number | null;
  isStripeConnectInstanceReady: boolean;
  stripeAccountIdNumber: null | string | undefined;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balance,
  isStripeConnectInstanceReady,
  stripeAccountIdNumber,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="items-between mx-auto flex w-full flex-col rounded-xl border border-border bg-white p-6">
      <div className="flex w-full flex-row justify-between">
        <p className="text-base text-gray-700 xl:whitespace-nowrap">
          Current balance
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <div className="rounded-full border border-primaryGreen px-4 tracking-tight hover:bg-zinc-100">
              Transfer
            </div>
          </DialogTrigger>
          <DialogContent className="min-h-84">
            <div className="">
              <h1 className="my-3text-center text-2xl font-bold"> Transfer </h1>
              {isStripeConnectInstanceReady ? (
                <ConnectPayouts />
              ) : stripeAccountIdNumber ? (
                <div className="h-96">
                  {" "}
                  Not ready <Spinner />{" "}
                </div>
              ) : (
                <NoStripeAccount />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="font-semibol my-2 text-center text-4xl">
        {balance ? formatCurrency(balance) : "0.00"}
      </div>
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogTrigger>
          <div className="text-[#7E7564] underline underline-offset-4">
            Manage payout accounts
          </div>
        </DialogTrigger>
        <DialogContent>
          <div className="">
            <h1 className="my-3 text-center text-2xl font-bold">
              Manage Payouts
            </h1>
            {isStripeConnectInstanceReady ? (
              <ConnectAccountManagement
                collectionOptions={{
                  fields: "eventually_due",
                  futureRequirements: "include",
                }}
              />
            ) : stripeAccountIdNumber ? (
              <div className="h-96">
                Not ready <Spinner />{" "}
              </div>
            ) : (
              <NoStripeAccount />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BalanceSummary;
