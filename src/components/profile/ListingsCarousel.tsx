import { api } from "@/utils/api";
import { useIsLg, useIsMd } from "@/utils/utils";
import { MyUserWProfile } from "../dashboard/host/profile/AllFieldDialogs";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ProfilePropertyCard from "./ProfilePropertyCard";

export default function ListingsCarousel({
  userWProfile,
}: {
  userWProfile: MyUserWProfile;
}) {
  const { data: myProperties } =
    api.properties.getAllPropertiesFromAllTeamsFromHostId.useQuery(
      userWProfile.user.id,
      { enabled: !!userWProfile.user.id },
    );

  console.log(myProperties);

  function chunkArray<T>(array: T[], size: number): T[][] {
    return array.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = [];
      }
      chunks[chunkIndex].push(item);
      return chunks;
    }, [] as T[][]);
  }

  const isMd = useIsMd();
  const isLg = useIsLg();
  const chunkedProperties = chunkArray(
    myProperties ?? [],
    isLg ? 4 : isMd ? 3 : 2,
  );

  return (
    <div className="">
      {myProperties && myProperties.length > 0 ? (
        <div className="relative max-w-5xl p-3">
          <div className="my-5 text-xl font-semibold lg:text-2xl">
            {`${userWProfile.user.firstName}'s Listings`}
          </div>
          <div>
            <Carousel>
              <CarouselContent>
                {chunkedProperties.map((chunk, index) => (
                  <CarouselItem key={index}>
                    <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {chunk.map((property) => (
                        <ProfilePropertyCard
                          key={property.id}
                          property={property}
                        />
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {myProperties.length > 5 && (
                <div className="absolute -top-6 right-12">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              )}
            </Carousel>
          </div>
        </div>
      ) : null}
    </div>
  );
}
