import React, { useState } from "react";
import RequestFeed from "@/components/activity-feed/RequestFeed";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import OnboardingFooter from "./OnboardingFooter";

type Props = {
  requestFeed: FeedRequestItem[];
};

const Onboarding12: React.FC<Props> = ({ requestFeed }) => {
  const [emails, setEmails] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmails(e.target.value);
  };

  return (
    <>
      <div className="flex mt-24 md:mt-0 min-h-screen flex-col md:flex-row mx-auto">

        <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center md:overflow-y-auto md:p-6">
          <div className="h-[850px] rounded-lg border px-2 py-2 shadow-xl">
            <RequestFeed requestFeed={requestFeed} />
          </div>
        </div>

        <div className="hidden md:flex md:items-center">
          <div className="h-5/6 w-px bg-black"></div>
        </div>

        <div className="flex flex-col justify-center p-4 md:w-1/2 md:p-6 md:px-16">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Know other hosts?</h2>
          <p className="mb-6 text-xl md:text-3xl">
            Every day, hundreds of requests go to waste. Invite them now to fill
            their calendar
          </p>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Host&apos;s Email Addresses</Label>
              <Textarea
                id="emails"
                placeholder="Enter email addresses, separated by commas"
                className="min-h-[6rem]"
                value={emails}
                onChange={handleEmailChange}
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
      <OnboardingFooter
        isForm={false}
      />
    </>
  );
};

export default Onboarding12;