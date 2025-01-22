import { api } from "@/utils/api";
import { MyUserWProfile } from "../dashboard/host/profile/AllFieldDialogs";
import { Card, CardContent, CardTitle } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Spinner from "../_common/Spinner";
import ProfilePropertyCard from "./ProfilePropertyCard";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";

export default function ListingsCarousel({
  userProfile,
}: {
  userProfile: MyUserWProfile;
}) {
  const { currentHostTeamId } = useHostTeamStore();

  const { data: myProperties } = api.properties.getHostProperties.useQuery({
    currentHostTeamId: currentHostTeamId ?? 0,
    limit: 4,
  });

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

  const chunkedProperties = chunkArray(myProperties ?? [], 4);

  return (
    <Card className="relative">
      <CardTitle className="font-semibold">{`${userProfile.user.name}'s Listings`}</CardTitle>
      <CardContent>
        {myProperties ? (
          <Carousel>
            <CarouselContent>
              {chunkedProperties.map((chunk, index) => (
                <CarouselItem key={index}>
                  <div className="grid grid-cols-4 items-center gap-4">
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
            <div className="absolute -top-5 right-12">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}
