import type { FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ReferFolks() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Handle sending invite here
  };
  return (
    <div className="space-y-4 rounded-xl bg-white px-10 py-6 shadow-md">
      <h2 className="text-4xl font-bold">Refer the folks you know</h2>
      <p className="text-xl text-primary">
        Earn <strong className="text-2xl">30%</strong> of what we make off
        everyone you refer
      </p>
      <div className="flex flex-col space-y-8 rounded-xl bg-white px-8 py-4 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Label htmlFor="email">Email your friend</Label>
          <div className="flex space-x-3">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Friend's Email"
            />
            <Button type="submit">Send Invite</Button>
          </div>

          <p className="py-2">or</p>

          <Label htmlFor="referralCode">Share your referral code</Label>
          <Input
            id="referralCode"
            name="referralCode"
            type="text"
            value="aslkfjqwerq"
            className="text-muted-foreground"
            disabled
          />
        </form>
      </div>
    </div>
  );
}
