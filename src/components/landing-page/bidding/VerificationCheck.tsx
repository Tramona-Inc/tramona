import IdentityModal from "@/components/_utils/IdentityModal";
import { api } from "@/utils/api";
import { loadStripe } from "@stripe/stripe-js";
import {env} from '@/env'
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
import { Property } from "@/server/db/schema";

function VerificationCheck({property}: {property:Property}) {
    const {data: users} = api.users.myVerificationStatus.useQuery()

  return (
    <div className="flex flex-col gap-y-4">
        <div className="text-lg">
            You need to be verified before you can make a bid.
        </div>
      <IdentityModal stripePromise={stripePromise}/>
    </div>
  )
}

export default VerificationCheck