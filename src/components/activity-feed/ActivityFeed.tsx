import { api, type RouterOutputs } from "@/utils/api";
import FeedRequestCard from "@/components/activity-feed/FeedRequestCard";
import FeedOfferCard from "@/components/activity-feed/FeedOfferCard";
import FeedBookingCard from "@/components/activity-feed/FeedBookingCard";
import ActivityFeedSkeleton from "./ActivityFeedSkeleton";

export type FeedItem = RouterOutputs["feed"]["getFeed"][number];
export type FeedRequestItem = Extract<FeedItem, { type: "request" }>;
export type FeedOfferItem = Extract<FeedItem, { type: "offer" }>;
export type FeedBookingItem = Extract<FeedItem, { type: "booking" }>;

export default function ActivityFeed({
  fillerOnly = false,
}: {
  fillerOnly?: boolean;
}) {
  const { data: feed } = api.feed.getFeed.useQuery({});

  if (!feed) return <ActivityFeedSkeleton />;

  const dataInDisplay = fillerOnly
    ? feed.filter((item) => item.isFiller)
    : feed;

  // only display the last 50 items
  if (dataInDisplay.length > 50) {
    dataInDisplay.splice(50);
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 overflow-y-auto">
      {dataInDisplay.map((item) => {
        switch (item.type) {
          case "request":
            return <FeedRequestCard key={item.uniqueId} request={item} />;
          case "offer":
            return <FeedOfferCard key={item.uniqueId} offer={item} />;
          case "booking":
            return <FeedBookingCard key={item.uniqueId} booking={item} />;
        }
      })}
    </div>
  );
}
