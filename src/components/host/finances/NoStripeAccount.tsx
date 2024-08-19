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
    <div className="flex flex-col items-center max-w-2xl mx-auto text-center p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Connect Your Stripe Account</h2>
      <p className="text-gray-600 mb-6">
        To more seamlessly manage your finances, please connect your Stripe account.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      
      <Button 
        onClick={handleCreateStripeConnectAccount}
        className=""
      >
        Connect Stripe Account
      </Button>
      
      <p className="mt-4 text-sm text-gray-500">
        By connecting your account, you agree to Stripe's Terms of Service and Privacy Policy.
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
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mt-2 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}