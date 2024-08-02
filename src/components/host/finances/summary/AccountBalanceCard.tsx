import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/utils";
import type Stripe from "stripe";

const AmountDisplay = ({
  title,
  items,
}: {
  title: string;
  items: Stripe.Balance.Available[] | undefined;
}) => (
  <div>
    <CardTitle className="text-sm font-bold text-gray-600">{title}</CardTitle>
    {items && items.length > 0 ? (
      items.map((item) => (
        <div
          key={`${item.currency}-${title.toLowerCase()}`}
          className="font-semibold"
        >
          {item.currency === "usd" ? formatCurrency(item.amount) : item.amount}{" "}
          {item.currency.toUpperCase()}
        </div>
      ))
    ) : (
      <p className="text-xs text-gray-500">None</p>
    )}
  </div>
);

const ExternalAccount = ({
  account,
}: {
  account: Stripe.BankAccount | Stripe.Card;
}) => (
  <div className="text-xs">
    {"bank_name" in account ? (
      <>
        <span className="font-semibold">{account.bank_name}</span> •{" "}
        <span className="text-gray-600">
          {account.last4} • {account.routing_number} • {account.status}
        </span>
      </>
    ) : (
      <>
        <span className="font-semibold">{account.brand}</span> •{" "}
        <span className="text-gray-600">
          {account.last4} • Expires: {account.exp_month}/{account.exp_year}
        </span>
      </>
    )}
  </div>
);

interface AccountBalanceCardProps {
  accountBalance: Stripe.Response<Stripe.Balance> | undefined;
  externalBanks: Stripe.ExternalAccount[] | undefined;
}

const AccountBalanceCard = ({
  accountBalance,
  externalBanks,
}: AccountBalanceCardProps) => {
  return (
    <Card className="w-full border border-border shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-primary">
          Account Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <AmountDisplay title="Pending" items={accountBalance?.pending} />
          <AmountDisplay title="Available" items={accountBalance?.available} />
          <AmountDisplay
            title="Instant Available"
            items={accountBalance?.instant_available}
          />
        </div>
        <div>
          <CardTitle className="mb-1 text-sm font-bold text-gray-600">
            Connected Accounts
          </CardTitle>
          {externalBanks && externalBanks.length > 0 ? (
            <div className="space-y-1">
              {externalBanks.map((account) => (
                <ExternalAccount key={account.id} account={account} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No connected accounts</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountBalanceCard;
