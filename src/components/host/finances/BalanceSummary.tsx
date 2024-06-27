import Spinner from "@/components/_common/Spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  ConnectAccountManagement,
  ConnectPayouts,
} from "@stripe/react-connect-js";
import React, { useState, useEffect } from "react";

interface BalanceSummaryProps {
  balance: number | null;
  isStripeConnectInstanceReady: boolean;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balance,
  isStripeConnectInstanceReady,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="items-between mx-auto flex w-full flex-col rounded-lg bg-white p-6 shadow-md">
      <div className="flex w-full flex-row justify-between">
        <p className="text-base text-gray-700 xl:whitespace-nowrap">
          Current balance
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button
              className="rounded-full border-primaryGreen text-primaryGreen"
              size="sm"
              variant="outline"
            >
              Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="min-h-84">
            <div>
              <h1 className="my-3 text-center text-2xl font-bold">
                {" "}
                Transfer{" "}
              </h1>
              {isStripeConnectInstanceReady ? (
                <ConnectPayouts />
              ) : (
                <div className="h-96">
                  {" "}
                  Not ready <Spinner />{" "}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="font-semibol my-2 text-center text-4xl">
        ${balance ? balance.toFixed(2) : "0.01"}
      </div>
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogTrigger>
          <Button
            className="text-sm text-gray-500 underline hover:text-gray-700"
            variant="link"
          >
            Manage Payouts
          </Button>
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
            ) : (
              <div className="h-96">
                Not ready <Spinner />{" "}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BalanceSummary;
