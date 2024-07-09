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
    <div className="flex flex-col gap-y-3">
      To access this feature, please connect your Stripe account and agree to
      our terms and conditions.
      <Button onClick={handleCreateStripeConnectAccount}>
        Create Stripe Account
      </Button>
    </div>
  );
}
