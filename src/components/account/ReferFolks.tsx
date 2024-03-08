import type { FormEvent } from "react";
import { useSession } from "next-auth/react";

// import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Spinner from "../_common/Spinner";

import { api } from "@/utils/api";

export default function ReferFolks() {
  const { data: session } = useSession();

  const { data, isLoading } = api.users.myReferralCode.useQuery();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Handle sending invite here
  };
  return (
    <div className="space-y-4 rounded-xl bg-white px-5 py-6 shadow-md lg:px-10">
      <h2 className="text-3xl font-bold lg:text-4xl">
        Refer the folks you know
      </h2>
      <p className="text-md text-primary lg:text-xl">
        Earn{" "}
        <strong className="text-lg lg:text-2xl">
          {session?.user.referralTier === "Ambassador" ? "50" : "30"}%
        </strong>{" "}
        of what we make off everyone you refer
      </p>
      <div className="flex flex-col space-y-8 rounded-xl bg-white px-8 py-4 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* <Label htmlFor="email">Email your friend</Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Friend's Email"
            className="basis-full"
          />
          <Button type="submit" className="flex-grow-0">
            Send Invite
          </Button>

          <p className="py-2 text-sm font-semibold">OR</p> */}

          <Label htmlFor="referralCode">Share your referral code</Label>
          {isLoading ? (
            <Spinner />
          ) : (
            <Input
              id="referralCode"
              name="referralCode"
              type="text"
              value={data?.referralCode}
              className="text-muted-foreground"
              disabled
            />
          )}
        </form>
      </div>
    </div>
  );
}
