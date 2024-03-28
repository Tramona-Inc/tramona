import MainLayout from "@/components/_common/Layout/MainLayout";
import OfferCard from "@/components/offer-card/OfferCard";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function hostProperties() {
  const { data: session } = useSession();
  const { data: properties } = api.properties.getManyByHostId.useQuery({
    hostId: session?.user.id ?? null,
  });

  return (
    <MainLayout>
      <div>
        <h1>hello</h1>
        {/* {void console.log("properties:", properties)} */}
        {properties?.map((property) => (
          <div>
            <h1>{property.name}</h1>
            <img src={property.imageUrls[0]} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
