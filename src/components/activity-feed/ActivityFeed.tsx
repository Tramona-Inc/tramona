import { api, type RouterOutputs } from "@/utils/api";
import FeedRequestCard from "@/components/activity-feed/FeedRequestCard";
import FeedOfferCard from "@/components/activity-feed/FeedOfferCard";
import FeedBookingCard from "@/components/activity-feed/FeedBookingCard";
import Spinner from "../_common/Spinner";

export type FeedItem = RouterOutputs["feed"]["getFeed"][number];

export default function ActivityFeed() {
  const { data: feed } = api.feed.getFeed.useQuery({});

  if (!feed) return <Spinner />;

  return (
    <div className="space-y-4">
      {feed.map((item) => {
        switch (item.type) {
          case "request":
            return <FeedRequestCard key={item.uniqueId} request={item} />;
          case "offer":
            return <FeedOfferCard key={item.uniqueId} offer={item} />;
          case "booking":
            return <FeedBookingCard key={item.uniqueId} confirmation={item} />;
        }
      })}
    </div>
  );
}
