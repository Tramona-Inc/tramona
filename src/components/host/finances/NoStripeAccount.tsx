import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export default function NoStripeAccount() {
  const { mutate: createStripeConnectAccount } =
    api.stripe.createStripeConnectAccount.useMutation();
  const { data: hostInfo } = api.host.getUserHostInfo.useQuery();

  const handleCreateStripeConnectAccount = useCallback(() => {
    if (!hostInfo?.stripeAccountId) {
      createStripeConnectAccount();
    }
  }, [hostInfo?.stripeAccountId, createStripeConnectAccount]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center rounded-lg bg-white p-8 text-center shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Connect Your Stripe Account</h2>
      <p className="mb-6 text-gray-600">
        To more seamlessly manage your finances, please connect your Stripe
        account.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <BenefitCard
          title="Secure Payments"
          description="Receive payments safely and securely from travelers worldwide."
        />
        <BenefitCard
          title="24/7 Support"
          description="Access round-the-clock customer support for any payment-related issues."
        />
        <BenefitCard
          title="Financial Insights"
          description="Gain valuable analytics and reporting tools to track your earnings."
        />
      </div>

      <Button onClick={handleCreateStripeConnectAccount} className="">
        Connect Stripe Account
      </Button>

      <p className="mt-4 text-sm text-gray-500">
        By connecting your account, you agree to Stripe&apos;s Terms of Service
        and Privacy Policy.
      </p>
    </div>
  );
}

interface BenefitCardProps {
  title: string;
  description: string;
}

function BenefitCard({ title, description }: BenefitCardProps) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
      <h3 className="mb-1 mt-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
