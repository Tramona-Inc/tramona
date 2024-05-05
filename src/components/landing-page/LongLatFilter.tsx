import { api } from "@/utils/api";
import HomeOfferCard from "./HomeOfferCard";

export default function Listings() {
  const { data: currentProperties } = api.properties.getCities.useQuery();

  return (
    <section className="grid grid-cols-1 gap-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {/* <>
        {currentProperties?.map((post, i) =>
          i === currentProperties.length - 1 ? (
            <HomeOfferCard key={post.id} property={post} />
          ) : (
            <div key={post.id} className="cursor-pointer">
              <HomeOfferCard property={post} />
            </div>
          ),
        )}
      </> */}
    </section>
  );
}
