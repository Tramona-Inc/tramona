import { Swiper, SwiperSlide } from "swiper/react";
import CondensedOfferCard from "./CondensedOfferCard";
import { api } from "@/utils/api";
import { useMemo } from "react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
// Import Swiper styles
import "swiper/css";
import { Button } from "../ui/button";
interface SimilarProperties {
  location: string | undefined;
  city: string | undefined;
}

function TestMobileSimilarProperties({ location, city }: SimilarProperties) {
  if (!location) {
    return <div>Unavailable properties for this location</div>;
  }
  const { data: coordinates } = api.offers.getCoordinates.useQuery({
    location: location!,
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
      <div className="mb-3 flex flex-row items-center justify-between text-center">
        <h1 className=" text-nowrap text-center text-sm font-semibold">
          Similar properties in {city!.split(",")[0]}{" "}
        </h1>
        <Button className="roundes col-span-2 font-semibold" variant="ghost">
          {" "}
          See more
        </Button>
      </div>
      {isLoading ? (
        <> {skeletons} </>
      ) : (
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
      )}
    </div>
  );
}

export default TestMobileSimilarProperties;
