import React from "react";
import RequestFeed from "@/components/activity-feed/RequestFeed";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";

type Props = {
  requestFeed: FeedRequestItem[];
};

const InviteHosts: React.FC<Props> = ({ requestFeed }) => {
  const router = useRouter();

  const handleSkip = () => {
    void router.push("/host/properties");
  };

  return (
    <div className="relative min-h-screen mx-auto">
      <div className="absolute right-4 top-4 z-10">
        <Button variant="ghost" onClick={handleSkip}>
          Skip
        </Button>
      </div>
      <div className="flex mt-24 md:mt-0 min-h-screen flex-col md:flex-row">
        {/* Left side: RequestFeed (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center md:overflow-y-auto md:p-6">
          <div className="h-[850px] rounded-lg border px-2 py-2 shadow-xl">
            <RequestFeed requestFeed={requestFeed} />
          </div>
        </div>

        {/* Divider (hidden on mobile) */}
        <div className="hidden md:flex md:items-center">
          <div className="h-5/6 w-px bg-black"></div>
        </div>

        {/* Right side: Invite form */}
        <div className="flex flex-col justify-center p-4 md:w-1/2 md:p-6 md:px-16">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Know other hosts?</h2>
          <p className="mb-6 text-xl md:text-3xl">
            Every day, hundreds of requests go to waste. Invite them now to fill
            their calendar
          </p>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="emails"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Host&apos;s Email Addresses
              </label>
              <Input
                id="emails"
                type="text"
                placeholder="Enter email addresses, separated by commas"
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
              <Button
                type="submit"
                className="w-full bg-primaryGreen text-white md:flex-1"
              >
                Send invites
              </Button>
              <Button variant="outline" className="w-full md:flex-1">
                Share Link
              </Button>
            </div>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Earn a feeless booking for each friend that&apos;s added
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteHosts;