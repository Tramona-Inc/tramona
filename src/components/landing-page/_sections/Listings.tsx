import Spinner from "@/components/_common/Spinner";
import { type Property } from "@/server/db/schema";
import { api } from "@/utils/api";
import HomeOfferCard from "../HomeOfferCard";
export default function Listings() {
  const { data: propertiesArray } = api.properties.getAll.useQuery();

  

  const propertyCards = propertiesArray?.map((property: Property) => (
    <HomeOfferCard key={property.id} property={property} />
  ));

  return (
    <div>
      {propertyCards ? (
        <div className="grid gap-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {propertyCards}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
