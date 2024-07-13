import Head from "next/head";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import FeedRequestCard from "@/components/activity-feed/RequestCard";
import FeedOfferCard from "@/components/activity-feed/OfferCard";
import FeedBookingCard from "@/components/activity-feed/BookingCard";

export type RequestCardDataType = {
  uniqueId: string;
  id: number;
  location: string;
  maxTotalPrice: number;
  checkIn: Date;
  checkOut: Date;
  createdAt: Date;
  madeByGroup: {
    owner: { id: string; name: string | null; image: string | null };
  };
  type: string;
  isFiller: boolean;
};

export type OfferCardDataType = {
  uniqueId: string;
  id: number;
  createdAt: Date;
  requestId: number | null;
  propertyId: number;
  totalPrice: number;
  checkIn: Date;
  checkOut: Date;
  property: {
    id: number;
    imageUrls: string[];
    originalNightlyPrice: number | null;
  };
  request: {
    madeByGroup: {
      owner: { id: string; name: string | null; image: string | null };
    };
  } | null;
  type: string;
  isFiller: boolean;
};

export type BookingCardDataType = {
  uniqueId: string;
  id: number;
  createdAt: Date;
  checkIn: Date;
  checkOut: Date;
  group: {
    owner: { id: string; name: string | null; image: string | null };
  };
  offer: { totalPrice: number } | null;
  property: {
    id: number;
    imageUrls: string[];
    originalNightlyPrice: number | null;
    city: string;
  };
  type: string;
  isFiller: boolean;
};
export type MergedDataType =
  | RequestCardDataType
  | OfferCardDataType
  | BookingCardDataType
  | null;

export default function ActivityFeed({fillerOnly = false}: {fillerOnly?: boolean}) {
  const { data: feed, isLoading: loadingFeed } = api.feed.getFeed.useQuery({});

  const filteredData = fillerOnly
  ? feed?.mergedData.filter((item) => item.isFiller)
  : feed?.mergedData;
  
  return (
    <>
      <div className="max-w-lg space-y-4 overflow-y-auto">
        {!loadingFeed &&
          filteredData?.map((item) => {
            switch (item.type) {
              case "request":
                return (
                  <div key={item.uniqueId}>
                    <FeedRequestCard request={item as RequestCardDataType} />
                  </div>
                );
              case "offer":
                return (
                  <div key={item.uniqueId}>
                    <FeedOfferCard offer={item as OfferCardDataType} />
                  </div>
                );
              case "booking":
                return (
                  <div key={item.uniqueId}>
                    <FeedBookingCard
                      booking={item as BookingCardDataType}
                    />
                  </div>
                );
            }
          })}
      </div>
    </>
  );
}
