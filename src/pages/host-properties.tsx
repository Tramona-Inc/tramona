import MainLayout from "@/components/_common/Layout/MainLayout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function hostProperties() {
  const { data: properties } = api.properties.getManyByHostId.useQuery();

  return (
    <MainLayout>
      <div>
        {properties?.map((property) => (
          <div>
            <h1>{property.name}</h1>
            <img src={property.imageUrls[0]} />
            <p>{property.areaDescription}</p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
