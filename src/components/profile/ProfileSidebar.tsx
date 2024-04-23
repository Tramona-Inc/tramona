import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import UserAvatar from "../_common/UserAvatar";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/env";
import IdentityModal from "../_utils/IdentityModal";
import { BadgeCheck } from "lucide-react";
import { api } from "@/utils/api";

export default function ProfileSidebar() {
  const { data: session } = useSession({ required: true });
  const {data: user} = api.users.myVerificationStatus.useQuery()
  const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);


  return (
    <div className="hidden w-96 justify-center bg-black pt-32 lg:flex">
      {session?.user && (
        <div className="flex flex-col text-white">
          <div className="flex items-center justify-center">
            <UserAvatar
              size="huge"
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
            />
          </div>
          <div>
            <div className="my-4">
              <p className="text-3xl font-bold">{session.user.name}</p>
              <p className="text-base">
                Member since{" "}
                {new Date(session.user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            {user?.isIdentityVerified === 'true' ? (
              <div className="flex flex-row gap-x-1 mb-2 items-center justify-center">
                Verified
                <BadgeCheck className="text-green-600"/>
              </div>
            ) : (
              <IdentityModal stripePromise={stripePromise} />
            )}
            <Button
              onClick={() => signOut()}
              variant="secondary"
              className="w-full gap-2"
            >
              <div className="-scale-x-100">
                <LogOutIcon />
              </div>
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
