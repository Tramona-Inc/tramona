import CondensedOfferCard from "./property-cards/CondensedOfferCard";
import { api } from "@/utils/api";
import { useMemo } from "react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import "swiper/css";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface SimilarProperties {
  location: string;
  city: string;
}

function MobileSimilarProperties({ location, city }: SimilarProperties) {
  const { data: properties, isFetching } =
    api.properties.getAllInfiniteScroll.useInfiniteQuery(
      {
        // lat: coordinates?.coordinates.location?.lat,
        // long: coordinates?.coordinates.location?.lng,
        radius: 25,
      },
      { refetchOnWindowFocus: false },
    );
  const currentProperties = useMemo(
    () => properties?.pages.flatMap((page) => page.data) ?? [],
    [properties],
  );
  if (!location) {
    return <div>Unavailable properties for this location</div>;
  }
  const skeletons = (
    <>
      <div>
        <Skeleton className="mb-2 h-20 rounded-md" />
        <SkeletonText />
      </div>
      <div>
        <Skeleton className="mb-2 h-20 rounded-md" />
        <SkeletonText />
      </div>
      <div>
        <Skeleton className="mb-2 h-20 rounded-md" />
        <SkeletonText />
      </div>
    </>
  );

  return (
    <div>
      <div className="mb-3 flex flex-row items-center gap-2 px-1">
        <h3 className="text-nowrap text-sm font-semibold">
          Similar properties in {city.split(",")[0]}{" "}
        </h3>
        {currentProperties.length > 0 && (
          <Link className="font-bold" href="/">
            See more
          </Link>
        )}
      </div>
      <div>
        <ScrollArea className="p-2">
          <div className="flex w-max gap-2">
            {isFetching ? (
              skeletons
            ) : currentProperties.length > 0 ? (
              // <Swiper spaceBetween={8} slidesPerView={3}>
              currentProperties.slice(0, 12).map((property) => (
                //     <SwiperSlide key={property.id}>
                <CondensedOfferCard key={property.id} property={property} />
                //     </SwiperSlide>
                // </Swiper>
              ))
            ) : (
              <div className="w-96 text-sm">
                There are currently no properties available for bidding, please
                wait 24 hours and we will have properties for your request.
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default MobileSimilarProperties;
