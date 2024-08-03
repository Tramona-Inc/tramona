import React, { useEffect, useRef } from 'react';
import { api, type RouterOutputs } from "@/utils/api";
import FeedRequestCard from "@/components/activity-feed/FeedRequestCard";
import Spinner from "../_common/Spinner";

export type FeedItem = RouterOutputs["feed"]["getFeed"][number];
type RequestItem = Extract<FeedItem, { type: "request" }>;

export default function RequestFeed() {
  const { data: feed } = api.feed.getFeed.useQuery({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollElement = scrollRef.current;
    let animationFrameId: number;
    let lastTime = performance.now();
    const scrollSpeed = 50; // px's per second

    const scroll = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      scrollAccumulator.current += (scrollSpeed * deltaTime) / 1000;

      if (scrollAccumulator.current >= 1) {
        const scrollAmount = Math.floor(scrollAccumulator.current);
        scrollAccumulator.current -= scrollAmount;

        if (scrollElement.scrollTop + scrollElement.clientHeight + scrollAmount >= scrollElement.scrollHeight) {
          // loop back to top
          scrollElement.scrollTop = 0;
        } else {
          scrollElement.scrollTop += scrollAmount;
        }
      }

      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [feed]);

  if (!feed) return <Spinner />;

  const requestItems = feed.filter((item): item is RequestItem => item.type === "request");

  return (
    <div ref={scrollRef} className="h-[500px] overflow-y-hidden">
      <div className="space-y-4">
        {requestItems.map((item) => (
          <FeedRequestCard key={item.uniqueId} request={item} />
        ))}
      </div>
    </div>
  );
}