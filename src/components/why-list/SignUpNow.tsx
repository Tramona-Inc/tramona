import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import RequestFeed from "@/components/activity-feed/RequestFeed";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const SignUpNow = ({ requestFeed }: { requestFeed: FeedRequestItem[] }) => {
  return (
    <section className="flex justify-center">
      <div className="mx-12 flex flex-col justify-center gap-8 md:mx-36 lg:mx-24 lg:max-w-[70vw] lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-20 mt-10 text-center text-lg font-medium md:text-2xl">
            Tramona charges 5-10% less in fees than other platforms, while
            offering $50,000 in protection per booking. Allowing hosts and
            travelers to earn more on the same booking elsewhere.
          </h1>
          <div className="h-[450px] rounded-lg border px-2 py-2 shadow-xl">
            <RequestFeed requestFeed={requestFeed} />
          </div>
          <h2 className="mb-12 mt-12 text-center text-2xl font-medium">
            Everyday we have requests that go un-booked.
          </h2>
          <div className="mb-2 flex justify-center">
            <Link href="/host-onboarding">
              <Button size="lg" className="bg-primaryGreen text-white">
                Sign up and start earning more
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};