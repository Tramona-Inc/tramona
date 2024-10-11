import FeedRequestCard from "@/components/activity-feed/FeedRequestCard";
import Marquee from "src/components/_common/MarqueeVertical";
import { type FeedRequestItem } from "./ActivityFeed";

export default function RequestFeed({
  requestFeed,
}: {
  requestFeed: FeedRequestItem[];
}) {
  return (
    <Marquee vertical className="h-full [--duration:100s]">
      {requestFeed.map((request, index) => (
        <FeedRequestCard key={index} request={request} />
      ))}
    </Marquee>
  );
}
