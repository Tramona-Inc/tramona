import { Button } from "@/components/ui/button";
import React from "react";

interface BalanceSummaryProps {
  balance: number;
  onTransfer: () => void;
  onManagePayout: () => void;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balance,
  onTransfer,
  onManagePayout,
}) => {
  return (
    <div className="items-between mx-auto flex w-full max-w-sm flex-col rounded-lg bg-white p-6 shadow-md">
      <div className="flex w-full flex-row justify-between">
        <p className="text-base text-gray-700 xl:whitespace-nowrap">
          Current balance
        </p>
        <Button
          onClick={onTransfer}
          className="rounded-full border-primaryGreen text-primaryGreen"
          size="sm"
          variant="outline"
        >
          Transfer
        </Button>
      </div>
      <div className="font-semibol my-2 text-center text-4xl">
        ${balance.toFixed(2)}
      </div>
      <Button
        onClick={onManagePayout}
        className="text-sm text-gray-500 underline hover:text-gray-700"
        variant="link"
      >
        Manage payout account
      </Button>
    </div>
  );
};

export default BalanceSummary;
