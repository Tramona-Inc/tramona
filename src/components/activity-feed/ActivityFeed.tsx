import Head from "next/head";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import FeedRequestCard from "@/components/activity-feed/RequestCard";

export type RequestCardDataType = {
  uniqueId: string;
  id: number;
  location: string;
  maxTotalPrice: number;
  checkIn: Date;
  checkOut: Date;
  createdAt: Date;
};

export type OfferCardDataType = {
  uniqueId: string;
  id: number;
  createdAt: Date;
  propertyId: number;
  totalPrice: number;
  property: { imageUrls: string[]; originalNightlyPrice: number | null };
};

type MergedDataType = RequestCardDataType | OfferCardDataType | null;

export default function ActivityFeed() {
  const { data: feed, isLoading: loadingFeed } = api.feed.getFeed.useQuery({});
  const [mergedData, setMergedData] = useState<MergedDataType[]>([]);

  useEffect(() => {
    if (!loadingFeed && feed) {
      const mergedData = [
        ...feed.groupedRequests?.map((item) => ({
          ...item,
          uniqueId: `req-${item.id}`,
        })),
        ...feed.matches?.map((item) => ({
          ...item,
          uniqueId: `off-${item.id}`,
        })),
        // ...feed.bookings?.map((item) => ({ ...item, uniqueId: `book-${item.id}` })),
      ];
      mergedData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      console.log("mergedData: ", mergedData);
      setMergedData(mergedData);
    }
  }, [loadingFeed, feed]);

  return (
    <>
      <div className="max-w-lg space-y-4 overflow-y-auto">
        {mergedData &&
          mergedData.map((item) => {
            if (item && item.uniqueId.slice(0, 3) === "req") {
              return (
                <div key={item.uniqueId} className="cursor-pointer">
                  <FeedRequestCard request={item as RequestCardDataType} />
                </div>
              );
            }
            return null;
          })}
      </div>
    </>
  );
}
