import FeedRequestCard from "@/components/activity-feed/FeedRequestCard";
import Marquee from "src/components/_common/MarqueeVertical";
import { type FeedRequestItem } from "./ActivityFeed";

export default function RequestFeed({
  requests,
}: {
  requests: FeedRequestItem[];
}) {
  return (
    <Marquee pauseOnHover vertical className="h-[450px] [--duration:500s]">
      {requests.map((request, index) => (
        <FeedRequestCard key={index} request={request} />
      ))}
    </Marquee>
  );
}
