import { Swiper, SwiperSlide } from "swiper/react";
import CondensedOfferCard from "./property-cards/CondensedOfferCard";
import { api } from "@/utils/api";
import { useMemo } from "react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
// Import Swiper styles
import "swiper/css";
import Link from "next/link";
interface SimilarProperties {
  location: string;
  city: string;
}

function MobileSimilarProperties({ location, city }: SimilarProperties) {
  const { data: coordinates } = api.offers.getCoordinates.useQuery({
    location: location,
  });

  const { data: properties, isLoading } =
    api.properties.getAllInfiniteScroll.useInfiniteQuery({
      lat: coordinates?.coordinates.lat,
      long: coordinates?.coordinates.lng,
      radius: 25,
    });
  const currentProperties = useMemo(
    () => properties?.pages.flatMap((page) => page.data) ?? [],
    [properties],
  );
  if (!location) {
    return <div>Unavailable properties for this location</div>;
  }
  const skeletons = (
    <Swiper
      spaceBetween={8}
      slidesPerView={3}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>
        <Skeleton className="mb-2 h-[80px]" />
        <SkeletonText />
      </SwiperSlide>
      <SwiperSlide>
        <Skeleton className="mb-2 h-[80px]" />
        <SkeletonText />
      </SwiperSlide>
      <SwiperSlide>
        <Skeleton className="mb-2 h-[80px]" />
        <SkeletonText />
      </SwiperSlide>
    </Swiper>
  );

  return (
    <div>
      <div className="mb-3 flex flex-row items-center justify-between px-1 text-center">
        <h1 className=" text-nowrap text-center text-sm font-semibold">
          Similar properties in {city.split(",")[0]}{" "}
        </h1>
        {currentProperties.length > 0 && (
          <Link className="roundes col-span-2 font-bold" href="/">
            {" "}
            See more
          </Link>
        )}
      </div>
      {isLoading ? (
        <> {skeletons} </>
      ) : currentProperties.length > 0 ? (
        <Swiper
          spaceBetween={8}
          slidesPerView={3}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {currentProperties.slice(0, 12).map((property, index) => (
            <SwiperSlide key={index}>
              <CondensedOfferCard key={property.id} property={property} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-sm">
          There are currently no properties available for bidding, please wait
          24 hours and we will have properties for your request.
        </div>
      )}
    </div>
  );
}

export default MobileSimilarProperties;
